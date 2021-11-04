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
	"github.com/jordanknott/taskcafe/internal/utils"
	log "github.com/sirupsen/logrus"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *labelColorResolver) ID(ctx context.Context, obj *db.LabelColor) (uuid.UUID, error) {
	return obj.LabelColorID, nil
}

func (r *mutationResolver) CreateProjectLabel(ctx context.Context, input NewProjectLabel) (*db.ProjectLabel, error) {
	createdAt := time.Now().UTC()

	var name sql.NullString
	if input.Name != nil {
		name = sql.NullString{
			*input.Name,
			true,
		}
	} else {
		name = sql.NullString{
			"",
			false,
		}
	}
	projectLabel, err := r.Repository.CreateProjectLabel(ctx, db.CreateProjectLabelParams{input.ProjectID, input.LabelColorID, createdAt, name})
	return &projectLabel, err
}

func (r *mutationResolver) DeleteProjectLabel(ctx context.Context, input DeleteProjectLabel) (*db.ProjectLabel, error) {
	label, err := r.Repository.GetProjectLabelByID(ctx, input.ProjectLabelID)
	if err != nil {
		return &db.ProjectLabel{}, err
	}
	err = r.Repository.DeleteProjectLabelByID(ctx, input.ProjectLabelID)
	return &label, err
}

func (r *mutationResolver) UpdateProjectLabel(ctx context.Context, input UpdateProjectLabel) (*db.ProjectLabel, error) {
	label, err := r.Repository.UpdateProjectLabel(ctx, db.UpdateProjectLabelParams{ProjectLabelID: input.ProjectLabelID, LabelColorID: input.LabelColorID, Name: sql.NullString{String: input.Name, Valid: true}})
	return &label, err
}

func (r *mutationResolver) UpdateProjectLabelName(ctx context.Context, input UpdateProjectLabelName) (*db.ProjectLabel, error) {
	label, err := r.Repository.UpdateProjectLabelName(ctx, db.UpdateProjectLabelNameParams{ProjectLabelID: input.ProjectLabelID, Name: sql.NullString{String: input.Name, Valid: true}})
	return &label, err
}

func (r *mutationResolver) UpdateProjectLabelColor(ctx context.Context, input UpdateProjectLabelColor) (*db.ProjectLabel, error) {
	label, err := r.Repository.UpdateProjectLabelColor(ctx, db.UpdateProjectLabelColorParams{ProjectLabelID: input.ProjectLabelID, LabelColorID: input.LabelColorID})
	return &label, err
}

func (r *mutationResolver) InviteProjectMembers(ctx context.Context, input InviteProjectMembers) (*InviteProjectMembersPayload, error) {
	members := []Member{}
	invitedMembers := []InvitedMember{}
	for _, invitedMember := range input.Members {
		if invitedMember.Email != nil && invitedMember.UserID != nil {
			return &InviteProjectMembersPayload{Ok: false}, &gqlerror.Error{
				Message: "Both email and userID can not be used to invite a project member",
				Extensions: map[string]interface{}{
					"code": "403",
				},
			}
		} else if invitedMember.Email == nil && invitedMember.UserID == nil {
			return &InviteProjectMembersPayload{Ok: false}, &gqlerror.Error{
				Message: "Either email or userID must be set to invite a project member",
				Extensions: map[string]interface{}{
					"code": "403",
				},
			}
		}
		if invitedMember.UserID != nil {
			// Invite by user ID
			addedAt := time.Now().UTC()
			_, err := r.Repository.CreateProjectMember(ctx, db.CreateProjectMemberParams{ProjectID: input.ProjectID, UserID: *invitedMember.UserID, AddedAt: addedAt, RoleCode: "member"})
			if err != nil {
				return &InviteProjectMembersPayload{Ok: false}, err
			}
			user, err := r.Repository.GetUserAccountByID(ctx, *invitedMember.UserID)
			if err != nil && err != sql.ErrNoRows {
				return &InviteProjectMembersPayload{Ok: false}, err

			}
			var url *string
			if user.ProfileAvatarUrl.Valid {
				url = &user.ProfileAvatarUrl.String
			}
			profileIcon := &ProfileIcon{url, &user.Initials, &user.ProfileBgColor}

			role, err := r.Repository.GetRoleForProjectMemberByUserID(ctx, db.GetRoleForProjectMemberByUserIDParams{UserID: *invitedMember.UserID, ProjectID: input.ProjectID})
			if err != nil {
				return &InviteProjectMembersPayload{Ok: false}, err
			}
			members = append(members, Member{
				ID:          *invitedMember.UserID,
				FullName:    user.FullName,
				Username:    user.Username,
				ProfileIcon: profileIcon,
				Role:        &db.Role{Code: role.Code, Name: role.Name},
			})
		} else {
			// Invite by email

			// if invited user does not exist, create entry
			invitedUser, err := r.Repository.GetInvitedUserByEmail(ctx, *invitedMember.Email)
			now := time.Now().UTC()
			if err != nil {
				if err == sql.ErrNoRows {
					invitedUser, err = r.Repository.CreateInvitedUser(ctx, *invitedMember.Email)
					if err != nil {
						return &InviteProjectMembersPayload{Ok: false}, err
					}
					confirmToken, err := r.Repository.CreateConfirmToken(ctx, *invitedMember.Email)
					if err != nil {
						return &InviteProjectMembersPayload{Ok: false}, err
					}
					invite := utils.EmailInvite{To: *invitedMember.Email, FullName: *invitedMember.Email, ConfirmToken: confirmToken.ConfirmTokenID.String()}
					err = utils.SendEmailInvite(r.AppConfig.Email, invite)
					if err != nil {
						logger.New(ctx).WithError(err).Error("issue sending email")
						return &InviteProjectMembersPayload{Ok: false}, err
					}
				} else {
					return &InviteProjectMembersPayload{Ok: false}, err
				}
			}

			_, err = r.Repository.CreateInvitedProjectMember(ctx, db.CreateInvitedProjectMemberParams{
				ProjectID:            input.ProjectID,
				UserAccountInvitedID: invitedUser.UserAccountInvitedID,
			})
			if err != nil {
				return &InviteProjectMembersPayload{Ok: false}, err
			}
			logger.New(ctx).Info("adding invited member")
			invitedMembers = append(invitedMembers, InvitedMember{Email: *invitedMember.Email, InvitedOn: now})

		}
	}
	return &InviteProjectMembersPayload{Ok: false, ProjectID: input.ProjectID, Members: members, InvitedMembers: invitedMembers}, nil
}

