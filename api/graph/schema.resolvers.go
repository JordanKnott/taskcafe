package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
	"github.com/jordanknott/project-citadel/api/pg"
	log "github.com/sirupsen/logrus"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *mutationResolver) CreateRefreshToken(ctx context.Context, input NewRefreshToken) (*pg.RefreshToken, error) {
	userID := uuid.MustParse("0183d9ab-d0ed-4c9b-a3df-77a0cdd93dca")
	refreshCreatedAt := time.Now().UTC()
	refreshExpiresAt := refreshCreatedAt.AddDate(0, 0, 1)
	refreshToken, err := r.Repository.CreateRefreshToken(ctx, pg.CreateRefreshTokenParams{userID, refreshCreatedAt, refreshExpiresAt})
	return &refreshToken, err
}

func (r *mutationResolver) CreateUserAccount(ctx context.Context, input NewUserAccount) (*pg.UserAccount, error) {
	createdAt := time.Now().UTC()
	userAccount, err := r.Repository.CreateUserAccount(ctx, pg.CreateUserAccountParams{input.Username, input.Email, input.DisplayName, createdAt, input.Password})
	return &userAccount, err
}

func (r *mutationResolver) CreateOrganization(ctx context.Context, input NewOrganization) (*pg.Organization, error) {
	createdAt := time.Now().UTC()
	organization, err := r.Repository.CreateOrganization(ctx, pg.CreateOrganizationParams{createdAt, input.Name})
	return &organization, err
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
	teamID, err := uuid.Parse(input.TeamID)
	if err != nil {
		return &pg.Project{}, err
	}
	project, err := r.Repository.CreateProject(ctx, pg.CreateProjectParams{teamID, createdAt, input.Name})
	return &project, err
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

func (r *mutationResolver) CreateTask(ctx context.Context, input NewTask) (*pg.Task, error) {
	taskGroupID, err := uuid.Parse(input.TaskGroupID)
	createdAt := time.Now().UTC()
	if err != nil {
		return &pg.Task{}, err
	}

	task, err := r.Repository.CreateTask(ctx, pg.CreateTaskParams{taskGroupID, createdAt, input.Name, input.Position})
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

func (r *mutationResolver) LogoutUser(ctx context.Context, input LogoutUser) (bool, error) {
	userID, err := uuid.Parse(input.UserID)
	if err != nil {
		return false, err
	}

	err = r.Repository.DeleteRefreshTokenByUserID(ctx, userID)
	return true, err
}

func (r *organizationResolver) Teams(ctx context.Context, obj *pg.Organization) ([]pg.Team, error) {
	teams, err := r.Repository.GetTeamsForOrganization(ctx, obj.OrganizationID)
	return teams, err
}

func (r *projectResolver) TeamID(ctx context.Context, obj *pg.Project) (string, error) {
	return obj.TeamID.String(), nil
}

func (r *projectResolver) TaskGroups(ctx context.Context, obj *pg.Project) ([]pg.TaskGroup, error) {
	return r.Repository.GetTaskGroupsForProject(ctx, obj.ProjectID)
}

func (r *queryResolver) Organizations(ctx context.Context) ([]pg.Organization, error) {
	return r.Repository.GetAllOrganizations(ctx)
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

func (r *queryResolver) Teams(ctx context.Context) ([]pg.Team, error) {
	return r.Repository.GetAllTeams(ctx)
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

func (r *queryResolver) TaskGroups(ctx context.Context) ([]pg.TaskGroup, error) {
	return r.Repository.GetAllTaskGroups(ctx)
}

func (r *taskResolver) TaskGroup(ctx context.Context, obj *pg.Task) (*pg.TaskGroup, error) {
	taskGroup, err := r.Repository.GetTaskGroupByID(ctx, obj.TaskGroupID)
	return &taskGroup, err
}

func (r *taskGroupResolver) ProjectID(ctx context.Context, obj *pg.TaskGroup) (string, error) {
	return obj.ProjectID.String(), nil
}

func (r *taskGroupResolver) Tasks(ctx context.Context, obj *pg.TaskGroup) ([]pg.Task, error) {
	tasks, err := r.Repository.GetTasksForTaskGroupID(ctx, obj.TaskGroupID)
	return tasks, err
}

func (r *teamResolver) Projects(ctx context.Context, obj *pg.Team) ([]pg.Project, error) {
	return r.Repository.GetAllProjectsForTeam(ctx, obj.TeamID)
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Organization returns OrganizationResolver implementation.
func (r *Resolver) Organization() OrganizationResolver { return &organizationResolver{r} }

// Project returns ProjectResolver implementation.
func (r *Resolver) Project() ProjectResolver { return &projectResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

// Task returns TaskResolver implementation.
func (r *Resolver) Task() TaskResolver { return &taskResolver{r} }

// TaskGroup returns TaskGroupResolver implementation.
func (r *Resolver) TaskGroup() TaskGroupResolver { return &taskGroupResolver{r} }

// Team returns TeamResolver implementation.
func (r *Resolver) Team() TeamResolver { return &teamResolver{r} }

type mutationResolver struct{ *Resolver }
type organizationResolver struct{ *Resolver }
type projectResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type taskResolver struct{ *Resolver }
type taskGroupResolver struct{ *Resolver }
type teamResolver struct{ *Resolver }
