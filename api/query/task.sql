-- name: CreateTask :one
INSERT INTO task (task_group_id, created_at, name, position)
  VALUES($1, $2, $3, $4) RETURNING *;

-- name: GetTasksForTaskGroupID :many
SELECT * FROM task WHERE task_group_id = $1;

-- name: GetAllTasks :many
SELECT * FROM task;

-- name: UpdateTaskLocation :one
UPDATE task SET task_group_id = $2, position = $3 WHERE task_id = $1 RETURNING *;

-- name: DeleteTaskByID :exec
DELETE FROM task WHERE task_id = $1;

-- name: UpdateTaskName :one
UPDATE task SET name = $2 WHERE task_id = $1 RETURNING *;
