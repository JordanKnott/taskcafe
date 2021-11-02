package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jordanknott/taskcafe/internal/db"
	"github.com/jordanknott/taskcafe/internal/logger"
	log "github.com/sirupsen/logrus"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *mutationResolver) CreateTeamMember(ctx context.Context, input CreateTeamMember) (*CreateTeamMemberPayload, error) {
	addedDate := time.Now().UTC()
	team, err := r.Repository.GetTeamByID(ctx, input.TeamID)
	if err != nil {
		return &CreateTeamMemberPayload{}, err
	}
	_, err = r.Repository.CreateTeamMember(ctx, db.CreateTeamMemberParams{TeamID: input.TeamID, UserID: input.UserID, Addeddate: addedDate, RoleCode: RoleCodeMember.String()})
	user, err := r.Repository.GetUserAccountByID(ctx, input.UserID)
	if err != nil {
		return &CreateTeamMemberPayload{}, err
	}
	var url *string
	if user.ProfileAvatarUrl.Valid {
		url = &user.ProfileAvatarUrl.String
	}
	profileIcon := &ProfileIcon{url, &user.Initials, &user.ProfileBgColor}
	return &CreateTeamMemberPayload{
		Team: &team,
		TeamMember: &Member{
			ID:          user.UserID,
			Username:    user.Username,
			FullName:    user.FullName,
			ProfileIcon: profileIcon,
			Role:        &db.Role{Code: "member", Name: "Member"},
		}}, nil
}

func (r *mutationResolver) UpdateTeamMemberRole(ctx context.Context, input UpdateTeamMemberRole) (*UpdateTeamMemberRolePayload, error) {
	user, err := r.Repository.GetUserAccountByID(ctx, input.UserID)
	if err != nil {
		logger.New(ctx).WithError(err).Error("get user account")
		return &UpdateTeamMemberRolePayload{Ok: false}, err
	}
	_, err = r.Repository.UpdateTeamMemberRole(ctx, db.UpdateTeamMemberRoleParams{TeamID: input.TeamID,
		UserID: input.UserID, RoleCode: input.RoleCode.String()})
	if err != nil {
		logger.New(ctx).WithError(err).Error("update project member role")
		return &UpdateTeamMemberRolePayload{Ok: false}, err
	}
	role, err := r.Repository.GetRoleForTeamMember(ctx, db.GetRoleForTeamMemberParams{UserID: user.UserID, TeamID: input.TeamID})
	if err != nil {
		logger.New(ctx).WithError(err).Error("get role for project member")
		return &UpdateTeamMemberRolePayload{Ok: false}, err
	}
	var url *string
	if user.ProfileAvatarUrl.Valid {
		url = &user.ProfileAvatarUrl.String
	}
	profileIcon := &ProfileIcon{url, &user.Initials, &user.ProfileBgColor}
	if user.ProfileAvatarUrl.Valid {
		url = &user.ProfileAvatarUrl.String
	}
	member := Member{ID: user.UserID, FullName: user.FullName, ProfileIcon: profileIcon,
		Role: &db.Role{Code: role.Code, Name: role.Name},
	}
	return &UpdateTeamMemberRolePayload{Ok: true, Member: &member, TeamID: input.TeamID}, err
}

func (r *mutationResolver) DeleteTeamMember(ctx context.Context, input DeleteTeamMember) (*DeleteTeamMemberPayload, error) {
	err := r.Repository.DeleteTeamMember(ctx, db.DeleteTeamMemberParams{TeamID: input.TeamID, UserID: input.UserID})
	return &DeleteTeamMemberPayload{TeamID: input.TeamID, UserID: input.UserID}, err
}

