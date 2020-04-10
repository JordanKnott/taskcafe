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
