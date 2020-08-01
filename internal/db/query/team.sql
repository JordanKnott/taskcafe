-- name: GetAllTeams :many
SELECT * FROM team;

-- name: GetTeamByID :one
SELECT * FROM team WHERE team_id = $1;

-- name: CreateTeam :one
INSERT INTO team (organization_id, created_at, name) VALUES ($1, $2, $3) RETURNING *;

-- name: DeleteTeamByID :exec
DELETE FROM team WHERE team_id = $1;

-- name: GetTeamsForOrganization :many
SELECT * FROM team WHERE organization_id = $1;

-- name: GetMemberTeamIDsForUserID :many
SELECT team_id FROM team_member WHERE user_id = $1;

-- name: GetTeamRoleForUserID :one
SELECT team_id, role_code FROM team_member WHERE user_id = $1 AND team_id = $2;

-- name: GetTeamRolesForUserID :many
SELECT team_id, role_code FROM team_member WHERE user_id = $1;

-- name: GetTeamsForUserIDWhereAdmin :many
SELECT team.* FROM team_member INNER JOIN team
  ON team.team_id = team_member.team_id  WHERE (role_code = 'admin' OR role_code = 'member') AND user_id = $1;
