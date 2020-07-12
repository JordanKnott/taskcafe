-- name: CreateTaskChecklist :one
INSERT INTO task_checklist (task_id, created_at, name, position) VALUES ($1, $2, $3, $4)
  RETURNING *;

-- name: GetTaskChecklistsForTask :many
SELECT * FROM task_checklist WHERE task_id = $1;

-- name: UpdateTaskChecklistName :one
UPDATE task_checklist SET name = $2 WHERE task_checklist_id = $1
  RETURNING *;

-- name: DeleteTaskChecklistByID :exec
DELETE FROM task_checklist WHERE task_checklist_id = $1;

-- name: GetTaskChecklistByID :one
SELECT * FROM task_checklist WHERE task_checklist_id = $1;

-- name: CreateTaskChecklistItem :one
INSERT INTO task_checklist_item (task_checklist_id, created_at, name, position, complete, due_date) VALUES ($1, $2, $3, $4, false, null)
  RETURNING *;

-- name: GetTaskChecklistItemsForTaskChecklist :many
SELECT * FROM task_checklist_item WHERE task_checklist_id = $1;

-- name: SetTaskChecklistItemComplete :one
UPDATE task_checklist_item SET complete = $2 WHERE task_checklist_item_id = $1
  RETURNING *;

-- name: DeleteTaskChecklistItem :exec
DELETE FROM task_checklist_item WHERE task_checklist_item_id = $1;

-- name: GetTaskChecklistItemByID :one
SELECT * FROM task_checklist_item WHERE task_checklist_item_id = $1;

-- name: UpdateTaskChecklistItemName :one
UPDATE task_checklist_item SET name = $2 WHERE task_checklist_item_id = $1
  RETURNING *;

-- name: UpdateTaskChecklistPosition :one
UPDATE task_checklist SET position = $2 WHERE task_checklist_id = $1 RETURNING *;

-- name: UpdateTaskChecklistItemLocation :one
UPDATE task_checklist_item SET position = $2, task_checklist_id = $3 WHERE task_checklist_item_id = $1 RETURNING *;
