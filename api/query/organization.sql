-- name: GetAllOrganizations :many
SELECT * FROM organization;

-- name: CreateOrganization :one
INSERT INTO organization (created_at, name) VALUES ($1, $2) RETURNING *;