func (r *mutationResolver) DeleteTeam(ctx context.Context, input DeleteTeam) (*DeleteTeamPayload, error) {
	team, err := r.Repository.GetTeamByID(ctx, input.TeamID)
	if err != nil {
		logger.New(ctx).Error(err)
		return &DeleteTeamPayload{Ok: false}, err
	}
	projects, err := r.Repository.GetAllProjectsForTeam(ctx, input.TeamID)
	if err != nil {
		logger.New(ctx).Error(err)
		return &DeleteTeamPayload{Ok: false}, err
	}
	err = r.Repository.DeleteTeamByID(ctx, input.TeamID)
	if err != nil {
		logger.New(ctx).Error(err)
		return &DeleteTeamPayload{Ok: false}, err
	}

	return &DeleteTeamPayload{Ok: true, Team: &team, Projects: projects}, nil
}

func (r *mutationResolver) CreateTeam(ctx context.Context, input NewTeam) (*db.Team, error) {
	userID, ok := GetUserID(ctx)
	if !ok {
		return &db.Team{}, nil
	}
	role, err := r.Repository.GetRoleForUserID(ctx, userID)
	if err != nil {
		log.WithError(err).Error("while creating team")
		return &db.Team{}, nil
	}
	if ConvertToRoleCode(role.Code) != RoleCodeAdmin {
		return &db.Team{}, &gqlerror.Error{
			Message: "Must be an organization admin",
			Extensions: map[string]interface{}{
				"code": "0-400",
			},
		}
	}
	createdAt := time.Now().UTC()
	team, err := r.Repository.CreateTeam(ctx, db.CreateTeamParams{OrganizationID: input.OrganizationID, CreatedAt: createdAt, Name: input.Name})
	if err != nil {
		log.WithError(err).Error("while creating team")
		return &db.Team{}, nil
	}
	_, err = r.Repository.CreateTeamMember(ctx, db.CreateTeamMemberParams{
		UserID:    userID,
		TeamID:    team.TeamID,
		Addeddate: createdAt,
		RoleCode:  "admin",
	})
	if err != nil {
		log.WithError(err).Error("error while creating team member")
		return &db.Team{}, nil
	}

	return &team, nil
}

func (r *teamResolver) ID(ctx context.Context, obj *db.Team) (uuid.UUID, error) {
	return obj.TeamID, nil
}

func (r *teamResolver) Permission(ctx context.Context, obj *db.Team) (*TeamPermission, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *teamResolver) Members(ctx context.Context, obj *db.Team) ([]Member, error) {
	members := []Member{}

	teamMembers, err := r.Repository.GetTeamMembersForTeamID(ctx, obj.TeamID)
	if err != nil {
		logger.New(ctx).Error("get project members for project id")
		return members, err
	}

	for _, teamMember := range teamMembers {
		user, err := r.Repository.GetUserAccountByID(ctx, teamMember.UserID)
		if err != nil {
			logger.New(ctx).WithError(err).Error("get user account by ID")
			return members, err
		}
		var url *string
		if user.ProfileAvatarUrl.Valid {
			url = &user.ProfileAvatarUrl.String
		}
		profileIcon := &ProfileIcon{url, &user.Initials, &user.ProfileBgColor}
		role, err := r.Repository.GetRoleForTeamMember(ctx, db.GetRoleForTeamMemberParams{UserID: user.UserID, TeamID: obj.TeamID})
		if err != nil {
			logger.New(ctx).WithError(err).Error("get role for projet member by user ID")
			return members, err
		}

		ownedList, err := GetOwnedList(ctx, r.Repository, user)
		if err != nil {
			return members, err
		}
		memberList, err := GetMemberList(ctx, r.Repository, user)
		if err != nil {
			return members, err
		}

		members = append(members, Member{ID: user.UserID, FullName: user.FullName, ProfileIcon: profileIcon,
			Username: user.Username, Owned: ownedList, Member: memberList, Role: &db.Role{Code: role.Code, Name: role.Name},
		})
	}
	return members, nil
}

// Team returns TeamResolver implementation.
func (r *Resolver) Team() TeamResolver { return &teamResolver{r} }

type teamResolver struct{ *Resolver }
