-- name: GetAuthTokenByID :one
SELECT * FROM auth_token WHERE token_id = $1;

-- name: CreateAuthToken :one
INSERT INTO auth_token (user_id, created_at, expires_at) VALUES ($1, $2, $3) RETURNING *;

-- name: DeleteAuthTokenByID :exec
DELETE FROM auth_token WHERE token_id = $1;

-- name: DeleteAuthTokenByUserID :exec
DELETE FROM auth_token WHERE user_id = $1;

-- name: DeleteExpiredTokens :exec
DELETE FROM auth_token WHERE expires_at <= NOW();