func (r *mutationResolver) DeleteProjectMember(ctx context.Context, input DeleteProjectMember) (*DeleteProjectMemberPayload, error) {
	user, err := r.Repository.GetUserAccountByID(ctx, input.UserID)
	if err != nil {
		return &DeleteProjectMemberPayload{Ok: false}, err
	}
	var url *string
	if user.ProfileAvatarUrl.Valid {
		url = &user.ProfileAvatarUrl.String
	}
	profileIcon := &ProfileIcon{url, &user.Initials, &user.ProfileBgColor}
	role, err := r.Repository.GetRoleForProjectMemberByUserID(ctx, db.GetRoleForProjectMemberByUserIDParams{UserID: input.UserID, ProjectID: input.ProjectID})
	if err != nil {
		return &DeleteProjectMemberPayload{Ok: false}, err
	}
	err = r.Repository.DeleteProjectMember(ctx, db.DeleteProjectMemberParams{UserID: input.UserID, ProjectID: input.ProjectID})
	if err != nil {
		return &DeleteProjectMemberPayload{Ok: false}, err
	}
	return &DeleteProjectMemberPayload{Ok: true, Member: &Member{
		ID:          input.UserID,
		FullName:    user.FullName,
		ProfileIcon: profileIcon,
		Role:        &db.Role{Code: role.Code, Name: role.Name},
	}, ProjectID: input.ProjectID}, nil
}

