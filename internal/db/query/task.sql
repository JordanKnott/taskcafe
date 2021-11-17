-- name: GetTaskWatcher :one
SELECT * FROM task_watcher WHERE user_id = $1 AND task_id = $2;

-- name: GetTaskWatchersForTask :many
SELECT * FROM task_watcher WHERE task_id = $1;

-- name: CreateTaskWatcher :one
INSERT INTO task_watcher (user_id, task_id, watched_at) VALUES ($1, $2, $3) RETURNING *;

-- name: GetTaskIDByShortID :one
SELECT task_id FROM task WHERE short_id = $1;

-- name: DeleteTaskWatcher :exec
DELETE FROM task_watcher WHERE user_id = $1 AND task_id = $2;

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
UPDATE task SET due_date = $2, has_time = $3 WHERE task_id = $1 RETURNING *;

-- name: SetTaskComplete :one
UPDATE task SET complete = $2, completed_at = $3 WHERE task_id = $1 RETURNING *;

-- name: GetProjectIDForTask :one
SELECT project_id FROM task
  INNER JOIN task_group ON task_group.task_group_id = task.task_group_id
  WHERE task_id = $1;

-- name: GetProjectInfoForTask :one
SELECT project.short_id AS project_short_id, project.name, task.short_id AS task_short_id FROM task
  INNER JOIN task_group ON task_group.task_group_id = task.task_group_id
  INNER JOIN project ON task_group.project_id = project.project_id
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

-- name: GetRecentlyAssignedTaskForUserID :many
SELECT task.* FROM task_assigned INNER JOIN
  task ON task.task_id = task_assigned.task_id WHERE user_id = $1
  AND $4::boolean = true OR (
    $4::boolean = false AND complete = $2 AND (
      $2 = false OR ($2 = true AND completed_at > $3)
    )
  )
  ORDER BY task_assigned.assigned_date DESC;

-- name: GetAssignedTasksProjectForUserID :many
SELECT task.* FROM task_assigned
  INNER JOIN task ON task.task_id = task_assigned.task_id
  INNER JOIN task_group ON task_group.task_group_id = task.task_group_id
  WHERE user_id = $1
  AND $4::boolean = true OR (
    $4::boolean = false AND complete = $2 AND (
      $2 = false OR ($2 = true AND completed_at > $3)
    )
  )
  ORDER BY task_group.project_id DESC, task_assigned.assigned_date DESC;

-- name: GetProjectIdMappings :many
SELECT project_id, task_id FROM task
INNER JOIN task_group ON task_group.task_group_id = task.task_group_id
  WHERE task_id = ANY($1::uuid[]);

-- name: GetAssignedTasksDueDateForUserID :many
SELECT task.* FROM task_assigned
  INNER JOIN task ON task.task_id = task_assigned.task_id
  INNER JOIN task_group ON task_group.task_group_id = task.task_group_id
  WHERE user_id = $1
  AND $4::boolean = true OR (
    $4::boolean = false AND complete = $2 AND (
      $2 = false OR ($2 = true AND completed_at > $3)
    )
  )
  ORDER BY task.due_date DESC, task_group.project_id DESC;

-- name: GetCommentCountForTask :one
SELECT COUNT(*) FROM task_comment WHERE task_id = $1;


-- name: CreateDueDateReminder :one
INSERT INTO task_due_date_reminder (task_id, period, duration, remind_at) VALUES ($1, $2, $3, $4) RETURNING *;

-- name: UpdateDueDateReminder :one
UPDATE task_due_date_reminder SET remind_at = $4, period = $2, duration = $3 WHERE due_date_reminder_id = $1 RETURNING *;

-- name: GetTaskForDueDateReminder :one
SELECT task.* FROM task_due_date_reminder 
  INNER JOIN task ON task.task_id = task_due_date_reminder.task_id
  WHERE task_due_date_reminder.due_date_reminder_id = $1;

-- name: UpdateDueDateReminderRemindAt :one
UPDATE task_due_date_reminder SET remind_at = $2 WHERE due_date_reminder_id = $1 RETURNING *;

-- name: GetDueDateRemindersForTaskID :many
SELECT * FROM task_due_date_reminder WHERE task_id = $1;

-- name: GetDueDateReminderByID :one
SELECT * FROM task_due_date_reminder WHERE due_date_reminder_id = $1;

-- name: DeleteDueDateReminder :exec
DELETE FROM task_due_date_reminder WHERE due_date_reminder_id = $1;

-- name: GetDueDateRemindersForDuration :many
SELECT * FROM task_due_date_reminder WHERE remind_at >= @start_at::timestamptz;

