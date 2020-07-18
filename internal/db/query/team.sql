-- name: GetAllTeams :many
SELECT * FROM team;

-- name: GetTeamByID :one
SELECT * FROM team WHERE team_id = $1;

-- name: CreateTeam :one
INSERT INTO team (organization_id, created_at, name, owner) VALUES ($1, $2, $3, $4) RETURNING *;

-- name: DeleteTeamByID :exec
DELETE FROM team WHERE team_id = $1;

-- name: GetTeamsForOrganization :many
SELECT * FROM team WHERE organization_id = $1;

-- name: SetTeamOwner :one
UPDATE team SET owner = $2 WHERE team_id = $1 RETURNING *;

-- name: GetOwnedTeamsForUserID :many
SELECT * FROM team WHERE owner = $1;

-- name: GetMemberTeamIDsForUserID :many
SELECT team_id FROM team_member WHERE user_id = $1;
