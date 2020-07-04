-- name: GetRefreshTokenByID :one
SELECT * FROM refresh_token WHERE token_id = $1;

-- name: CreateRefreshToken :one
INSERT INTO refresh_token (user_id, created_at, expires_at) VALUES ($1, $2, $3) RETURNING *;

-- name: DeleteRefreshTokenByID :exec
DELETE FROM refresh_token WHERE token_id = $1;

-- name: DeleteRefreshTokenByUserID :exec
DELETE FROM refresh_token WHERE user_id = $1;

-- name: DeleteExpiredTokens :exec
DELETE FROM refresh_token WHERE expires_at <= NOW();
