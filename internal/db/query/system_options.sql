-- name: GetSystemOptionByKey :one
SELECT key, value FROM system_options WHERE key = $1;

-- name: CreateSystemOption :one
INSERT INTO system_options (key, value) VALUES ($1, $2) RETURNING *;
