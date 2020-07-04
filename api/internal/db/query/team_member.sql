-- name: CreateTeamMember :one
INSERT INTO team_member (team_id, user_id, addedDate, role_code) VALUES ($1, $2, $3, $4)
  RETURNING *;

-- name: GetTeamMembersForTeamID :many
SELECT * FROM team_member WHERE team_id = $1;

-- name: DeleteTeamMember :exec
DELETE FROM team_member WHERE user_id = $1 AND team_id = $2;

-- name: GetRoleForTeamMember :one
SELECT code, role.name FROM team_member
  INNER JOIN role ON role.code = team_member.role_code
  WHERE user_id = $1 AND team_id = $2;

-- name: UpdateTeamMemberRole :one
UPDATE team_member SET role_code = $3 WHERE user_id = $2 AND team_id = $1
  RETURNING *;

-- name: GetTeamMemberByID :one
SELECT * FROM team_member WHERE team_id = $1 AND user_id = $2;
