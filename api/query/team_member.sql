-- name: CreateTeamMember :one
INSERT INTO team_member (team_id, user_id, addedDate) VALUES ($1, $2, $3)
  RETURNING *;

-- name: GetTeamMembersForTeamID :many
SELECT * FROM team_member WHERE team_id = $1;

-- name: DeleteTeamMemberByUserID :exec
DELETE FROM team_member WHERE user_id = $1;
