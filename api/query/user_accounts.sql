-- name: GetUserAccountByID :one
SELECT * FROM user_account WHERE user_id = $1;

-- name: GetAllUserAccounts :many
SELECT * FROM user_account;

-- name: GetUserAccountByUsername :one
SELECT * FROM user_account WHERE username = $1;

-- name: CreateUserAccount :one
INSERT INTO user_account(full_name, initials, email, username, created_at, password_hash)
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;

-- name: UpdateUserAccountProfileAvatarURL :one
UPDATE user_account SET profile_avatar_url = $2 WHERE user_id = $1
  RETURNING *;
