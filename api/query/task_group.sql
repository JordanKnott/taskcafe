-- name: CreateTaskGroup :one
INSERT INTO task_group (project_id, created_at, name, position)
  VALUES($1, $2, $3, $4) RETURNING *;

-- name: GetTaskGroupsForProject :many
SELECT * FROM task_group WHERE project_id = $1;

-- name: GetAllTaskGroups :many
SELECT * FROM task_group;

-- name: GetTaskGroupByID :one
SELECT * FROM task_group WHERE task_group_id = $1;