func (r *mutationResolver) UpdateProjectMemberRole(ctx context.Context, input UpdateProjectMemberRole) (*UpdateProjectMemberRolePayload, error) {
	user, err := r.Repository.GetUserAccountByID(ctx, input.UserID)
	if err != nil {
		logger.New(ctx).WithError(err).Error("get user account")
		return &UpdateProjectMemberRolePayload{Ok: false}, err
	}
	_, err = r.Repository.UpdateProjectMemberRole(ctx, db.UpdateProjectMemberRoleParams{ProjectID: input.ProjectID,
		UserID: input.UserID, RoleCode: input.RoleCode.String()})
	if err != nil {
		logger.New(ctx).WithError(err).Error("update project member role")
		return &UpdateProjectMemberRolePayload{Ok: false}, err
	}
	role, err := r.Repository.GetRoleForProjectMemberByUserID(ctx, db.GetRoleForProjectMemberByUserIDParams{UserID: user.UserID, ProjectID: input.ProjectID})
	if err != nil {
		logger.New(ctx).WithError(err).Error("get role for project member")
		return &UpdateProjectMemberRolePayload{Ok: false}, err
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
	return &UpdateProjectMemberRolePayload{Ok: true, Member: &member}, err
}

func (r *mutationResolver) DeleteInvitedProjectMember(ctx context.Context, input DeleteInvitedProjectMember) (*DeleteInvitedProjectMemberPayload, error) {
	member, err := r.Repository.GetProjectMemberInvitedIDByEmail(ctx, input.Email)
	if err != nil {
		return &DeleteInvitedProjectMemberPayload{}, err
	}
	err = r.Repository.DeleteInvitedProjectMemberByID(ctx, member.ProjectMemberInvitedID)
	if err != nil {
		return &DeleteInvitedProjectMemberPayload{}, err
	}
	return &DeleteInvitedProjectMemberPayload{
		InvitedMember: &InvitedMember{Email: member.Email, InvitedOn: member.InvitedOn},
	}, nil
}

func (r *mutationResolver) CreateProject(ctx context.Context, input NewProject) (*db.Project, error) {
	userID, ok := GetUserID(ctx)
	if !ok {
		return &db.Project{}, errors.New("user id is missing")
	}
	createdAt := time.Now().UTC()
	logger.New(ctx).WithFields(log.Fields{"name": input.Name, "teamID": input.TeamID}).Info("creating new project")
	var project db.Project
	var err error
	if input.TeamID == nil {
		project, err = r.Repository.CreatePersonalProject(ctx, db.CreatePersonalProjectParams{
			CreatedAt: createdAt,
			Name:      input.Name,
		})
		if err != nil {
			logger.New(ctx).WithError(err).Error("error while creating project")
			return &db.Project{}, err
		}
		logger.New(ctx).WithField("projectID", project.ProjectID).Info("creating personal project link")
	} else {
		project, err = r.Repository.CreateTeamProject(ctx, db.CreateTeamProjectParams{
			CreatedAt: createdAt,
			Name:      input.Name,
			TeamID:    *input.TeamID,
		})
		if err != nil {
			logger.New(ctx).WithError(err).Error("error while creating project")
			return &db.Project{}, err
		}
	}
	_, err = r.Repository.CreateProjectMember(ctx, db.CreateProjectMemberParams{ProjectID: project.ProjectID, UserID: userID, AddedAt: createdAt, RoleCode: "admin"})
	if err != nil {
		logger.New(ctx).WithError(err).Error("error while creating initial project member")
		return &db.Project{}, err
	}
	return &project, nil
}

func (r *mutationResolver) DeleteProject(ctx context.Context, input DeleteProject) (*DeleteProjectPayload, error) {
	project, err := r.Repository.GetProjectByID(ctx, input.ProjectID)
	if err != nil {
		return &DeleteProjectPayload{Ok: false}, err
	}
	err = r.Repository.DeleteProjectByID(ctx, input.ProjectID)
	if err != nil {
		return &DeleteProjectPayload{Ok: false}, err
	}
	return &DeleteProjectPayload{Project: &project, Ok: true}, err
}

func (r *mutationResolver) UpdateProjectName(ctx context.Context, input *UpdateProjectName) (*db.Project, error) {
	project, err := r.Repository.UpdateProjectNameByID(ctx, db.UpdateProjectNameByIDParams{ProjectID: input.ProjectID, Name: input.Name})
	if err != nil {
		return &db.Project{}, err
	}
	return &project, nil
}

func (r *mutationResolver) ToggleProjectVisibility(ctx context.Context, input ToggleProjectVisibility) (*ToggleProjectVisibilityPayload, error) {
	if input.IsPublic {
		project, err := r.Repository.SetPublicOn(ctx, db.SetPublicOnParams{ProjectID: input.ProjectID, PublicOn: sql.NullTime{Valid: true, Time: time.Now().UTC()}})
		return &ToggleProjectVisibilityPayload{Project: &project}, err
	}
	project, err := r.Repository.SetPublicOn(ctx, db.SetPublicOnParams{ProjectID: input.ProjectID, PublicOn: sql.NullTime{Valid: false, Time: time.Time{}}})
	return &ToggleProjectVisibilityPayload{Project: &project}, err
}

func (r *projectResolver) ID(ctx context.Context, obj *db.Project) (uuid.UUID, error) {
	return obj.ProjectID, nil
}

func (r *projectResolver) Team(ctx context.Context, obj *db.Project) (*db.Team, error) {
	team, err := r.Repository.GetTeamByID(ctx, obj.TeamID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		logger.New(ctx).WithFields(log.Fields{"teamID": obj.TeamID, "projectID": obj.ProjectID}).WithError(err).Error("issue while getting team for project")
		return &team, err
	}
	return &team, nil
}

func (r *projectResolver) TaskGroups(ctx context.Context, obj *db.Project) ([]db.TaskGroup, error) {
	return r.Repository.GetTaskGroupsForProject(ctx, obj.ProjectID)
}

func (r *projectResolver) Members(ctx context.Context, obj *db.Project) ([]Member, error) {
	members := []Member{}
	projectMembers, err := r.Repository.GetProjectMembersForProjectID(ctx, obj.ProjectID)
	if err != nil {
		logger.New(ctx).WithError(err).Error("get project members for project id")
		return members, err
	}

	for _, projectMember := range projectMembers {
		user, err := r.Repository.GetUserAccountByID(ctx, projectMember.UserID)
		if err != nil {
			logger.New(ctx).WithError(err).Error("get user account by ID")
			return members, err
		}
		var url *string
		if user.ProfileAvatarUrl.Valid {
			url = &user.ProfileAvatarUrl.String
		}
		role, err := r.Repository.GetRoleForProjectMemberByUserID(ctx, db.GetRoleForProjectMemberByUserIDParams{UserID: user.UserID, ProjectID: obj.ProjectID})
		if err != nil {
			logger.New(ctx).WithError(err).Error("get role for projet member by user ID")
			return members, err
		}
		profileIcon := &ProfileIcon{url, &user.Initials, &user.ProfileBgColor}
		members = append(members, Member{ID: user.UserID, FullName: user.FullName, ProfileIcon: profileIcon,
			Username: user.Username, Role: &db.Role{Code: role.Code, Name: role.Name},
		})
	}
	return members, nil
}

func (r *projectResolver) InvitedMembers(ctx context.Context, obj *db.Project) ([]InvitedMember, error) {
	members, err := r.Repository.GetInvitedMembersForProjectID(ctx, obj.ProjectID)
	if err != nil && err == sql.ErrNoRows {
		return []InvitedMember{}, nil
	}
	invited := []InvitedMember{}
	for _, member := range members {
		invited = append(invited, InvitedMember{Email: member.Email, InvitedOn: member.InvitedOn})
	}
	return invited, err
}

func (r *projectResolver) PublicOn(ctx context.Context, obj *db.Project) (*time.Time, error) {
	if obj.PublicOn.Valid {
		return &obj.PublicOn.Time, nil
	}
	return nil, nil
}

func (r *projectResolver) Permission(ctx context.Context, obj *db.Project) (*ProjectPermission, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *projectResolver) Labels(ctx context.Context, obj *db.Project) ([]db.ProjectLabel, error) {
	labels, err := r.Repository.GetProjectLabelsForProject(ctx, obj.ProjectID)
	return labels, err
}

func (r *projectLabelResolver) ID(ctx context.Context, obj *db.ProjectLabel) (uuid.UUID, error) {
	return obj.ProjectLabelID, nil
}

func (r *projectLabelResolver) LabelColor(ctx context.Context, obj *db.ProjectLabel) (*db.LabelColor, error) {
	labelColor, err := r.Repository.GetLabelColorByID(ctx, obj.LabelColorID)
	if err != nil {
		return &db.LabelColor{}, err
	}
	return &labelColor, nil
}

func (r *projectLabelResolver) Name(ctx context.Context, obj *db.ProjectLabel) (*string, error) {
	var name *string
	if obj.Name.Valid {
		name = &obj.Name.String
	}
	return name, nil
}

func (r *queryResolver) FindProject(ctx context.Context, input FindProject) (*db.Project, error) {
	_, isLoggedIn := GetUser(ctx)
	var projectID uuid.UUID
	var err error
	if input.ProjectID != nil {
		projectID = *input.ProjectID
	} else if input.ProjectShortID != nil {
		projectID, err = r.Repository.GetProjectIDByShortID(ctx, *input.ProjectShortID)
		if err != nil {
			log.WithError(err).Error("error while getting project id by short id")
			return &db.Project{}, err
		}
	} else {
		return &db.Project{}, errors.New("FindProject requires either ProjectID or ProjectShortID to be set")
	}
	if !isLoggedIn {
		isPublic, _ := IsProjectPublic(ctx, r.Repository, projectID)
		if !isPublic {
			return &db.Project{}, NotAuthorized()
		}
	}
	project, err := r.Repository.GetProjectByID(ctx, projectID)
	if err == sql.ErrNoRows {
		return &db.Project{}, &gqlerror.Error{
			Message: "Project not found",
			Extensions: map[string]interface{}{
				"code": "NOT_FOUND",
			},
		}
	}
	return &project, nil
}

// LabelColor returns LabelColorResolver implementation.
func (r *Resolver) LabelColor() LabelColorResolver { return &labelColorResolver{r} }

// Project returns ProjectResolver implementation.
func (r *Resolver) Project() ProjectResolver { return &projectResolver{r} }

// ProjectLabel returns ProjectLabelResolver implementation.
func (r *Resolver) ProjectLabel() ProjectLabelResolver { return &projectLabelResolver{r} }

type labelColorResolver struct{ *Resolver }
type projectResolver struct{ *Resolver }
type projectLabelResolver struct{ *Resolver }
