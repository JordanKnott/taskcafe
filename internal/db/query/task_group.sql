-- name: CreateTaskGroup :one
INSERT INTO task_group (project_id, created_at, name, position)
  VALUES($1, $2, $3, $4) RETURNING *;

-- name: GetTaskGroupsForProject :many
SELECT * FROM task_group WHERE project_id = $1;

-- name: GetProjectIDForTaskGroup :one
SELECT project_id from task_group WHERE task_group_id = $1;

-- name: GetAllTaskGroups :many
SELECT * FROM task_group;

-- name: GetTaskGroupByID :one
SELECT * FROM task_group WHERE task_group_id = $1;

-- name: SetTaskGroupName :one
UPDATE task_group SET name = $2 WHERE task_group_id = $1 RETURNING *;

-- name: DeleteTaskGroupByID :execrows
DELETE FROM task_group WHERE task_group_id = $1;

-- name: UpdateTaskGroupLocation :one
UPDATE task_group SET position = $2 WHERE task_group_id = $1 RETURNING *;
