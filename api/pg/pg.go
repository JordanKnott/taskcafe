package pg

import (
	"context"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	CreateTeam(ctx context.Context, arg CreateTeamParams) (Team, error)
	DeleteTeamByID(ctx context.Context, teamID uuid.UUID) error
	GetTeamByID(ctx context.Context, teamID uuid.UUID) (Team, error)
	GetAllTeams(ctx context.Context) ([]Team, error)
	CreateProject(ctx context.Context, arg CreateProjectParams) (Project, error)
	GetAllProjects(ctx context.Context) ([]Project, error)
	GetAllProjectsForTeam(ctx context.Context, teamID uuid.UUID) ([]Project, error)
	GetProjectByID(ctx context.Context, projectID uuid.UUID) (Project, error)
	GetAllUserAccounts(ctx context.Context) ([]UserAccount, error)
	UpdateTaskGroupLocation(ctx context.Context, arg UpdateTaskGroupLocationParams) (TaskGroup, error)
	GetUserAccountByID(ctx context.Context, userID uuid.UUID) (UserAccount, error)
	CreateUserAccount(ctx context.Context, arg CreateUserAccountParams) (UserAccount, error)
	GetUserAccountByUsername(ctx context.Context, username string) (UserAccount, error)
	CreateRefreshToken(ctx context.Context, arg CreateRefreshTokenParams) (RefreshToken, error)
	GetRefreshTokenByID(ctx context.Context, tokenID uuid.UUID) (RefreshToken, error)
	DeleteRefreshTokenByID(ctx context.Context, tokenID uuid.UUID) error
	DeleteRefreshTokenByUserID(ctx context.Context, userID uuid.UUID) error
	CreateTaskGroup(ctx context.Context, arg CreateTaskGroupParams) (TaskGroup, error)
	GetAllTaskGroups(ctx context.Context) ([]TaskGroup, error)
	GetAllOrganizations(ctx context.Context) ([]Organization, error)
	GetTaskGroupsForProject(ctx context.Context, projectID uuid.UUID) ([]TaskGroup, error)
	GetTaskGroupByID(ctx context.Context, taskGroupID uuid.UUID) (TaskGroup, error)
	CreateOrganization(ctx context.Context, arg CreateOrganizationParams) (Organization, error)
	GetTeamsForOrganization(ctx context.Context, organizationID uuid.UUID) ([]Team, error)
	CreateTask(ctx context.Context, arg CreateTaskParams) (Task, error)
	GetAllTasks(ctx context.Context) ([]Task, error)
	GetTasksForTaskGroupID(ctx context.Context, taskGroupID uuid.UUID) ([]Task, error)
	UpdateTaskLocation(ctx context.Context, arg UpdateTaskLocationParams) (Task, error)
	DeleteTaskByID(ctx context.Context, taskID uuid.UUID) error
	UpdateTaskName(ctx context.Context, arg UpdateTaskNameParams) (Task, error)
}

type repoSvc struct {
	*Queries
	db *sqlx.DB
}

// NewRepository returns an implementation of the Repository interface.
func NewRepository(db *sqlx.DB) Repository {
	return &repoSvc{
		Queries: New(db.DB),
		db:      db,
	}
}
