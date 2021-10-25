package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jordanknott/taskcafe/internal/db"
	"github.com/jordanknott/taskcafe/internal/logger"
	"github.com/lithammer/fuzzysearch/fuzzy"
	log "github.com/sirupsen/logrus"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"golang.org/x/crypto/bcrypt"
)

func (r *mutationResolver) CreateUserAccount(ctx context.Context, input NewUserAccount) (*db.UserAccount, error) {
	userID, ok := GetUserID(ctx)
	if !ok {
		return &db.UserAccount{}, nil
	}
	role, err := r.Repository.GetRoleForUserID(ctx, userID)
	if err != nil {
		log.WithError(err).Error("while creating user account")
		return &db.UserAccount{}, nil
	}
	if ConvertToRoleCode(role.Code) != RoleCodeAdmin {
		return &db.UserAccount{}, &gqlerror.Error{
			Message: "Must be an organization admin",
			Extensions: map[string]interface{}{
				"code": "0-400",
			},
		}
	}
	createdAt := time.Now().UTC()
	hashedPwd, err := bcrypt.GenerateFromPassword([]byte(input.Password), 14)
	if err != nil {
		return &db.UserAccount{}, err
	}

	userExists, err := r.Repository.DoesUserExist(ctx, db.DoesUserExistParams{Username: input.Username, Email: input.Email})
	if err != nil {
		return &db.UserAccount{}, err
	}
	if userExists {
		return &db.UserAccount{}, &gqlerror.Error{
			Message: "User with that username or email already exists",
			Extensions: map[string]interface{}{
				"code": "0-300",
			},
		}
	}
	userAccount, err := r.Repository.CreateUserAccount(ctx, db.CreateUserAccountParams{
		FullName:     input.FullName,
		RoleCode:     input.RoleCode,
		Initials:     input.Initials,
		Email:        input.Email,
		Username:     input.Username,
		CreatedAt:    createdAt,
		Active:       true,
		PasswordHash: string(hashedPwd),
	})
	return &userAccount, err
}

func (r *mutationResolver) DeleteUserAccount(ctx context.Context, input DeleteUserAccount) (*DeleteUserAccountPayload, error) {
	userID, ok := GetUserID(ctx)
	if !ok {
		return &DeleteUserAccountPayload{Ok: false}, nil
	}
	role, err := r.Repository.GetRoleForUserID(ctx, userID)
	if err != nil {
		log.WithError(err).Error("while deleting user account")
		return &DeleteUserAccountPayload{}, nil
	}
	if ConvertToRoleCode(role.Code) != RoleCodeAdmin {
		return &DeleteUserAccountPayload{}, &gqlerror.Error{
			Message: "Must be an organization admin",
			Extensions: map[string]interface{}{
				"code": "0-400",
			},
		}
	}
	user, err := r.Repository.GetUserAccountByID(ctx, input.UserID)
	if err != nil {
		return &DeleteUserAccountPayload{Ok: false}, err
	}

	err = r.Repository.DeleteUserAccountByID(ctx, input.UserID)
	if err != nil {
		return &DeleteUserAccountPayload{Ok: false}, err
	}
	return &DeleteUserAccountPayload{UserAccount: &user, Ok: true}, nil
}

func (r *mutationResolver) DeleteInvitedUserAccount(ctx context.Context, input DeleteInvitedUserAccount) (*DeleteInvitedUserAccountPayload, error) {
	user, err := r.Repository.DeleteInvitedUserAccount(ctx, input.InvitedUserID)
	if err != nil {
		return &DeleteInvitedUserAccountPayload{}, err
	}
	err = r.Repository.DeleteConfirmTokenForEmail(ctx, user.Email)
	if err != nil {
		logger.New(ctx).WithError(err).Error("issue deleting confirm token")
		return &DeleteInvitedUserAccountPayload{}, err
	}
	return &DeleteInvitedUserAccountPayload{
		InvitedUser: &InvitedUserAccount{
			Email:     user.Email,
			ID:        user.UserAccountInvitedID,
			InvitedOn: user.InvitedOn,
		},
	}, err
}

