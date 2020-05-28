package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jordanknott/project-citadel/api/pg"
	log "github.com/sirupsen/logrus"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *labelColorResolver) ID(ctx context.Context, obj *pg.LabelColor) (uuid.UUID, error) {
	return obj.LabelColorID, nil
}

func (r *mutationResolver) CreateRefreshToken(ctx context.Context, input NewRefreshToken) (*pg.RefreshToken, error) {
	userID := uuid.MustParse("0183d9ab-d0ed-4c9b-a3df-77a0cdd93dca")
	refreshCreatedAt := time.Now().UTC()
	refreshExpiresAt := refreshCreatedAt.AddDate(0, 0, 1)
	refreshToken, err := r.Repository.CreateRefreshToken(ctx, pg.CreateRefreshTokenParams{userID, refreshCreatedAt, refreshExpiresAt})
	return &refreshToken, err
}

func (r *mutationResolver) CreateUserAccount(ctx context.Context, input NewUserAccount) (*pg.UserAccount, error) {
	createdAt := time.Now().UTC()
	userAccount, err := r.Repository.CreateUserAccount(ctx, pg.CreateUserAccountParams{input.FirstName, input.LastName, input.Email, input.Username, createdAt, input.Password})
	return &userAccount, err
}

func (r *mutationResolver) CreateTeam(ctx context.Context, input NewTeam) (*pg.Team, error) {
	organizationID, err := uuid.Parse(input.OrganizationID)
	if err != nil {
		return &pg.Team{}, err
	}
	createdAt := time.Now().UTC()
	team, err := r.Repository.CreateTeam(ctx, pg.CreateTeamParams{organizationID, createdAt, input.Name})
	return &team, err
}

func (r *mutationResolver) CreateProject(ctx context.Context, input NewProject) (*pg.Project, error) {
	createdAt := time.Now().UTC()
	project, err := r.Repository.CreateProject(ctx, pg.CreateProjectParams{input.UserID, input.TeamID, createdAt, input.Name})
	return &project, err
}

func (r *mutationResolver) CreateProjectLabel(ctx context.Context, input NewProjectLabel) (*pg.ProjectLabel, error) {
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
	projectLabel, err := r.Repository.CreateProjectLabel(ctx, pg.CreateProjectLabelParams{input.ProjectID,
		input.LabelColorID, createdAt, name})
	return &projectLabel, err
}

func (r *mutationResolver) DeleteProjectLabel(ctx context.Context, input DeleteProjectLabel) (*pg.ProjectLabel, error) {
	label, err := r.Repository.GetProjectLabelByID(ctx, input.ProjectLabelID)
	if err != nil {
		return &pg.ProjectLabel{}, err
	}
	err = r.Repository.DeleteProjectLabelByID(ctx, input.ProjectLabelID)
	return &label, err
}

func (r *mutationResolver) UpdateProjectLabel(ctx context.Context, input UpdateProjectLabel) (*pg.ProjectLabel, error) {
	label, err := r.Repository.UpdateProjectLabel(ctx, pg.UpdateProjectLabelParams{ProjectLabelID: input.ProjectLabelID, LabelColorID: input.LabelColorID, Name: sql.NullString{String: input.Name, Valid: true}})
	return &label, err
}

func (r *mutationResolver) UpdateProjectLabelName(ctx context.Context, input UpdateProjectLabelName) (*pg.ProjectLabel, error) {
	label, err := r.Repository.UpdateProjectLabelName(ctx, pg.UpdateProjectLabelNameParams{ProjectLabelID: input.ProjectLabelID, Name: sql.NullString{String: input.Name, Valid: true}})
	return &label, err
}

func (r *mutationResolver) UpdateProjectLabelColor(ctx context.Context, input UpdateProjectLabelColor) (*pg.ProjectLabel, error) {
	label, err := r.Repository.UpdateProjectLabelColor(ctx, pg.UpdateProjectLabelColorParams{ProjectLabelID: input.ProjectLabelID, LabelColorID: input.LabelColorID})
	return &label, err
}

