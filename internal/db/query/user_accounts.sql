-- name: GetUserAccountByID :one
SELECT * FROM user_account WHERE user_id = $1;

-- name: GetAllUserAccounts :many
SELECT * FROM user_account WHERE username != 'system';

-- name: GetUserAccountByUsername :one
SELECT * FROM user_account WHERE username = $1;

-- name: CreateUserAccount :one
INSERT INTO user_account(full_name, initials, email, username, created_at, password_hash, role_code)
  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;

-- name: UpdateUserAccountProfileAvatarURL :one
UPDATE user_account SET profile_avatar_url = $2 WHERE user_id = $1
  RETURNING *;

-- name: GetMemberData :many
SELECT * FROM user_account
  WHERE username != 'system'
  AND user_id NOT IN (SELECT user_id FROM project_member WHERE project_id = $1);

-- name: UpdateUserAccountInfo :one
UPDATE user_account SET bio = $2, full_name = $3, initials = $4, email = $5
  WHERE user_id = $1 RETURNING *;

-- name: DeleteUserAccountByID :exec
DELETE FROM user_account WHERE user_id = $1;

-- name: GetRoleForUserID :one
SELECT username, role.code, role.name FROM user_account
  INNER JOIN role ON role.code = user_account.role_code
WHERE user_id = $1;

-- name: UpdateUserRole :one
UPDATE user_account SET role_code = $2 WHERE user_id = $1 RETURNING *;

-- name: SetUserPassword :one
UPDATE user_account SET password_hash = $2 WHERE user_id = $1 RETURNING *;

-- name: CreateInvitedUser :one
INSERT INTO user_account_invited (email) VALUES ($1) RETURNING *;

-- name: GetInvitedUserByEmail :one
SELECT * FROM user_account_invited WHERE email = $1;

-- name: CreateInvitedProjectMember :one
INSERT INTO project_member_invited (project_id, user_account_invited_id) VALUES ($1, $2)
  RETURNING *;

-- name: GetInvitedUserAccounts :many
SELECT * FROM user_account_invited;

-- name: DeleteInvitedUserAccount :one
DELETE FROM user_account_invited WHERE user_account_invited_id = $1 RETURNING *;