func (r *mutationResolver) LogoutUser(ctx context.Context, input LogoutUser) (bool, error) {
	err := r.Repository.DeleteAuthTokenByUserID(ctx, input.UserID)
	return true, err
}

func (r *mutationResolver) ClearProfileAvatar(ctx context.Context) (*db.UserAccount, error) {
	userID, ok := GetUserID(ctx)
	if !ok {
		return &db.UserAccount{}, fmt.Errorf("internal server error")
	}
	user, err := r.Repository.UpdateUserAccountProfileAvatarURL(ctx, db.UpdateUserAccountProfileAvatarURLParams{UserID: userID, ProfileAvatarUrl: sql.NullString{Valid: false, String: ""}})
	if err != nil {
		return &db.UserAccount{}, err
	}
	return &user, nil
}

func (r *mutationResolver) UpdateUserPassword(ctx context.Context, input UpdateUserPassword) (*UpdateUserPasswordPayload, error) {
	hashedPwd, err := bcrypt.GenerateFromPassword([]byte(input.Password), 14)
	if err != nil {
		return &UpdateUserPasswordPayload{}, err
	}
	user, err := r.Repository.SetUserPassword(ctx, db.SetUserPasswordParams{UserID: input.UserID, PasswordHash: string(hashedPwd)})
	if err != nil {
		return &UpdateUserPasswordPayload{}, err
	}
	return &UpdateUserPasswordPayload{Ok: true, User: &user}, err
}

func (r *mutationResolver) UpdateUserRole(ctx context.Context, input UpdateUserRole) (*UpdateUserRolePayload, error) {
	userID, ok := GetUserID(ctx)
	if !ok {
		return &UpdateUserRolePayload{}, nil
	}
	role, err := r.Repository.GetRoleForUserID(ctx, userID)
	if err != nil {
		log.WithError(err).Error("while updating user role")
		return &UpdateUserRolePayload{}, nil
	}
	if ConvertToRoleCode(role.Code) != RoleCodeAdmin {
		return &UpdateUserRolePayload{}, &gqlerror.Error{
			Message: "Must be an organization admin",
			Extensions: map[string]interface{}{
				"code": "0-400",
			},
		}
	}
	user, err := r.Repository.UpdateUserRole(ctx, db.UpdateUserRoleParams{RoleCode: input.RoleCode.String(), UserID: input.UserID})
	if err != nil {
		return &UpdateUserRolePayload{}, err
	}
	return &UpdateUserRolePayload{User: &user}, nil
}

func (r *mutationResolver) UpdateUserInfo(ctx context.Context, input UpdateUserInfo) (*UpdateUserInfoPayload, error) {
	userID, ok := GetUserID(ctx)
	if !ok {
		return &UpdateUserInfoPayload{}, errors.New("invalid user ID")
	}
	user, err := r.Repository.UpdateUserAccountInfo(ctx, db.UpdateUserAccountInfoParams{
		Bio: input.Bio, FullName: input.Name, Initials: input.Initials, Email: input.Email, UserID: userID,
	})
	return &UpdateUserInfoPayload{User: &user}, err
}

