-- name: GetAllProjects :many
SELECT * FROM project;

-- name: GetAllProjectsForTeam :many
SELECT * FROM project WHERE team_id = $1;

-- name: GetProjectByID :one
SELECT * FROM project WHERE project_id = $1;

-- name: CreateProject :one
INSERT INTO project(owner, team_id, created_at, name) VALUES ($1, $2, $3, $4) RETURNING *;
