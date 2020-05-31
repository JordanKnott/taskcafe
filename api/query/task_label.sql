-- name: CreateTaskLabelForTask :one
INSERT INTO task_label (task_id, project_label_id, assigned_date)
  VALUES ($1, $2, $3) RETURNING *;

-- name: GetTaskLabelsForTaskID :many
SELECT * FROM task_label WHERE task_id = $1;

-- name: GetTaskLabelByID :one
SELECT * FROM task_label WHERE task_label_id = $1;

-- name: DeleteTaskLabelByID :exec
DELETE FROM task_label WHERE task_label_id = $1;

-- name: GetTaskLabelForTaskByProjectLabelID :one
SELECT * FROM task_label WHERE task_id = $1 AND project_label_id = $2;

-- name: DeleteTaskLabelForTaskByProjectLabelID :exec
DELETE FROM task_label WHERE project_label_id = $2 AND task_id = $1;
