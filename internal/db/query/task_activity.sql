-- name: CreateTaskActivity :one
INSERT INTO task_activity (task_id, caused_by, created_at, activity_type_id, data)
  VALUES ($1, $2, $3, $4, $5) RETURNING *;

-- name: GetActivityForTaskID :many
SELECT * FROM task_activity WHERE task_id = $1 AND active = true;

-- name: GetTemplateForActivityID :one
SELECT template FROM task_activity_type WHERE task_activity_type_id = $1;

-- name: GetLastMoveForTaskID :one
SELECT active, created_at, data->>'CurTaskGroupID' AS cur_task_group_id, data->>'PrevTaskGroupID' AS prev_task_group_id FROM task_activity
  WHERE task_id = $1 AND activity_type_id = 2 AND created_at >= NOW() - INTERVAL '5 minutes'
ORDER BY created_at DESC LIMIT 1;

-- name: SetInactiveLastMoveForTaskID :exec
UPDATE task_activity SET active = false WHERE task_activity_id = (
  SELECT task_activity_id FROM task_activity AS ta
  WHERE ta.activity_type_id = 2 AND ta.task_id = $1
  AND ta.created_at >= NOW() - INTERVAL '5 minutes'
  ORDER BY created_at DESC LIMIT 1
);
