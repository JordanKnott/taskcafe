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

	UpdateTaskChecklistItemName(ctx context.Context, arg UpdateTaskChecklistItemNameParams) (TaskChecklistItem, error)
	GetTaskChecklistItemByID(ctx context.Context, taskChecklistItemID uuid.UUID) (TaskChecklistItem, error)
	CreateTaskChecklist(ctx context.Context, arg CreateTaskChecklistParams) (TaskChecklist, error)
	CreateTaskChecklistItem(ctx context.Context, arg CreateTaskChecklistItemParams) (TaskChecklistItem, error)
	GetTaskChecklistItemsForTaskChecklist(ctx context.Context, taskChecklistID uuid.UUID) ([]TaskChecklistItem, error)
	GetTaskChecklistsForTask(ctx context.Context, taskID uuid.UUID) ([]TaskChecklist, error)
	SetTaskChecklistItemComplete(ctx context.Context, arg SetTaskChecklistItemCompleteParams) (TaskChecklistItem, error)
	DeleteTaskChecklistItem(ctx context.Context, taskChecklistItemID uuid.UUID) error

	UpdateUserAccountProfileAvatarURL(ctx context.Context, arg UpdateUserAccountProfileAvatarURLParams) (UserAccount, error)

	CreateUserAccount(ctx context.Context, arg CreateUserAccountParams) (UserAccount, error)
	GetUserAccountByID(ctx context.Context, userID uuid.UUID) (UserAccount, error)
	GetUserAccountByUsername(ctx context.Context, username string) (UserAccount, error)
	GetAllUserAccounts(ctx context.Context) ([]UserAccount, error)

	GetTaskLabelByID(ctx context.Context, taskLabelID uuid.UUID) (TaskLabel, error)

	SetTaskComplete(ctx context.Context, arg SetTaskCompleteParams) (Task, error)
	DeleteTaskLabelForTaskByProjectLabelID(ctx context.Context, arg DeleteTaskLabelForTaskByProjectLabelIDParams) error
	GetTaskLabelForTaskByProjectLabelID(ctx context.Context, arg GetTaskLabelForTaskByProjectLabelIDParams) (TaskLabel, error)
	UpdateProjectNameByID(ctx context.Context, arg UpdateProjectNameByIDParams) (Project, error)

	DeleteTaskLabelByID(ctx context.Context, taskLabelID uuid.UUID) error
	UpdateTaskDueDate(ctx context.Context, arg UpdateTaskDueDateParams) (Task, error)
	CreateProjectLabel(ctx context.Context, arg CreateProjectLabelParams) (ProjectLabel, error)
	GetProjectLabelsForProject(ctx context.Context, projectID uuid.UUID) ([]ProjectLabel, error)
	GetProjectLabelByID(ctx context.Context, projectLabelID uuid.UUID) (ProjectLabel, error)
	DeleteProjectLabelByID(ctx context.Context, projectLabelID uuid.UUID) error
	UpdateProjectLabelColor(ctx context.Context, arg UpdateProjectLabelColorParams) (ProjectLabel, error)
	UpdateProjectLabelName(ctx context.Context, arg UpdateProjectLabelNameParams) (ProjectLabel, error)
	UpdateProjectLabel(ctx context.Context, arg UpdateProjectLabelParams) (ProjectLabel, error)

	GetLabelColors(ctx context.Context) ([]LabelColor, error)
	CreateLabelColor(ctx context.Context, arg CreateLabelColorParams) (LabelColor, error)

	CreateRefreshToken(ctx context.Context, arg CreateRefreshTokenParams) (RefreshToken, error)
	GetRefreshTokenByID(ctx context.Context, tokenID uuid.UUID) (RefreshToken, error)
	DeleteRefreshTokenByID(ctx context.Context, tokenID uuid.UUID) error
	DeleteRefreshTokenByUserID(ctx context.Context, userID uuid.UUID) error

	SetTaskGroupName(ctx context.Context, arg SetTaskGroupNameParams) (TaskGroup, error)
	DeleteTaskGroupByID(ctx context.Context, taskGroupID uuid.UUID) (int64, error)
	DeleteTasksByTaskGroupID(ctx context.Context, taskGroupID uuid.UUID) (int64, error)
	UpdateTaskGroupLocation(ctx context.Context, arg UpdateTaskGroupLocationParams) (TaskGroup, error)
	CreateTaskGroup(ctx context.Context, arg CreateTaskGroupParams) (TaskGroup, error)
	GetAllTaskGroups(ctx context.Context) ([]TaskGroup, error)
	GetTaskGroupsForProject(ctx context.Context, projectID uuid.UUID) ([]TaskGroup, error)
	GetTaskGroupByID(ctx context.Context, taskGroupID uuid.UUID) (TaskGroup, error)

	GetAllOrganizations(ctx context.Context) ([]Organization, error)
	CreateOrganization(ctx context.Context, arg CreateOrganizationParams) (Organization, error)

	GetTeamsForOrganization(ctx context.Context, organizationID uuid.UUID) ([]Team, error)

	CreateTask(ctx context.Context, arg CreateTaskParams) (Task, error)
	GetTaskByID(ctx context.Context, taskID uuid.UUID) (Task, error)
	GetAllTasks(ctx context.Context) ([]Task, error)
	GetTasksForTaskGroupID(ctx context.Context, taskGroupID uuid.UUID) ([]Task, error)
	UpdateTaskLocation(ctx context.Context, arg UpdateTaskLocationParams) (Task, error)
	DeleteTaskByID(ctx context.Context, taskID uuid.UUID) error
	UpdateTaskName(ctx context.Context, arg UpdateTaskNameParams) (Task, error)
	UpdateTaskDescription(ctx context.Context, arg UpdateTaskDescriptionParams) (Task, error)

	CreateTaskLabelForTask(ctx context.Context, arg CreateTaskLabelForTaskParams) (TaskLabel, error)
	GetTaskLabelsForTaskID(ctx context.Context, taskID uuid.UUID) ([]TaskLabel, error)
	GetLabelColorByID(ctx context.Context, labelColorID uuid.UUID) (LabelColor, error)

	CreateTaskAssigned(ctx context.Context, arg CreateTaskAssignedParams) (TaskAssigned, error)
	GetAssignedMembersForTask(ctx context.Context, taskID uuid.UUID) ([]TaskAssigned, error)
	DeleteTaskAssignedByID(ctx context.Context, arg DeleteTaskAssignedByIDParams) (TaskAssigned, error)
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
