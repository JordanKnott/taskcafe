-- name: CreateTaskLabelForTask :one
INSERT INTO task_label (task_id, label_color_id, assigned_date)
  VALUES ($1, $2, $3) RETURNING *;

-- name: GetTaskLabelsForTaskID :many
SELECT * FROM task_label WHERE task_id = $1;
