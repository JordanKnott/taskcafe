-- name: GetUserAccountByID :one
SELECT * FROM user_account WHERE user_id = $1;

-- name: GetAllUserAccounts :many
SELECT * FROM user_account;

-- name: GetUserAccountByUsername :one
SELECT * FROM user_account WHERE username = $1;

-- name: CreateUserAccount :one
INSERT INTO user_account(display_name, email, username, created_at, password_hash)
  VALUES ($1, $2, $3, $4, $5)
RETURNING *;
