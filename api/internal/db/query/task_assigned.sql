-- name: CreateTaskAssigned :one
INSERT INTO task_assigned (task_id, user_id, assigned_date)
  VALUES($1, $2, $3) RETURNING *;

-- name: GetAssignedMembersForTask :many
SELECT * FROM task_assigned WHERE task_id = $1;

-- name: DeleteTaskAssignedByID :one
DELETE FROM task_assigned WHERE task_id = $1 AND user_id = $2 RETURNING *;
