package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jordanknott/taskcafe/internal/auth"
	"github.com/jordanknott/taskcafe/internal/db"
	"github.com/jordanknott/taskcafe/internal/logger"
	"github.com/jordanknott/taskcafe/internal/utils"
	"github.com/lithammer/fuzzysearch/fuzzy"
	log "github.com/sirupsen/logrus"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"golang.org/x/crypto/bcrypt"
)

func (r *labelColorResolver) ID(ctx context.Context, obj *db.LabelColor) (uuid.UUID, error) {
	return obj.LabelColorID, nil
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
					err = utils.SendEmailInvite(r.EmailConfig, invite)
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

func (r *mutationResolver) CreateTask(ctx context.Context, input NewTask) (*db.Task, error) {
	createdAt := time.Now().UTC()
	logger.New(ctx).WithFields(log.Fields{"positon": input.Position, "taskGroupID": input.TaskGroupID}).Info("creating task")
	task, err := r.Repository.CreateTask(ctx, db.CreateTaskParams{input.TaskGroupID, createdAt, input.Name, input.Position})
	if err != nil {
		logger.New(ctx).WithError(err).Error("issue while creating task")
		return &db.Task{}, err
	}
	taskGroup, err := r.Repository.GetTaskGroupByID(ctx, input.TaskGroupID)
	if err != nil {
		logger.New(ctx).WithError(err).Error("issue while creating task")
		return &db.Task{}, err
	}
	data := map[string]string{
		"TaskGroup": taskGroup.Name,
	}
	userID, _ := GetUserID(ctx)
	d, err := json.Marshal(data)
	_, err = r.Repository.CreateTaskActivity(ctx, db.CreateTaskActivityParams{
		TaskID:         task.TaskID,
		Data:           d,
		CreatedAt:      createdAt,
		CausedBy:       userID,
		ActivityTypeID: 1,
	})

	if err != nil {
		logger.New(ctx).WithError(err).Error("issue while creating task")
		return &db.Task{}, err
	}
	return &task, nil
}

func (r *mutationResolver) DeleteTask(ctx context.Context, input DeleteTaskInput) (*DeleteTaskPayload, error) {
	logger.New(ctx).WithFields(log.Fields{
		"taskID": input.TaskID,
	}).Info("deleting task")
	err := r.Repository.DeleteTaskByID(ctx, input.TaskID)
	if err != nil {
		return &DeleteTaskPayload{}, err
	}
	return &DeleteTaskPayload{input.TaskID}, nil
}

func (r *mutationResolver) UpdateTaskDescription(ctx context.Context, input UpdateTaskDescriptionInput) (*db.Task, error) {
	task, err := r.Repository.UpdateTaskDescription(ctx, db.UpdateTaskDescriptionParams{input.TaskID, sql.NullString{String: input.Description, Valid: true}})
	return &task, err
}

func (r *mutationResolver) UpdateTaskLocation(ctx context.Context, input NewTaskLocation) (*UpdateTaskLocationPayload, error) {
	userID, _ := GetUserID(ctx)
	previousTask, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	if err != nil {
		return &UpdateTaskLocationPayload{}, err
	}
	task, _ := r.Repository.UpdateTaskLocation(ctx, db.UpdateTaskLocationParams{TaskID: input.TaskID, TaskGroupID: input.TaskGroupID, Position: input.Position})
	if previousTask.TaskGroupID != input.TaskGroupID {
		skipAndDelete := false
		lastMove, err := r.Repository.GetLastMoveForTaskID(ctx, input.TaskID)
		if err == nil {
			if lastMove.Active && lastMove.PrevTaskGroupID == input.TaskGroupID.String() {
				skipAndDelete = true
			}
		}
		if skipAndDelete {
			_ = r.Repository.SetInactiveLastMoveForTaskID(ctx, input.TaskID)
		} else {
			prevTaskGroup, _ := r.Repository.GetTaskGroupByID(ctx, previousTask.TaskGroupID)
			curTaskGroup, _ := r.Repository.GetTaskGroupByID(ctx, input.TaskGroupID)

			data := map[string]string{
				"PrevTaskGroup":   prevTaskGroup.Name,
				"PrevTaskGroupID": prevTaskGroup.TaskGroupID.String(),
				"CurTaskGroup":    curTaskGroup.Name,
				"CurTaskGroupID":  curTaskGroup.TaskGroupID.String(),
			}

			createdAt := time.Now().UTC()
			d, _ := json.Marshal(data)
			_, err = r.Repository.CreateTaskActivity(ctx, db.CreateTaskActivityParams{
				TaskID:         task.TaskID,
				Data:           d,
				CausedBy:       userID,
				CreatedAt:      createdAt,
				ActivityTypeID: 2,
			})
		}
	}
	return &UpdateTaskLocationPayload{Task: &task, PreviousTaskGroupID: previousTask.TaskGroupID}, err
}

func (r *mutationResolver) UpdateTaskName(ctx context.Context, input UpdateTaskName) (*db.Task, error) {
	task, err := r.Repository.UpdateTaskName(ctx, db.UpdateTaskNameParams{input.TaskID, input.Name})
	return &task, err
}

func (r *mutationResolver) SetTaskComplete(ctx context.Context, input SetTaskComplete) (*db.Task, error) {
	completedAt := time.Now().UTC()
	data := map[string]string{}
	activityType := TASK_MARK_INCOMPLETE
	if input.Complete {
		activityType = TASK_MARK_COMPLETE
	}
	createdAt := time.Now().UTC()
	userID, _ := GetUserID(ctx)
	d, err := json.Marshal(data)
	_, err = r.Repository.CreateTaskActivity(ctx, db.CreateTaskActivityParams{
		TaskID:         input.TaskID,
		Data:           d,
		CausedBy:       userID,
		CreatedAt:      createdAt,
		ActivityTypeID: activityType,
	})
	task, err := r.Repository.SetTaskComplete(ctx, db.SetTaskCompleteParams{TaskID: input.TaskID, Complete: input.Complete, CompletedAt: sql.NullTime{Time: completedAt, Valid: true}})
	if err != nil {
		return &db.Task{}, err
	}
	return &task, nil
}

func (r *mutationResolver) UpdateTaskDueDate(ctx context.Context, input UpdateTaskDueDate) (*db.Task, error) {
	userID, _ := GetUserID(ctx)
	prevTask, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	if err != nil {
		return &db.Task{}, err
	}
	data := map[string]string{}
	var activityType = TASK_DUE_DATE_ADDED
	if input.DueDate == nil && prevTask.DueDate.Valid {
		activityType = TASK_DUE_DATE_REMOVED
		data["PrevDueDate"] = prevTask.DueDate.Time.String()
	} else if prevTask.DueDate.Valid {
		activityType = TASK_DUE_DATE_CHANGED
		data["PrevDueDate"] = prevTask.DueDate.Time.String()
		data["CurDueDate"] = input.DueDate.String()
	} else {
		data["DueDate"] = input.DueDate.String()
	}
	var dueDate sql.NullTime
	if input.DueDate == nil {
		dueDate = sql.NullTime{Valid: false, Time: time.Now()}
	} else {
		dueDate = sql.NullTime{Valid: true, Time: *input.DueDate}
	}
	task, err := r.Repository.UpdateTaskDueDate(ctx, db.UpdateTaskDueDateParams{
		TaskID:  input.TaskID,
		DueDate: dueDate,
	})
	createdAt := time.Now().UTC()
	d, err := json.Marshal(data)
	_, err = r.Repository.CreateTaskActivity(ctx, db.CreateTaskActivityParams{
		TaskID:         task.TaskID,
		Data:           d,
		CausedBy:       userID,
		CreatedAt:      createdAt,
		ActivityTypeID: activityType,
	})

	return &task, err
}

func (r *mutationResolver) AssignTask(ctx context.Context, input *AssignTaskInput) (*db.Task, error) {
	assignedDate := time.Now().UTC()
	assignedTask, err := r.Repository.CreateTaskAssigned(ctx, db.CreateTaskAssignedParams{input.TaskID, input.UserID, assignedDate})
	logger.New(ctx).WithFields(log.Fields{
		"assignedUserID": assignedTask.UserID,
		"taskID":         assignedTask.TaskID,
		"assignedTaskID": assignedTask.TaskAssignedID,
	}).Info("assigned task")
	if err != nil {
		return &db.Task{}, err
	}
	// r.NotificationQueue.TaskMemberWasAdded(assignedTask.TaskID, userID, assignedTask.UserID)
	task, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	return &task, err
}

func (r *mutationResolver) UnassignTask(ctx context.Context, input *UnassignTaskInput) (*db.Task, error) {
	task, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	if err != nil {
		return &db.Task{}, err
	}
	_, err = r.Repository.DeleteTaskAssignedByID(ctx, db.DeleteTaskAssignedByIDParams{input.TaskID, input.UserID})
	if err != nil {
		return &db.Task{}, err
	}
	return &task, nil
}

func (r *mutationResolver) CreateTaskChecklist(ctx context.Context, input CreateTaskChecklist) (*db.TaskChecklist, error) {
	createdAt := time.Now().UTC()
	taskChecklist, err := r.Repository.CreateTaskChecklist(ctx, db.CreateTaskChecklistParams{
		TaskID:    input.TaskID,
		CreatedAt: createdAt,
		Name:      input.Name,
		Position:  input.Position,
	})
	if err != nil {
		return &db.TaskChecklist{}, err
	}

	return &taskChecklist, nil
}

func (r *mutationResolver) DeleteTaskChecklist(ctx context.Context, input DeleteTaskChecklist) (*DeleteTaskChecklistPayload, error) {
	taskChecklist, err := r.Repository.GetTaskChecklistByID(ctx, input.TaskChecklistID)
	if err != nil {
		return &DeleteTaskChecklistPayload{Ok: false}, err
	}
	err = r.Repository.DeleteTaskChecklistByID(ctx, input.TaskChecklistID)
	if err != nil {
		return &DeleteTaskChecklistPayload{Ok: false}, err
	}
	return &DeleteTaskChecklistPayload{Ok: true, TaskChecklist: &taskChecklist}, nil
}

func (r *mutationResolver) UpdateTaskChecklistName(ctx context.Context, input UpdateTaskChecklistName) (*db.TaskChecklist, error) {
	checklist, err := r.Repository.UpdateTaskChecklistName(ctx, db.UpdateTaskChecklistNameParams{TaskChecklistID: input.TaskChecklistID, Name: input.Name})
	if err != nil {
		return &db.TaskChecklist{}, err
	}
	return &checklist, nil
}

func (r *mutationResolver) CreateTaskChecklistItem(ctx context.Context, input CreateTaskChecklistItem) (*db.TaskChecklistItem, error) {
	createdAt := time.Now().UTC()
	taskChecklistItem, err := r.Repository.CreateTaskChecklistItem(ctx, db.CreateTaskChecklistItemParams{
		TaskChecklistID: input.TaskChecklistID,
		CreatedAt:       createdAt,
		Name:            input.Name,
		Position:        input.Position,
	})
	if err != nil {
		return &db.TaskChecklistItem{}, err
	}

	return &taskChecklistItem, nil
}

func (r *mutationResolver) UpdateTaskChecklistLocation(ctx context.Context, input UpdateTaskChecklistLocation) (*UpdateTaskChecklistLocationPayload, error) {
	checklist, err := r.Repository.UpdateTaskChecklistPosition(ctx, db.UpdateTaskChecklistPositionParams{Position: input.Position, TaskChecklistID: input.TaskChecklistID})

	if err != nil {
		return &UpdateTaskChecklistLocationPayload{}, err
	}

	return &UpdateTaskChecklistLocationPayload{Checklist: &checklist}, nil
}

func (r *mutationResolver) UpdateTaskChecklistItemName(ctx context.Context, input UpdateTaskChecklistItemName) (*db.TaskChecklistItem, error) {
	task, err := r.Repository.UpdateTaskChecklistItemName(ctx, db.UpdateTaskChecklistItemNameParams{TaskChecklistItemID: input.TaskChecklistItemID,
		Name: input.Name,
	})
	if err != nil {
		return &db.TaskChecklistItem{}, err
	}
	return &task, nil
}

func (r *mutationResolver) SetTaskChecklistItemComplete(ctx context.Context, input SetTaskChecklistItemComplete) (*db.TaskChecklistItem, error) {
	item, err := r.Repository.SetTaskChecklistItemComplete(ctx, db.SetTaskChecklistItemCompleteParams{TaskChecklistItemID: input.TaskChecklistItemID, Complete: input.Complete})
	if err != nil {
		return &db.TaskChecklistItem{}, err
	}
	return &item, nil
}

func (r *mutationResolver) DeleteTaskChecklistItem(ctx context.Context, input DeleteTaskChecklistItem) (*DeleteTaskChecklistItemPayload, error) {
	item, err := r.Repository.GetTaskChecklistItemByID(ctx, input.TaskChecklistItemID)
	if err != nil {
		return &DeleteTaskChecklistItemPayload{
			Ok:                false,
			TaskChecklistItem: &db.TaskChecklistItem{},
		}, err
	}
	err = r.Repository.DeleteTaskChecklistItem(ctx, input.TaskChecklistItemID)
	if err != nil {
		return &DeleteTaskChecklistItemPayload{
			Ok:                false,
			TaskChecklistItem: &db.TaskChecklistItem{},
		}, err
	}
	return &DeleteTaskChecklistItemPayload{
		Ok:                true,
		TaskChecklistItem: &item,
	}, err
}

func (r *mutationResolver) UpdateTaskChecklistItemLocation(ctx context.Context, input UpdateTaskChecklistItemLocation) (*UpdateTaskChecklistItemLocationPayload, error) {
	currentChecklistItem, err := r.Repository.GetTaskChecklistItemByID(ctx, input.TaskChecklistItemID)

	checklistItem, err := r.Repository.UpdateTaskChecklistItemLocation(ctx, db.UpdateTaskChecklistItemLocationParams{TaskChecklistID: input.TaskChecklistID, TaskChecklistItemID: input.TaskChecklistItemID, Position: input.Position})
	if err != nil {
		return &UpdateTaskChecklistItemLocationPayload{}, err
	}
	return &UpdateTaskChecklistItemLocationPayload{PrevChecklistID: currentChecklistItem.TaskChecklistID, TaskChecklistID: input.TaskChecklistID, ChecklistItem: &checklistItem}, err
}

func (r *mutationResolver) CreateTaskComment(ctx context.Context, input *CreateTaskComment) (*CreateTaskCommentPayload, error) {
	userID, _ := GetUserID(ctx)
	createdAt := time.Now().UTC()
	comment, err := r.Repository.CreateTaskComment(ctx, db.CreateTaskCommentParams{
		TaskID:    input.TaskID,
		CreatedAt: createdAt,
		CreatedBy: userID,
		Message:   input.Message,
	})
	return &CreateTaskCommentPayload{Comment: &comment, TaskID: input.TaskID}, err
}

func (r *mutationResolver) DeleteTaskComment(ctx context.Context, input *DeleteTaskComment) (*DeleteTaskCommentPayload, error) {
	task, err := r.Repository.DeleteTaskCommentByID(ctx, input.CommentID)
	return &DeleteTaskCommentPayload{TaskID: task.TaskID, CommentID: input.CommentID}, err
}

func (r *mutationResolver) UpdateTaskComment(ctx context.Context, input *UpdateTaskComment) (*UpdateTaskCommentPayload, error) {
	updatedAt := time.Now().UTC()
	comment, err := r.Repository.UpdateTaskComment(ctx, db.UpdateTaskCommentParams{
		TaskCommentID: input.CommentID,
		UpdatedAt:     sql.NullTime{Valid: true, Time: updatedAt},
		Message:       input.Message,
	})
	return &UpdateTaskCommentPayload{Comment: &comment}, err
}

func (r *mutationResolver) CreateTaskGroup(ctx context.Context, input NewTaskGroup) (*db.TaskGroup, error) {
	createdAt := time.Now().UTC()
	project, err := r.Repository.CreateTaskGroup(ctx,
		db.CreateTaskGroupParams{input.ProjectID, createdAt, input.Name, input.Position})
	return &project, err
}

func (r *mutationResolver) UpdateTaskGroupLocation(ctx context.Context, input NewTaskGroupLocation) (*db.TaskGroup, error) {
	taskGroup, err := r.Repository.UpdateTaskGroupLocation(ctx, db.UpdateTaskGroupLocationParams{
		input.TaskGroupID,
		input.Position,
	})
	return &taskGroup, err
}

func (r *mutationResolver) UpdateTaskGroupName(ctx context.Context, input UpdateTaskGroupName) (*db.TaskGroup, error) {
	taskGroup, err := r.Repository.SetTaskGroupName(ctx, db.SetTaskGroupNameParams{TaskGroupID: input.TaskGroupID, Name: input.Name})
	if err != nil {
		return &db.TaskGroup{}, err
	}
	return &taskGroup, nil
}

func (r *mutationResolver) DeleteTaskGroup(ctx context.Context, input DeleteTaskGroupInput) (*DeleteTaskGroupPayload, error) {
	deletedTasks, err := r.Repository.DeleteTasksByTaskGroupID(ctx, input.TaskGroupID)
	if err != nil {
		return &DeleteTaskGroupPayload{}, err
	}
	taskGroup, err := r.Repository.GetTaskGroupByID(ctx, input.TaskGroupID)
	if err != nil {
		return &DeleteTaskGroupPayload{}, err
	}
	deletedTaskGroups, err := r.Repository.DeleteTaskGroupByID(ctx, input.TaskGroupID)
	if err != nil {
		return &DeleteTaskGroupPayload{}, err
	}
	return &DeleteTaskGroupPayload{true, int(deletedTasks + deletedTaskGroups), &taskGroup}, nil
}

func (r *mutationResolver) DuplicateTaskGroup(ctx context.Context, input DuplicateTaskGroup) (*DuplicateTaskGroupPayload, error) {
	createdAt := time.Now().UTC()
	taskGroup, err := r.Repository.CreateTaskGroup(ctx, db.CreateTaskGroupParams{ProjectID: input.ProjectID, Position: input.Position, Name: input.Name, CreatedAt: createdAt})
	if err != nil {
		return &DuplicateTaskGroupPayload{}, err
	}

	originalTasks, err := r.Repository.GetTasksForTaskGroupID(ctx, input.TaskGroupID)
	if err != nil && err != sql.ErrNoRows {
		return &DuplicateTaskGroupPayload{}, err
	}
	for _, originalTask := range originalTasks {
		task, err := r.Repository.CreateTaskAll(ctx, db.CreateTaskAllParams{
			TaskGroupID: taskGroup.TaskGroupID, CreatedAt: createdAt, Name: originalTask.Name, Position: originalTask.Position,
			Complete: originalTask.Complete, DueDate: originalTask.DueDate, Description: originalTask.Description})
		if err != nil {
			return &DuplicateTaskGroupPayload{}, err
		}
		members, err := r.Repository.GetAssignedMembersForTask(ctx, originalTask.TaskID)
		if err != nil {
			return &DuplicateTaskGroupPayload{}, err
		}
		for _, member := range members {
			_, err := r.Repository.CreateTaskAssigned(ctx, db.CreateTaskAssignedParams{
				TaskID: task.TaskID, UserID: member.UserID, AssignedDate: member.AssignedDate})
			if err != nil {
				return &DuplicateTaskGroupPayload{}, err
			}
		}
		labels, err := r.Repository.GetTaskLabelsForTaskID(ctx, originalTask.TaskID)
		if err != nil {
			return &DuplicateTaskGroupPayload{}, err
		}
		for _, label := range labels {
			_, err := r.Repository.CreateTaskLabelForTask(ctx, db.CreateTaskLabelForTaskParams{
				TaskID: task.TaskID, ProjectLabelID: label.ProjectLabelID, AssignedDate: label.AssignedDate})
			if err != nil {
				return &DuplicateTaskGroupPayload{}, err
			}
		}
		checklists, err := r.Repository.GetTaskChecklistsForTask(ctx, originalTask.TaskID)
		if err != nil {
			return &DuplicateTaskGroupPayload{}, err
		}
		for _, checklist := range checklists {
			newChecklist, err := r.Repository.CreateTaskChecklist(ctx, db.CreateTaskChecklistParams{
				TaskID: task.TaskID, Name: checklist.Name, CreatedAt: createdAt, Position: checklist.Position})
			if err != nil {
				return &DuplicateTaskGroupPayload{}, err
			}
			checklistItems, err := r.Repository.GetTaskChecklistItemsForTaskChecklist(ctx, checklist.TaskChecklistID)
			if err != nil {
				return &DuplicateTaskGroupPayload{}, err
			}
			for _, checklistItem := range checklistItems {
				item, err := r.Repository.CreateTaskChecklistItem(ctx, db.CreateTaskChecklistItemParams{
					TaskChecklistID: newChecklist.TaskChecklistID,
					CreatedAt:       createdAt,
					Name:            checklistItem.Name,
					Position:        checklist.Position,
				})
				if checklistItem.Complete {
					r.Repository.SetTaskChecklistItemComplete(ctx, db.SetTaskChecklistItemCompleteParams{TaskChecklistItemID: item.TaskChecklistItemID, Complete: true})
				}
				if err != nil {
					return &DuplicateTaskGroupPayload{}, err
				}
			}

		}
	}
	if err != nil {
		return &DuplicateTaskGroupPayload{}, err
	}
	return &DuplicateTaskGroupPayload{TaskGroup: &taskGroup}, err
}

func (r *mutationResolver) SortTaskGroup(ctx context.Context, input SortTaskGroup) (*SortTaskGroupPayload, error) {
	tasks := []db.Task{}
	for _, task := range input.Tasks {
		t, err := r.Repository.UpdateTaskPosition(ctx, db.UpdateTaskPositionParams{TaskID: task.TaskID, Position: task.Position})
		if err != nil {
			return &SortTaskGroupPayload{}, err
		}
		tasks = append(tasks, t)
	}
	return &SortTaskGroupPayload{Tasks: tasks, TaskGroupID: input.TaskGroupID}, nil
}

func (r *mutationResolver) DeleteTaskGroupTasks(ctx context.Context, input DeleteTaskGroupTasks) (*DeleteTaskGroupTasksPayload, error) {
	tasks, err := r.Repository.GetTasksForTaskGroupID(ctx, input.TaskGroupID)
	if err != nil && err != sql.ErrNoRows {
		return &DeleteTaskGroupTasksPayload{}, err
	}
	removedTasks := []uuid.UUID{}
	for _, task := range tasks {
		err = r.Repository.DeleteTaskByID(ctx, task.TaskID)
		if err != nil {
			return &DeleteTaskGroupTasksPayload{}, err
		}
		removedTasks = append(removedTasks, task.TaskID)
	}
	return &DeleteTaskGroupTasksPayload{TaskGroupID: input.TaskGroupID, Tasks: removedTasks}, nil
}

func (r *mutationResolver) AddTaskLabel(ctx context.Context, input *AddTaskLabelInput) (*db.Task, error) {
	assignedDate := time.Now().UTC()
	_, err := r.Repository.CreateTaskLabelForTask(ctx, db.CreateTaskLabelForTaskParams{input.TaskID, input.ProjectLabelID, assignedDate})
	if err != nil {
		return &db.Task{}, err
	}
	task, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	return &task, nil
}

func (r *mutationResolver) RemoveTaskLabel(ctx context.Context, input *RemoveTaskLabelInput) (*db.Task, error) {
	taskLabel, err := r.Repository.GetTaskLabelByID(ctx, input.TaskLabelID)
	if err != nil {
		return &db.Task{}, err
	}
	task, err := r.Repository.GetTaskByID(ctx, taskLabel.TaskID)
	if err != nil {
		return &db.Task{}, err
	}
	err = r.Repository.DeleteTaskLabelByID(ctx, input.TaskLabelID)
	return &task, err
}

func (r *mutationResolver) ToggleTaskLabel(ctx context.Context, input ToggleTaskLabelInput) (*ToggleTaskLabelPayload, error) {
	task, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	if err != nil {
		return &ToggleTaskLabelPayload{}, err
	}

	_, err = r.Repository.GetTaskLabelForTaskByProjectLabelID(ctx, db.GetTaskLabelForTaskByProjectLabelIDParams{TaskID: input.TaskID, ProjectLabelID: input.ProjectLabelID})
	createdAt := time.Now().UTC()

	if err == sql.ErrNoRows {
		logger.New(ctx).WithFields(log.Fields{"err": err}).Warning("no rows")
		_, err := r.Repository.CreateTaskLabelForTask(ctx, db.CreateTaskLabelForTaskParams{
			TaskID:         input.TaskID,
			ProjectLabelID: input.ProjectLabelID,
			AssignedDate:   createdAt,
		})
		if err != nil {
			return &ToggleTaskLabelPayload{}, err
		}
		payload := ToggleTaskLabelPayload{Active: true, Task: &task}
		return &payload, nil
	}

	if err != nil {
		return &ToggleTaskLabelPayload{}, err
	}

	err = r.Repository.DeleteTaskLabelForTaskByProjectLabelID(ctx, db.DeleteTaskLabelForTaskByProjectLabelIDParams{
		TaskID:         input.TaskID,
		ProjectLabelID: input.ProjectLabelID,
	})

	if err != nil {
		return &ToggleTaskLabelPayload{}, err
	}

	payload := ToggleTaskLabelPayload{Active: false, Task: &task}
	return &payload, nil
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
	_, role, ok := GetUser(ctx)
	if !ok {
		return &db.Team{}, nil
	}
	if role == auth.RoleAdmin {
		createdAt := time.Now().UTC()
		team, err := r.Repository.CreateTeam(ctx, db.CreateTeamParams{OrganizationID: input.OrganizationID, CreatedAt: createdAt, Name: input.Name})
		return &team, err
	}
	return &db.Team{}, &gqlerror.Error{
		Message: "You must be an organization admin to create new teams",
		Extensions: map[string]interface{}{
			"code": "1-400",
		},
	}
}

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

func (r *mutationResolver) CreateRefreshToken(ctx context.Context, input NewRefreshToken) (*db.RefreshToken, error) {
	userID := uuid.MustParse("0183d9ab-d0ed-4c9b-a3df-77a0cdd93dca")
	refreshCreatedAt := time.Now().UTC()
	refreshExpiresAt := refreshCreatedAt.AddDate(0, 0, 1)
	refreshToken, err := r.Repository.CreateRefreshToken(ctx, db.CreateRefreshTokenParams{userID, refreshCreatedAt, refreshExpiresAt})
	return &refreshToken, err
}

func (r *mutationResolver) CreateUserAccount(ctx context.Context, input NewUserAccount) (*db.UserAccount, error) {
	_, role, ok := GetUser(ctx)
	if !ok {
		return &db.UserAccount{}, nil
	}
	if role != auth.RoleAdmin {
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
	userAccount, err := r.Repository.CreateUserAccount(ctx, db.CreateUserAccountParams{
		FullName:     input.FullName,
		RoleCode:     input.RoleCode,
		Initials:     input.Initials,
		Email:        input.Email,
		Username:     input.Username,
		CreatedAt:    createdAt,
		PasswordHash: string(hashedPwd),
	})
	return &userAccount, err
}

func (r *mutationResolver) DeleteUserAccount(ctx context.Context, input DeleteUserAccount) (*DeleteUserAccountPayload, error) {
	_, role, ok := GetUser(ctx)
	if !ok {
		return &DeleteUserAccountPayload{Ok: false}, nil
	}
	if role != auth.RoleAdmin {
		return &DeleteUserAccountPayload{Ok: false}, &gqlerror.Error{
			Message: "User not found",
			Extensions: map[string]interface{}{
				"code": "0-401",
			},
		}
	}
	user, err := r.Repository.GetUserAccountByID(ctx, input.UserID)
	if err != nil {
		return &DeleteUserAccountPayload{Ok: false}, err
	}

	// TODO(jordanknott) migrate admin ownership

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
	err := r.Repository.DeleteRefreshTokenByUserID(ctx, input.UserID)
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
	_, role, ok := GetUser(ctx)
	if !ok {
		return &UpdateUserRolePayload{}, nil
	}
	if role != auth.RoleAdmin {
		return &UpdateUserRolePayload{}, &gqlerror.Error{
			Message: "User not found",
			Extensions: map[string]interface{}{
				"code": "0-401",
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

func (r *notificationResolver) ID(ctx context.Context, obj *db.Notification) (uuid.UUID, error) {
	return obj.NotificationID, nil
}

func (r *notificationResolver) Entity(ctx context.Context, obj *db.Notification) (*NotificationEntity, error) {
	logger.New(ctx).WithFields(log.Fields{"notificationID": obj.NotificationID}).Info("fetching entity for notification")
	entity, err := r.Repository.GetEntityForNotificationID(ctx, obj.NotificationID)
	logger.New(ctx).WithFields(log.Fields{"entityID": entity.EntityID}).Info("fetched entity")
	if err != nil {
		return &NotificationEntity{}, err
	}
	entityType := GetEntityType(entity.EntityType)
	switch entityType {
	case EntityTypeTask:
		task, err := r.Repository.GetTaskByID(ctx, entity.EntityID)
		if err != nil {
			return &NotificationEntity{}, err
		}
		return &NotificationEntity{Type: entityType, ID: entity.EntityID, Name: task.Name}, err

	default:
		panic(fmt.Errorf("not implemented"))
	}
}

func (r *notificationResolver) ActionType(ctx context.Context, obj *db.Notification) (ActionType, error) {
	entity, err := r.Repository.GetEntityForNotificationID(ctx, obj.NotificationID)
	if err != nil {
		return ActionTypeTaskMemberAdded, err
	}
	actionType := GetActionType(entity.ActionType)
	return actionType, nil
}

func (r *notificationResolver) Actor(ctx context.Context, obj *db.Notification) (*NotificationActor, error) {
	entity, err := r.Repository.GetEntityForNotificationID(ctx, obj.NotificationID)
	if err != nil {
		return &NotificationActor{}, err
	}
	logger.New(ctx).WithFields(log.Fields{"entityID": entity.ActorID}).Info("fetching actor")
	user, err := r.Repository.GetUserAccountByID(ctx, entity.ActorID)
	if err != nil {
		return &NotificationActor{}, err
	}
	return &NotificationActor{ID: entity.ActorID, Name: user.FullName, Type: ActorTypeUser}, nil
}

func (r *notificationResolver) CreatedAt(ctx context.Context, obj *db.Notification) (*time.Time, error) {
	entity, err := r.Repository.GetEntityForNotificationID(ctx, obj.NotificationID)
	if err != nil {
		return &time.Time{}, err
	}
	return &entity.CreatedOn, nil
}

func (r *organizationResolver) ID(ctx context.Context, obj *db.Organization) (uuid.UUID, error) {
	return obj.OrganizationID, nil
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

func (r *queryResolver) Organizations(ctx context.Context) ([]db.Organization, error) {
	return r.Repository.GetAllOrganizations(ctx)
}

func (r *queryResolver) Users(ctx context.Context) ([]db.UserAccount, error) {
	return r.Repository.GetAllUserAccounts(ctx)
}

func (r *queryResolver) InvitedUsers(ctx context.Context) ([]InvitedUserAccount, error) {
	invitedMembers, err := r.Repository.GetInvitedUserAccounts(ctx)
	if err != nil {
		if err == sql.ErrNoRows {
			return []InvitedUserAccount{}, nil
		}
		return []InvitedUserAccount{}, err
	}
	members := []InvitedUserAccount{}
	for _, invitedMember := range invitedMembers {
		members = append(members, InvitedUserAccount{
			ID:        invitedMember.UserAccountInvitedID,
			Email:     invitedMember.Email,
			InvitedOn: invitedMember.InvitedOn,
		})
	}
	return members, nil
}

func (r *queryResolver) FindUser(ctx context.Context, input FindUser) (*db.UserAccount, error) {
	account, err := r.Repository.GetUserAccountByID(ctx, input.UserID)
	if err == sql.ErrNoRows {
		return &db.UserAccount{}, &gqlerror.Error{
			Message: "User not found",
			Extensions: map[string]interface{}{
				"code": "10-404",
			},
		}
	}
	return &account, err
}

func (r *queryResolver) FindProject(ctx context.Context, input FindProject) (*db.Project, error) {
	logger.New(ctx).Info("finding project user")
	project, err := r.Repository.GetProjectByID(ctx, input.ProjectID)
	if err == sql.ErrNoRows {
		return &db.Project{}, &gqlerror.Error{
			Message: "Project not found",
			Extensions: map[string]interface{}{
				"code": "11-404",
			},
		}
	}
	return &project, nil
}

func (r *queryResolver) FindTask(ctx context.Context, input FindTask) (*db.Task, error) {
	task, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	return &task, err
}

func (r *queryResolver) Projects(ctx context.Context, input *ProjectsFilter) ([]db.Project, error) {
	userID, orgRole, ok := GetUser(ctx)
	if !ok {
		logger.New(ctx).Info("user id was not found from middleware")
		return []db.Project{}, nil
	}
	logger.New(ctx).Info("fetching projects")

	if input != nil {
		return r.Repository.GetAllProjectsForTeam(ctx, *input.TeamID)
	}

	var teams []db.Team
	var err error
	if orgRole == "admin" {
		teams, err = r.Repository.GetAllTeams(ctx)
	} else {
		teams, err = r.Repository.GetTeamsForUserIDWhereAdmin(ctx, userID)
	}

	projects := make(map[string]db.Project)
	for _, team := range teams {
		logger.New(ctx).WithField("teamID", team.TeamID).Info("found team")
		teamProjects, err := r.Repository.GetAllProjectsForTeam(ctx, team.TeamID)
		if err != sql.ErrNoRows && err != nil {
			log.Info("issue getting team projects")
			return []db.Project{}, nil
		}
		for _, project := range teamProjects {
			logger.New(ctx).WithField("projectID", project.ProjectID).Info("adding team project")
			projects[project.ProjectID.String()] = project
		}
	}

	visibleProjects, err := r.Repository.GetAllVisibleProjectsForUserID(ctx, userID)
	if err != nil {
		logger.New(ctx).Info("error getting visible projects for user")
		return []db.Project{}, nil
	}
	for _, project := range visibleProjects {
		logger.New(ctx).WithField("projectID", project.ProjectID).Info("found visible project")
		if _, ok := projects[project.ProjectID.String()]; !ok {
			logger.New(ctx).WithField("projectID", project.ProjectID).Info("adding visible project")
			projects[project.ProjectID.String()] = project
		}
	}
	logger.New(ctx).WithField("projectLength", len(projects)).Info("making projects")
	allProjects := make([]db.Project, 0, len(projects))
	for _, project := range projects {
		logger.New(ctx).WithField("projectID", project.ProjectID).Info("adding project to final list")
		allProjects = append(allProjects, project)
	}
	return allProjects, nil
}

func (r *queryResolver) FindTeam(ctx context.Context, input FindTeam) (*db.Team, error) {
	team, err := r.Repository.GetTeamByID(ctx, input.TeamID)
	if err != nil {
		return &db.Team{}, err
	}
	return &team, nil
}

func (r *queryResolver) Teams(ctx context.Context) ([]db.Team, error) {
	userID, orgRole, ok := GetUser(ctx)
	if !ok {
		logger.New(ctx).Error("userID or org role does not exist")
		return []db.Team{}, errors.New("internal error")
	}
	if orgRole == "admin" {

		return r.Repository.GetAllTeams(ctx)
	}

	teams := make(map[string]db.Team)
	adminTeams, err := r.Repository.GetTeamsForUserIDWhereAdmin(ctx, userID)
	if err != nil {
		logger.New(ctx).WithError(err).Error("error while getting teams for user ID")
		return []db.Team{}, err
	}

	for _, team := range adminTeams {
		teams[team.TeamID.String()] = team
	}

	visibleProjects, err := r.Repository.GetAllVisibleProjectsForUserID(ctx, userID)
	if err != nil {
		logger.New(ctx).WithError(err).Error("error while getting visible projects for user ID")
		return []db.Team{}, err
	}
	for _, project := range visibleProjects {
		logger.New(ctx).WithField("projectID", project.ProjectID).Info("found visible project")
		if _, ok := teams[project.ProjectID.String()]; !ok {
			logger.New(ctx).WithField("projectID", project.ProjectID).Info("adding visible project")
			team, err := r.Repository.GetTeamByID(ctx, project.TeamID)
			if err != nil {
				if err == sql.ErrNoRows {
					continue
				}
				logger.New(ctx).WithField("teamID", project.TeamID).WithError(err).Error("error getting team by id")
				return []db.Team{}, err
			}
			teams[project.TeamID.String()] = team
		}
	}
	foundTeams := make([]db.Team, 0, len(teams))
	for _, team := range teams {
		foundTeams = append(foundTeams, team)
	}
	return foundTeams, nil
}

func (r *queryResolver) LabelColors(ctx context.Context) ([]db.LabelColor, error) {
	return r.Repository.GetLabelColors(ctx)
}

func (r *queryResolver) TaskGroups(ctx context.Context) ([]db.TaskGroup, error) {
	return r.Repository.GetAllTaskGroups(ctx)
}

func (r *queryResolver) Me(ctx context.Context) (*MePayload, error) {
	userID, ok := GetUserID(ctx)
	if !ok {
		return &MePayload{}, fmt.Errorf("internal server error")
	}
	user, err := r.Repository.GetUserAccountByID(ctx, userID)
	if err == sql.ErrNoRows {
		logger.New(ctx).Warning("can not find user for me query")
		return &MePayload{}, nil
	} else if err != nil {
		return &MePayload{}, err
	}
	var projectRoles []ProjectRole
	projects, err := r.Repository.GetProjectRolesForUserID(ctx, userID)
	if err != nil {
		return &MePayload{}, err
	}
	for _, project := range projects {
		projectRoles = append(projectRoles, ProjectRole{ProjectID: project.ProjectID, RoleCode: ConvertToRoleCode("admin")})
		// projectRoles = append(projectRoles, ProjectRole{ProjectID: project.ProjectID, RoleCode: ConvertToRoleCode(project.RoleCode)})
	}
	var teamRoles []TeamRole
	teams, err := r.Repository.GetTeamRolesForUserID(ctx, userID)
	if err != nil {
		return &MePayload{}, err
	}
	for _, team := range teams {
		// teamRoles = append(teamRoles, TeamRole{TeamID: team.TeamID, RoleCode: ConvertToRoleCode(team.RoleCode)})
		teamRoles = append(teamRoles, TeamRole{TeamID: team.TeamID, RoleCode: ConvertToRoleCode("admin")})
	}
	return &MePayload{User: &user, TeamRoles: teamRoles, ProjectRoles: projectRoles}, err
}

func (r *queryResolver) Notifications(ctx context.Context) ([]db.Notification, error) {
	userID, ok := GetUserID(ctx)
	logger.New(ctx).Info("fetching notifications")
	if !ok {
		return []db.Notification{}, errors.New("user id is missing")
	}
	notifications, err := r.Repository.GetAllNotificationsForUserID(ctx, userID)
	if err == sql.ErrNoRows {
		return []db.Notification{}, nil
	} else if err != nil {
		return []db.Notification{}, err
	}
	return notifications, nil
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

func (r *refreshTokenResolver) ID(ctx context.Context, obj *db.RefreshToken) (uuid.UUID, error) {
	return obj.TokenID, nil
}

func (r *taskResolver) ID(ctx context.Context, obj *db.Task) (uuid.UUID, error) {
	return obj.TaskID, nil
}

func (r *taskResolver) TaskGroup(ctx context.Context, obj *db.Task) (*db.TaskGroup, error) {
	taskGroup, err := r.Repository.GetTaskGroupByID(ctx, obj.TaskGroupID)
	return &taskGroup, err
}

func (r *taskResolver) Description(ctx context.Context, obj *db.Task) (*string, error) {
	task, err := r.Repository.GetTaskByID(ctx, obj.TaskID)
	if err != nil {
		return nil, err
	}
	if !task.Description.Valid {
		return nil, nil
	}
	return &task.Description.String, nil
}

func (r *taskResolver) DueDate(ctx context.Context, obj *db.Task) (*time.Time, error) {
	if obj.DueDate.Valid {
		return &obj.DueDate.Time, nil
	}
	return nil, nil
}

func (r *taskResolver) CompletedAt(ctx context.Context, obj *db.Task) (*time.Time, error) {
	if obj.CompletedAt.Valid {
		return &obj.CompletedAt.Time, nil
	}
	return nil, nil
}

func (r *taskResolver) Assigned(ctx context.Context, obj *db.Task) ([]Member, error) {
	taskMemberLinks, err := r.Repository.GetAssignedMembersForTask(ctx, obj.TaskID)
	taskMembers := []Member{}
	if err != nil {
		return taskMembers, err
	}
	for _, taskMemberLink := range taskMemberLinks {
		user, err := r.Repository.GetUserAccountByID(ctx, taskMemberLink.UserID)
		if err != nil {
			return taskMembers, err
		}
		var url *string
		if user.ProfileAvatarUrl.Valid {
			url = &user.ProfileAvatarUrl.String
		}
		profileIcon := &ProfileIcon{url, &user.Initials, &user.ProfileBgColor}
		projectID, err := r.Repository.GetProjectIDForTask(ctx, obj.TaskID)
		if err != nil {
			return taskMembers, err
		}
		role, err := r.Repository.GetRoleForProjectMemberByUserID(ctx, db.GetRoleForProjectMemberByUserIDParams{UserID: user.UserID, ProjectID: projectID})

		if err != nil {
			if err == sql.ErrNoRows {
				role = db.Role{Code: "owner", Name: "Owner"}
			} else {
				logger.New(ctx).WithError(err).Error("get role for project member")
				return taskMembers, err
			}
		}
		taskMembers = append(taskMembers, Member{ID: taskMemberLink.UserID, FullName: user.FullName, ProfileIcon: profileIcon,
			Role: &role,
		})
	}
	return taskMembers, nil
}

func (r *taskResolver) Labels(ctx context.Context, obj *db.Task) ([]db.TaskLabel, error) {
	return r.Repository.GetTaskLabelsForTaskID(ctx, obj.TaskID)
}

func (r *taskResolver) Checklists(ctx context.Context, obj *db.Task) ([]db.TaskChecklist, error) {
	return r.Repository.GetTaskChecklistsForTask(ctx, obj.TaskID)
}

func (r *taskResolver) Badges(ctx context.Context, obj *db.Task) (*TaskBadges, error) {
	checklists, err := r.Repository.GetTaskChecklistsForTask(ctx, obj.TaskID)
	if err != nil {
		return &TaskBadges{}, err
	}
	if len(checklists) == 0 {
		return &TaskBadges{Checklist: nil}, err
	}
	complete := 0
	total := 0
	for _, checklist := range checklists {
		items, err := r.Repository.GetTaskChecklistItemsForTaskChecklist(ctx, checklist.TaskChecklistID)
		if err != nil {
			return &TaskBadges{}, err
		}
		for _, item := range items {
			total++
			if item.Complete {
				complete++
			}
		}
	}
	if complete == 0 && total == 0 {
		return &TaskBadges{Checklist: nil}, nil
	}
	return &TaskBadges{Checklist: &ChecklistBadge{Total: total, Complete: complete}}, nil
}

func (r *taskResolver) Activity(ctx context.Context, obj *db.Task) ([]db.TaskActivity, error) {
	activity, err := r.Repository.GetActivityForTaskID(ctx, obj.TaskID)
	if err == sql.ErrNoRows {
		return []db.TaskActivity{}, nil
	}
	return activity, err
}

func (r *taskResolver) Comments(ctx context.Context, obj *db.Task) ([]db.TaskComment, error) {
	comments, err := r.Repository.GetCommentsForTaskID(ctx, obj.TaskID)
	if err == sql.ErrNoRows {
		return []db.TaskComment{}, nil
	}
	return comments, err
}

func (r *taskActivityResolver) ID(ctx context.Context, obj *db.TaskActivity) (uuid.UUID, error) {
	return obj.TaskActivityID, nil
}

func (r *taskActivityResolver) Type(ctx context.Context, obj *db.TaskActivity) (ActivityType, error) {
	switch obj.ActivityTypeID {
	case 1:
		return ActivityTypeTaskAdded, nil
	case 2:
		return ActivityTypeTaskMoved, nil
	case 3:
		return ActivityTypeTaskMarkedComplete, nil
	case 4:
		return ActivityTypeTaskMarkedIncomplete, nil
	case 5:
		return ActivityTypeTaskDueDateChanged, nil
	case 6:
		return ActivityTypeTaskDueDateAdded, nil
	case 7:
		return ActivityTypeTaskDueDateRemoved, nil
	case 8:
		return ActivityTypeTaskChecklistChanged, nil
	case 9:
		return ActivityTypeTaskChecklistAdded, nil
	case 10:
		return ActivityTypeTaskChecklistRemoved, nil
	default:
		return ActivityTypeTaskAdded, errors.New("unknown type")
	}
}

func (r *taskActivityResolver) Data(ctx context.Context, obj *db.TaskActivity) ([]TaskActivityData, error) {
	var data map[string]string
	_ = json.Unmarshal(obj.Data, &data)
	activity := []TaskActivityData{}
	for name, value := range data {
		activity = append(activity, TaskActivityData{
			Name:  name,
			Value: value,
		})
	}
	return activity, nil
}

func (r *taskActivityResolver) CausedBy(ctx context.Context, obj *db.TaskActivity) (*CausedBy, error) {
	user, err := r.Repository.GetUserAccountByID(ctx, obj.CausedBy)
	var url *string
	if user.ProfileAvatarUrl.Valid {
		url = &user.ProfileAvatarUrl.String
	}
	profileIcon := &ProfileIcon{url, &user.Initials, &user.ProfileBgColor}
	return &CausedBy{
		ID:          obj.CausedBy,
		FullName:    user.FullName,
		ProfileIcon: profileIcon,
	}, err
}

func (r *taskChecklistResolver) ID(ctx context.Context, obj *db.TaskChecklist) (uuid.UUID, error) {
	return obj.TaskChecklistID, nil
}

func (r *taskChecklistResolver) Items(ctx context.Context, obj *db.TaskChecklist) ([]db.TaskChecklistItem, error) {
	return r.Repository.GetTaskChecklistItemsForTaskChecklist(ctx, obj.TaskChecklistID)
}

func (r *taskChecklistItemResolver) ID(ctx context.Context, obj *db.TaskChecklistItem) (uuid.UUID, error) {
	return obj.TaskChecklistItemID, nil
}

func (r *taskChecklistItemResolver) DueDate(ctx context.Context, obj *db.TaskChecklistItem) (*time.Time, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *taskCommentResolver) ID(ctx context.Context, obj *db.TaskComment) (uuid.UUID, error) {
	return obj.TaskCommentID, nil
}

func (r *taskCommentResolver) UpdatedAt(ctx context.Context, obj *db.TaskComment) (*time.Time, error) {
	if obj.UpdatedAt.Valid {
		return &obj.UpdatedAt.Time, nil
	}
	return nil, nil
}

func (r *taskCommentResolver) CreatedBy(ctx context.Context, obj *db.TaskComment) (*CreatedBy, error) {
	user, err := r.Repository.GetUserAccountByID(ctx, obj.CreatedBy)
	var url *string
	if user.ProfileAvatarUrl.Valid {
		url = &user.ProfileAvatarUrl.String
	}
	profileIcon := &ProfileIcon{url, &user.Initials, &user.ProfileBgColor}
	return &CreatedBy{
		ID:          obj.CreatedBy,
		FullName:    user.FullName,
		ProfileIcon: profileIcon,
	}, err
}

func (r *taskGroupResolver) ID(ctx context.Context, obj *db.TaskGroup) (uuid.UUID, error) {
	return obj.TaskGroupID, nil
}

func (r *taskGroupResolver) ProjectID(ctx context.Context, obj *db.TaskGroup) (string, error) {
	return obj.ProjectID.String(), nil
}

func (r *taskGroupResolver) Tasks(ctx context.Context, obj *db.TaskGroup) ([]db.Task, error) {
	tasks, err := r.Repository.GetTasksForTaskGroupID(ctx, obj.TaskGroupID)
	return tasks, err
}

func (r *taskLabelResolver) ID(ctx context.Context, obj *db.TaskLabel) (uuid.UUID, error) {
	return obj.TaskLabelID, nil
}

func (r *taskLabelResolver) ProjectLabel(ctx context.Context, obj *db.TaskLabel) (*db.ProjectLabel, error) {
	projectLabel, err := r.Repository.GetProjectLabelByID(ctx, obj.ProjectLabelID)
	return &projectLabel, err
}

func (r *teamResolver) ID(ctx context.Context, obj *db.Team) (uuid.UUID, error) {
	return obj.TeamID, nil
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

// LabelColor returns LabelColorResolver implementation.
func (r *Resolver) LabelColor() LabelColorResolver { return &labelColorResolver{r} }

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Notification returns NotificationResolver implementation.
func (r *Resolver) Notification() NotificationResolver { return &notificationResolver{r} }

// Organization returns OrganizationResolver implementation.
func (r *Resolver) Organization() OrganizationResolver { return &organizationResolver{r} }

// Project returns ProjectResolver implementation.
func (r *Resolver) Project() ProjectResolver { return &projectResolver{r} }

// ProjectLabel returns ProjectLabelResolver implementation.
func (r *Resolver) ProjectLabel() ProjectLabelResolver { return &projectLabelResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

// RefreshToken returns RefreshTokenResolver implementation.
func (r *Resolver) RefreshToken() RefreshTokenResolver { return &refreshTokenResolver{r} }

// Task returns TaskResolver implementation.
func (r *Resolver) Task() TaskResolver { return &taskResolver{r} }

// TaskActivity returns TaskActivityResolver implementation.
func (r *Resolver) TaskActivity() TaskActivityResolver { return &taskActivityResolver{r} }

// TaskChecklist returns TaskChecklistResolver implementation.
func (r *Resolver) TaskChecklist() TaskChecklistResolver { return &taskChecklistResolver{r} }

// TaskChecklistItem returns TaskChecklistItemResolver implementation.
func (r *Resolver) TaskChecklistItem() TaskChecklistItemResolver {
	return &taskChecklistItemResolver{r}
}

// TaskComment returns TaskCommentResolver implementation.
func (r *Resolver) TaskComment() TaskCommentResolver { return &taskCommentResolver{r} }

// TaskGroup returns TaskGroupResolver implementation.
func (r *Resolver) TaskGroup() TaskGroupResolver { return &taskGroupResolver{r} }

// TaskLabel returns TaskLabelResolver implementation.
func (r *Resolver) TaskLabel() TaskLabelResolver { return &taskLabelResolver{r} }

// Team returns TeamResolver implementation.
func (r *Resolver) Team() TeamResolver { return &teamResolver{r} }

// UserAccount returns UserAccountResolver implementation.
func (r *Resolver) UserAccount() UserAccountResolver { return &userAccountResolver{r} }

type labelColorResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type notificationResolver struct{ *Resolver }
type organizationResolver struct{ *Resolver }
type projectResolver struct{ *Resolver }
type projectLabelResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type refreshTokenResolver struct{ *Resolver }
type taskResolver struct{ *Resolver }
type taskActivityResolver struct{ *Resolver }
type taskChecklistResolver struct{ *Resolver }
type taskChecklistItemResolver struct{ *Resolver }
type taskCommentResolver struct{ *Resolver }
type taskGroupResolver struct{ *Resolver }
type taskLabelResolver struct{ *Resolver }
type teamResolver struct{ *Resolver }
type userAccountResolver struct{ *Resolver }
