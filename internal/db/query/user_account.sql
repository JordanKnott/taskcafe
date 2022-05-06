-- name: GetUserAccounts :many
SELECT * FROM user_account;

-- name: GetUserAccountByUsername :one
SELECT * FROM user_account WHERE username = $1;

-- name: GetUserAccountByID :one
SELECT * FROM user_account WHERE user_id = $1;

-- name: HasAnyUserAccount :one
SELECT EXISTS (SELECT * FROM user_account LIMIT 1);

-- name: CreateUserAccount :one
INSERT INTO user_account (created_at, fullname, username, email, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *;

-- name: CreateAccessToken :one
INSERT INTO access_token (token, user_id, expires_at, created_at) VALUES ($1, $2, $3, $4) RETURNING *;

-- name: GetAccessToken :one
SELECT * FROM access_token WHERE token = $1;

-- name: DeleteAccessToken :exec
DELETE FROM access_token WHERE token = $1;
