package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jinzhu/now"
	"github.com/jordanknott/taskcafe/internal/db"
	"github.com/jordanknott/taskcafe/internal/logger"
	log "github.com/sirupsen/logrus"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *organizationResolver) ID(ctx context.Context, obj *db.Organization) (uuid.UUID, error) {
	return obj.OrganizationID, nil
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

func (r *queryResolver) Projects(ctx context.Context, input *ProjectsFilter) ([]db.Project, error) {
	userID, ok := GetUser(ctx)
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
	teams, err = r.Repository.GetTeamsForUserIDWhereAdmin(ctx, userID)

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

func (r *queryResolver) Teams(ctx context.Context) ([]db.Team, error) {
	userID, ok := GetUser(ctx)
	if !ok {
		logger.New(ctx).Error("userID or org role does not exist")
		return []db.Team{}, errors.New("internal error")
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

func (r *queryResolver) FindTeam(ctx context.Context, input FindTeam) (*db.Team, error) {
	team, err := r.Repository.GetTeamByID(ctx, input.TeamID)
	if err != nil {
		return &db.Team{}, err
	}
	return &team, nil
}

func (r *queryResolver) MyTasks(ctx context.Context, input MyTasks) (*MyTasksPayload, error) {
	userID, _ := GetUserID(ctx)
	projects := []ProjectTaskMapping{}
	var tasks []db.Task
	var err error
	showAll := false
	if input.Status == MyTasksStatusAll {
		showAll = true
	}
	complete := false
	completedAt := sql.NullTime{Valid: false, Time: time.Time{}}
	switch input.Status {
	case MyTasksStatusCompleteAll:
		complete = true
		completedAt = sql.NullTime{Valid: true, Time: time.Time{}}
	case MyTasksStatusCompleteToday:
		complete = true
		completedAt = sql.NullTime{Valid: true, Time: now.BeginningOfDay()}
	case MyTasksStatusCompleteYesterday:
		complete = true
		completedAt = sql.NullTime{Valid: true, Time: now.With(time.Now().AddDate(0, 0, -1)).BeginningOfDay()}
	case MyTasksStatusCompleteOneWeek:
		complete = true
		completedAt = sql.NullTime{Valid: true, Time: now.With(time.Now().AddDate(0, 0, -7)).BeginningOfDay()}
	case MyTasksStatusCompleteTwoWeek:
		complete = true
		completedAt = sql.NullTime{Valid: true, Time: now.With(time.Now().AddDate(0, 0, -14)).BeginningOfDay()}
	case MyTasksStatusCompleteThreeWeek:
		complete = true
		completedAt = sql.NullTime{Valid: true, Time: now.With(time.Now().AddDate(0, 0, -21)).BeginningOfDay()}
	}

	if input.Sort == MyTasksSortNone {
		tasks, err = r.Repository.GetRecentlyAssignedTaskForUserID(ctx, db.GetRecentlyAssignedTaskForUserIDParams{
			UserID:      userID,
			Complete:    complete,
			CompletedAt: completedAt,
			Column4:     showAll,
		})
		if err != nil && err != sql.ErrNoRows {
			return &MyTasksPayload{}, err
		}
	} else if input.Sort == MyTasksSortProject {
		tasks, err = r.Repository.GetAssignedTasksProjectForUserID(ctx, db.GetAssignedTasksProjectForUserIDParams{
			UserID:      userID,
			Complete:    complete,
			CompletedAt: completedAt,
			Column4:     showAll,
		})
		if err != nil && err != sql.ErrNoRows {
			return &MyTasksPayload{}, err
		}
	} else if input.Sort == MyTasksSortDueDate {
		tasks, err = r.Repository.GetAssignedTasksDueDateForUserID(ctx, db.GetAssignedTasksDueDateForUserIDParams{
			UserID:      userID,
			Complete:    complete,
			CompletedAt: completedAt,
			Column4:     showAll,
		})
		if err != nil && err != sql.ErrNoRows {
			return &MyTasksPayload{}, err
		}
	}
	taskIds := []uuid.UUID{}
	for _, task := range tasks {
		taskIds = append(taskIds, task.TaskID)
	}
	mappings, err := r.Repository.GetProjectIdMappings(ctx, taskIds)
	for _, mapping := range mappings {
		projects = append(projects, ProjectTaskMapping{ProjectID: mapping.ProjectID, TaskID: mapping.TaskID})
	}
	return &MyTasksPayload{Tasks: tasks, Projects: projects}, err
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
		return nil, nil
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

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Organization returns OrganizationResolver implementation.
func (r *Resolver) Organization() OrganizationResolver { return &organizationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

// Subscription returns SubscriptionResolver implementation.
func (r *Resolver) Subscription() SubscriptionResolver { return &subscriptionResolver{r} }

type mutationResolver struct{ *Resolver }
type organizationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
