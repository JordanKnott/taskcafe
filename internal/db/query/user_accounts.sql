-- name: GetUserAccountByID :one
SELECT * FROM user_account WHERE user_id = $1;

-- name: GetAllUserAccounts :many
SELECT * FROM user_account WHERE username != 'system';

-- name: GetUserAccountByUsername :one
SELECT * FROM user_account WHERE username = $1;

-- name: GetUserAccountByEmail :one
SELECT * FROM user_account WHERE email = $1;

-- name: CreateUserAccount :one
INSERT INTO user_account(full_name, initials, email, username, created_at, password_hash, role_code, active)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;

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

-- name: HasAnyUser :one
SELECT EXISTS(SELECT 1 FROM user_account WHERE username != 'system');

-- name: HasActiveUser :one
SELECT EXISTS(SELECT 1 FROM user_account WHERE username != 'system' AND active = true);

-- name: DoesUserExist :one
SELECT EXISTS(SELECT 1 FROM user_account WHERE email = $1 OR username = $2);

-- name: CreateConfirmToken :one
INSERT INTO user_account_confirm_token (email) VALUES ($1) RETURNING *;

-- name: GetConfirmTokenByEmail :one
SELECT * FROM user_account_confirm_token WHERE email = $1;

-- name: GetConfirmTokenByID :one
SELECT * FROM user_account_confirm_token WHERE confirm_token_id = $1;

-- name: SetFirstUserActive :one
UPDATE user_account SET active = true WHERE user_id = (
  SELECT user_id from user_account WHERE active = false LIMIT 1
) RETURNING *;

-- name: SetUserActiveByEmail :one
UPDATE user_account SET active = true WHERE email = $1 RETURNING *;

-- name: GetProjectsForInvitedMember :many
SELECT project_id FROM user_account_invited AS uai
  INNER JOIN project_member_invited AS pmi
  ON pmi.user_account_invited_id = uai.user_account_invited_id
  WHERE uai.email = $1;

-- name: DeleteProjectMemberInvitedForEmail :exec
DELETE FROM project_member_invited WHERE project_member_invited_id IN (
  SELECT pmi.project_member_invited_id FROM user_account_invited AS uai
  INNER JOIN project_member_invited AS pmi
  ON pmi.user_account_invited_id = uai.user_account_invited_id
  WHERE uai.email = $1
);

-- name: DeleteUserAccountInvitedForEmail :exec
DELETE FROM user_account_invited WHERE email = $1;

-- name: DeleteConfirmTokenForEmail :exec
DELETE FROM user_account_confirm_token WHERE email = $1;