func (r *mutationResolver) CreateTaskGroup(ctx context.Context, input NewTaskGroup) (*pg.TaskGroup, error) {
	createdAt := time.Now().UTC()
	projectID, err := uuid.Parse(input.ProjectID)
	if err != nil {
		return &pg.TaskGroup{}, err
	}
	project, err := r.Repository.CreateTaskGroup(ctx,
		pg.CreateTaskGroupParams{projectID, createdAt, input.Name, input.Position})
	return &project, err
}

func (r *mutationResolver) UpdateTaskGroupLocation(ctx context.Context, input NewTaskGroupLocation) (*pg.TaskGroup, error) {
	taskGroup, err := r.Repository.UpdateTaskGroupLocation(ctx, pg.UpdateTaskGroupLocationParams{
		input.TaskGroupID,
		input.Position,
	})
	return &taskGroup, err
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

func (r *mutationResolver) AddTaskLabel(ctx context.Context, input *AddTaskLabelInput) (*pg.Task, error) {
	assignedDate := time.Now().UTC()
	_, err := r.Repository.CreateTaskLabelForTask(ctx, pg.CreateTaskLabelForTaskParams{input.TaskID, input.LabelColorID, assignedDate})
	if err != nil {
		return &pg.Task{}, err
	}
	task, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	return &task, nil
}

func (r *mutationResolver) RemoveTaskLabel(ctx context.Context, input *RemoveTaskLabelInput) (*pg.Task, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) CreateTask(ctx context.Context, input NewTask) (*pg.Task, error) {
	taskGroupID, err := uuid.Parse(input.TaskGroupID)
	createdAt := time.Now().UTC()
	if err != nil {
		return &pg.Task{}, err
	}

	task, err := r.Repository.CreateTask(ctx, pg.CreateTaskParams{taskGroupID, createdAt, input.Name, input.Position})
	return &task, err
}

func (r *mutationResolver) UpdateTaskDescription(ctx context.Context, input UpdateTaskDescriptionInput) (*pg.Task, error) {
	task, err := r.Repository.UpdateTaskDescription(ctx, pg.UpdateTaskDescriptionParams{input.TaskID, sql.NullString{String: input.Description, Valid: true}})
	return &task, err
}

func (r *mutationResolver) UpdateTaskLocation(ctx context.Context, input NewTaskLocation) (*pg.Task, error) {
	taskID, err := uuid.Parse(input.TaskID)
	if err != nil {
		return &pg.Task{}, err
	}
	taskGroupID, err := uuid.Parse(input.TaskGroupID)
	if err != nil {
		return &pg.Task{}, err
	}
	task, err := r.Repository.UpdateTaskLocation(ctx, pg.UpdateTaskLocationParams{taskID, taskGroupID, input.Position})

	return &task, err
}

func (r *mutationResolver) UpdateTaskName(ctx context.Context, input UpdateTaskName) (*pg.Task, error) {
	taskID, err := uuid.Parse(input.TaskID)
	if err != nil {
		return &pg.Task{}, err
	}
	task, err := r.Repository.UpdateTaskName(ctx, pg.UpdateTaskNameParams{taskID, input.Name})
	return &task, err
}

func (r *mutationResolver) DeleteTask(ctx context.Context, input DeleteTaskInput) (*DeleteTaskPayload, error) {
	taskID, err := uuid.Parse(input.TaskID)
	if err != nil {
		return &DeleteTaskPayload{}, err
	}

	log.WithFields(log.Fields{
		"taskID": taskID.String(),
	}).Info("deleting task")
	err = r.Repository.DeleteTaskByID(ctx, taskID)
	if err != nil {
		return &DeleteTaskPayload{}, err
	}
	return &DeleteTaskPayload{taskID.String()}, nil
}

func (r *mutationResolver) AssignTask(ctx context.Context, input *AssignTaskInput) (*pg.Task, error) {
	assignedDate := time.Now().UTC()
	assignedTask, err := r.Repository.CreateTaskAssigned(ctx, pg.CreateTaskAssignedParams{input.TaskID, input.UserID, assignedDate})
	log.WithFields(log.Fields{
		"userID":         assignedTask.UserID,
		"taskID":         assignedTask.TaskID,
		"assignedTaskID": assignedTask.TaskAssignedID,
	}).Info("assigned task")
	if err != nil {
		return &pg.Task{}, err
	}
	task, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	return &task, err
}

func (r *mutationResolver) UnassignTask(ctx context.Context, input *UnassignTaskInput) (*pg.Task, error) {
	task, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	if err != nil {
		return &pg.Task{}, err
	}
	_, err = r.Repository.DeleteTaskAssignedByID(ctx, pg.DeleteTaskAssignedByIDParams{input.TaskID, input.UserID})
	if err != nil {
		return &pg.Task{}, err
	}
	return &task, nil
}

func (r *mutationResolver) LogoutUser(ctx context.Context, input LogoutUser) (bool, error) {
	userID, err := uuid.Parse(input.UserID)
	if err != nil {
		return false, err
	}

	err = r.Repository.DeleteRefreshTokenByUserID(ctx, userID)
	return true, err
}

func (r *projectResolver) ID(ctx context.Context, obj *pg.Project) (uuid.UUID, error) {
	return obj.ProjectID, nil
}

func (r *projectResolver) Team(ctx context.Context, obj *pg.Project) (*pg.Team, error) {
	team, err := r.Repository.GetTeamByID(ctx, obj.TeamID)
	return &team, err
}

func (r *projectResolver) Owner(ctx context.Context, obj *pg.Project) (*ProjectMember, error) {
	user, err := r.Repository.GetUserAccountByID(ctx, obj.Owner)
	if err != nil {
		return &ProjectMember{}, err
	}
	initials := string([]rune(user.FirstName)[0]) + string([]rune(user.LastName)[0])
	profileIcon := &ProfileIcon{nil, &initials, &user.ProfileBgColor}
	return &ProjectMember{obj.Owner, user.FirstName, user.LastName, profileIcon}, nil
}

func (r *projectResolver) TaskGroups(ctx context.Context, obj *pg.Project) ([]pg.TaskGroup, error) {
	return r.Repository.GetTaskGroupsForProject(ctx, obj.ProjectID)
}

func (r *projectResolver) Members(ctx context.Context, obj *pg.Project) ([]ProjectMember, error) {
	user, err := r.Repository.GetUserAccountByID(ctx, obj.Owner)
	members := []ProjectMember{}
	if err != nil {
		return members, err
	}
	initials := string([]rune(user.FirstName)[0]) + string([]rune(user.LastName)[0])
	profileIcon := &ProfileIcon{nil, &initials, &user.ProfileBgColor}
	members = append(members, ProjectMember{obj.Owner, user.FirstName, user.LastName, profileIcon})
	return members, nil
}

func (r *projectResolver) Labels(ctx context.Context, obj *pg.Project) ([]pg.ProjectLabel, error) {
	labels, err := r.Repository.GetProjectLabelsForProject(ctx, obj.ProjectID)
	return labels, err
}

func (r *projectLabelResolver) ID(ctx context.Context, obj *pg.ProjectLabel) (uuid.UUID, error) {
	return obj.ProjectLabelID, nil
}

func (r *projectLabelResolver) LabelColor(ctx context.Context, obj *pg.ProjectLabel) (*pg.LabelColor, error) {
	labelColor, err := r.Repository.GetLabelColorByID(ctx, obj.LabelColorID)
	if err != nil {
		return &pg.LabelColor{}, err
	}
	return &labelColor, nil
}

func (r *projectLabelResolver) Name(ctx context.Context, obj *pg.ProjectLabel) (*string, error) {
	var name *string
	if obj.Name.Valid {
		name = &obj.Name.String
	}
	return name, nil
}

func (r *queryResolver) Users(ctx context.Context) ([]pg.UserAccount, error) {
	return r.Repository.GetAllUserAccounts(ctx)
}

func (r *queryResolver) FindUser(ctx context.Context, input FindUser) (*pg.UserAccount, error) {
	userId, err := uuid.Parse(input.UserID)
	if err != nil {
		return &pg.UserAccount{}, err
	}
	account, err := r.Repository.GetUserAccountByID(ctx, userId)
	if err == sql.ErrNoRows {
		return &pg.UserAccount{}, &gqlerror.Error{
			Message: "User not found",
			Extensions: map[string]interface{}{
				"code": "10-404",
			},
		}
	}
	return &account, err
}

func (r *queryResolver) FindProject(ctx context.Context, input FindProject) (*pg.Project, error) {
	projectID, err := uuid.Parse(input.ProjectID)
	if err != nil {
		return &pg.Project{}, err
	}
	project, err := r.Repository.GetProjectByID(ctx, projectID)
	if err == sql.ErrNoRows {
		return &pg.Project{}, &gqlerror.Error{
			Message: "Project not found",
			Extensions: map[string]interface{}{
				"code": "11-404",
			},
		}
	}
	return &project, err
}

func (r *queryResolver) FindTask(ctx context.Context, input FindTask) (*pg.Task, error) {
	task, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	return &task, err
}

func (r *queryResolver) Projects(ctx context.Context, input *ProjectsFilter) ([]pg.Project, error) {
	if input != nil {
		teamID, err := uuid.Parse(*input.TeamID)
		if err != nil {
			return []pg.Project{}, err
		}
		return r.Repository.GetAllProjectsForTeam(ctx, teamID)
	}
	return r.Repository.GetAllProjects(ctx)
}

func (r *queryResolver) LabelColors(ctx context.Context) ([]pg.LabelColor, error) {
	return r.Repository.GetLabelColors(ctx)
}

func (r *queryResolver) TaskGroups(ctx context.Context) ([]pg.TaskGroup, error) {
	return r.Repository.GetAllTaskGroups(ctx)
}

func (r *queryResolver) Me(ctx context.Context) (*pg.UserAccount, error) {
	userID, ok := GetUserID(ctx)
	if !ok {
		return &pg.UserAccount{}, fmt.Errorf("internal server error")
	}
	log.WithFields(log.Fields{
		"userID": userID,
	}).Info("getting user account")
	user, err := r.Repository.GetUserAccountByID(ctx, userID)
	if err != nil {
		return &pg.UserAccount{}, err
	}
	return &user, err
}

func (r *refreshTokenResolver) ID(ctx context.Context, obj *pg.RefreshToken) (uuid.UUID, error) {
	return obj.TokenID, nil
}

func (r *taskResolver) ID(ctx context.Context, obj *pg.Task) (uuid.UUID, error) {
	return obj.TaskID, nil
}

func (r *taskResolver) TaskGroup(ctx context.Context, obj *pg.Task) (*pg.TaskGroup, error) {
	taskGroup, err := r.Repository.GetTaskGroupByID(ctx, obj.TaskGroupID)
	return &taskGroup, err
}

func (r *taskResolver) Description(ctx context.Context, obj *pg.Task) (*string, error) {
	task, err := r.Repository.GetTaskByID(ctx, obj.TaskID)
	if err != nil {
		return nil, err
	}
	if !task.Description.Valid {
		return nil, nil
	}
	return &task.Description.String, nil
}

func (r *taskResolver) Assigned(ctx context.Context, obj *pg.Task) ([]ProjectMember, error) {
	taskMemberLinks, err := r.Repository.GetAssignedMembersForTask(ctx, obj.TaskID)
	taskMembers := []ProjectMember{}
	if err != nil {
		return taskMembers, err
	}
	for _, taskMemberLink := range taskMemberLinks {
		user, err := r.Repository.GetUserAccountByID(ctx, taskMemberLink.UserID)
		if err != nil {
			return taskMembers, err
		}
		initials := string([]rune(user.FirstName)[0]) + string([]rune(user.LastName)[0])
		profileIcon := &ProfileIcon{nil, &initials, &user.ProfileBgColor}
		taskMembers = append(taskMembers, ProjectMember{taskMemberLink.UserID, user.FirstName, user.LastName, profileIcon})
	}
	return taskMembers, nil
}

func (r *taskResolver) Labels(ctx context.Context, obj *pg.Task) ([]pg.TaskLabel, error) {
	return r.Repository.GetTaskLabelsForTaskID(ctx, obj.TaskID)
}

func (r *taskGroupResolver) ID(ctx context.Context, obj *pg.TaskGroup) (uuid.UUID, error) {
	return obj.TaskGroupID, nil
}

func (r *taskGroupResolver) ProjectID(ctx context.Context, obj *pg.TaskGroup) (string, error) {
	return obj.ProjectID.String(), nil
}

func (r *taskGroupResolver) Tasks(ctx context.Context, obj *pg.TaskGroup) ([]pg.Task, error) {
	tasks, err := r.Repository.GetTasksForTaskGroupID(ctx, obj.TaskGroupID)
	return tasks, err
}

func (r *taskLabelResolver) ID(ctx context.Context, obj *pg.TaskLabel) (uuid.UUID, error) {
	return obj.TaskLabelID, nil
}

func (r *taskLabelResolver) ColorHex(ctx context.Context, obj *pg.TaskLabel) (string, error) {
	projectLabel, err := r.Repository.GetProjectLabelByID(ctx, obj.ProjectLabelID)
	if err != nil {
		return "", err
	}
	labelColor, err := r.Repository.GetLabelColorByID(ctx, projectLabel.LabelColorID)
	if err != nil {
		return "", err
	}
	return labelColor.ColorHex, nil
}

func (r *taskLabelResolver) Name(ctx context.Context, obj *pg.TaskLabel) (*string, error) {
	projectLabel, err := r.Repository.GetProjectLabelByID(ctx, obj.ProjectLabelID)
	if err != nil {
		return nil, err
	}
	name := projectLabel.Name
	if !name.Valid {
		return nil, err
	}
	return &name.String, err
}

func (r *teamResolver) ID(ctx context.Context, obj *pg.Team) (uuid.UUID, error) {
	return obj.TeamID, nil
}

func (r *userAccountResolver) ID(ctx context.Context, obj *pg.UserAccount) (uuid.UUID, error) {
	return obj.UserID, nil
}

func (r *userAccountResolver) ProfileIcon(ctx context.Context, obj *pg.UserAccount) (*ProfileIcon, error) {
	initials := string([]rune(obj.FirstName)[0]) + string([]rune(obj.LastName)[0])
	profileIcon := &ProfileIcon{nil, &initials, &obj.ProfileBgColor}
	return profileIcon, nil
}

// LabelColor returns LabelColorResolver implementation.
func (r *Resolver) LabelColor() LabelColorResolver { return &labelColorResolver{r} }

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

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
type projectResolver struct{ *Resolver }
type projectLabelResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type refreshTokenResolver struct{ *Resolver }
type taskResolver struct{ *Resolver }
type taskGroupResolver struct{ *Resolver }
type taskLabelResolver struct{ *Resolver }
type teamResolver struct{ *Resolver }
type userAccountResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *projectLabelResolver) ColorHex(ctx context.Context, obj *pg.ProjectLabel) (string, error) {
	labelColor, err := r.Repository.GetLabelColorByID(ctx, obj.LabelColorID)
	if err != nil {
		return "", err
	}
	return labelColor.ColorHex, nil
}
