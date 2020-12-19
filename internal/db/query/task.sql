-- name: CreateTask :one
INSERT INTO task (task_group_id, created_at, name, position)
  VALUES($1, $2, $3, $4) RETURNING *;

-- name: CreateTaskAll :one
INSERT INTO task (task_group_id, created_at, name, position, description, complete, due_date)
  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;

-- name: UpdateTaskDescription :one
UPDATE task SET description = $2 WHERE task_id = $1 RETURNING *;

-- name: GetTaskByID :one
SELECT * FROM task WHERE task_id = $1;

-- name: GetTasksForTaskGroupID :many
SELECT * FROM task WHERE task_group_id = $1;

-- name: GetAllTasks :many
SELECT * FROM task;

-- name: UpdateTaskLocation :one
UPDATE task SET task_group_id = $2, position = $3 WHERE task_id = $1 RETURNING *;

-- name: UpdateTaskPosition :one
UPDATE task SET position = $2 WHERE task_id = $1 RETURNING *;

-- name: DeleteTaskByID :exec
DELETE FROM task WHERE task_id = $1;

-- name: UpdateTaskName :one
UPDATE task SET name = $2 WHERE task_id = $1 RETURNING *;

-- name: DeleteTasksByTaskGroupID :execrows
DELETE FROM task where task_group_id = $1;

-- name: UpdateTaskDueDate :one
UPDATE task SET due_date = $2 WHERE task_id = $1 RETURNING *;

-- name: SetTaskComplete :one
UPDATE task SET complete = $2, completed_at = $3 WHERE task_id = $1 RETURNING *;

-- name: GetProjectIDForTask :one
SELECT project_id FROM task
  INNER JOIN task_group ON task_group.task_group_id = task.task_group_id
  WHERE task_id = $1;

-- name: CreateTaskComment :one
INSERT INTO task_comment (task_id, message, created_at, created_by)
  VALUES ($1, $2, $3, $4) RETURNING *;

-- name: GetCommentsForTaskID :many
SELECT * FROM task_comment WHERE task_id = $1 ORDER BY created_at;

-- name: DeleteTaskCommentByID :one
DELETE FROM task_comment WHERE task_comment_id = $1 RETURNING *;

-- name: UpdateTaskComment :one
UPDATE task_comment SET message = $2, updated_at = $3 WHERE task_comment_id = $1 RETURNING *;