func (r *queryResolver) SearchMembers(ctx context.Context, input MemberSearchFilter) ([]MemberSearchResult, error) {
	availableMembers, err := r.Repository.GetMemberData(ctx, *input.ProjectID)
	if err != nil {
		logger.New(ctx).WithField("projectID", input.ProjectID).WithError(err).Error("error while getting member data")
		return []MemberSearchResult{}, err
	}

	invitedMembers, err := r.Repository.GetInvitedMembersForProjectID(ctx, *input.ProjectID)
	if err != nil {
		logger.New(ctx).WithField("projectID", input.ProjectID).WithError(err).Error("error while getting member data")
		return []MemberSearchResult{}, err
	}

	sortList := []string{}
	masterList := map[string]MasterEntry{}
	for _, member := range availableMembers {
		sortList = append(sortList, member.Username)
		sortList = append(sortList, member.Email)
		masterList[member.Username] = MasterEntry{ID: member.UserID, MemberType: MemberTypeJoined}
		masterList[member.Email] = MasterEntry{ID: member.UserID, MemberType: MemberTypeJoined}
	}
	for _, member := range invitedMembers {
		sortList = append(sortList, member.Email)
		logger.New(ctx).WithField("Email", member.Email).Info("adding member")
		masterList[member.Email] = MasterEntry{ID: member.UserAccountInvitedID, MemberType: MemberTypeInvited}
	}

	logger.New(ctx).WithField("searchFilter", input.SearchFilter).Info(sortList)
	rankedList := fuzzy.RankFind(input.SearchFilter, sortList)
	logger.New(ctx).Info(rankedList)
	results := []MemberSearchResult{}
	memberList := map[uuid.UUID]bool{}
	for _, rank := range rankedList {
		entry, _ := masterList[rank.Target]
		_, ok := memberList[entry.ID]
		logger.New(ctx).WithField("ok", ok).WithField("target", rank.Target).Info("checking rank")
		if !ok {
			if entry.MemberType == MemberTypeJoined {
				logger.New(ctx).WithFields(log.Fields{"source": rank.Source, "target": rank.Target}).Info("searching")
				entry := masterList[rank.Target]
				user, err := r.Repository.GetUserAccountByID(ctx, entry.ID)
				if err != nil {
					if err == sql.ErrNoRows {
						continue
					}
					return []MemberSearchResult{}, err
				}
				results = append(results, MemberSearchResult{ID: user.UserID.String(), User: &user, Status: ShareStatusJoined, Similarity: rank.Distance})
			} else {
				logger.New(ctx).WithField("id", rank.Target).Info("adding target")
				results = append(results, MemberSearchResult{ID: rank.Target, Status: ShareStatusInvited, Similarity: rank.Distance})

			}
			memberList[entry.ID] = true
		}
	}
	return results, nil
}

func (r *userAccountResolver) ID(ctx context.Context, obj *db.UserAccount) (uuid.UUID, error) {
	return obj.UserID, nil
}

func (r *userAccountResolver) Role(ctx context.Context, obj *db.UserAccount) (*db.Role, error) {
	role, err := r.Repository.GetRoleForUserID(ctx, obj.UserID)
	if err != nil {
		logger.New(ctx).WithError(err).Error("get role for user id")
		return &db.Role{}, err
	}
	return &db.Role{Code: role.Code, Name: role.Name}, nil
}

func (r *userAccountResolver) ProfileIcon(ctx context.Context, obj *db.UserAccount) (*ProfileIcon, error) {
	var url *string
	if obj.ProfileAvatarUrl.Valid {
		url = &obj.ProfileAvatarUrl.String
	}
	profileIcon := &ProfileIcon{url, &obj.Initials, &obj.ProfileBgColor}
	return profileIcon, nil
}

func (r *userAccountResolver) Owned(ctx context.Context, obj *db.UserAccount) (*OwnedList, error) {
	return &OwnedList{}, nil // TODO(jordanknott)
}

func (r *userAccountResolver) Member(ctx context.Context, obj *db.UserAccount) (*MemberList, error) {
	projectMemberIDs, err := r.Repository.GetMemberProjectIDsForUserID(ctx, obj.UserID)
	if err != sql.ErrNoRows && err != nil {
		return &MemberList{}, err
	}
	var projects []db.Project
	for _, projectID := range projectMemberIDs {
		project, err := r.Repository.GetProjectByID(ctx, projectID)
		if err != nil {
			return &MemberList{}, err
		}
		projects = append(projects, project)
	}
	teamMemberIDs, err := r.Repository.GetMemberTeamIDsForUserID(ctx, obj.UserID)
	if err != sql.ErrNoRows && err != nil {
		return &MemberList{}, err
	}
	var teams []db.Team
	for _, teamID := range teamMemberIDs {
		team, err := r.Repository.GetTeamByID(ctx, teamID)
		if err != nil {
			return &MemberList{}, err
		}
		teams = append(teams, team)
	}

	return &MemberList{Teams: teams, Projects: projects}, err
}

// UserAccount returns UserAccountResolver implementation.
func (r *Resolver) UserAccount() UserAccountResolver { return &userAccountResolver{r} }

type userAccountResolver struct{ *Resolver }
