-- name: GetAllNotificationsForUserID :many
SELECT * FROM notification_notified AS nn
  INNER JOIN notification AS n ON n.notification_id = nn.notification_id
  WHERE nn.user_id = $1;

-- name: GetNotifiedByID :one
SELECT * FROM notification_notified as nn
  INNER JOIN notification AS n ON n.notification_id = nn.notification_id
  WHERE notified_id = $1;

-- name: GetNotifiedByIDNoExtra :one
SELECT * FROM notification_notified as nn WHERE nn.notified_id = $1;

-- name: HasUnreadNotification :one
SELECT EXISTS (SELECT 1 FROM notification_notified WHERE read = false AND user_id = $1);

-- name: MarkNotificationAsRead :exec
UPDATE notification_notified SET read = $3, read_at = $2 WHERE user_id = $1 AND notified_id = $4;

-- name: MarkAllNotificationsRead :exec
UPDATE notification_notified SET read = true, read_at = $2 WHERE user_id = $1;

-- name: CreateNotification :one
INSERT INTO notification (caused_by, data, action_type, created_on)
  VALUES ($1, $2, $3, $4) RETURNING *;

-- name: CreateNotificationNotifed :one
INSERT INTO notification_notified (notification_id, user_id) VALUES ($1, $2) RETURNING *;

-- name: GetNotificationByID :one
SELECT * FROM notification WHERE notification_id = $1;

-- name: GetNotificationsForUserIDPaged :many
SELECT n.*, nn.* FROM notification_notified AS nn
  INNER JOIN notification AS n ON n.notification_id = nn.notification_id
  WHERE nn.user_id = @user_id::uuid
  AND (@enable_unread::boolean = false OR nn.read = false)
  AND (@enable_action_type::boolean = false OR n.action_type = ANY(@action_type::text[]))
  ORDER BY n.created_on DESC
  LIMIT @limit_rows::int;

-- name: GetNotificationsForUserIDCursor :many
SELECT n.*, nn.* FROM notification_notified AS nn
  INNER JOIN notification AS n ON n.notification_id = nn.notification_id
  WHERE (n.created_on, n.notification_id) < (@created_on::timestamptz, @notification_id::uuid)
  AND nn.user_id = @user_id::uuid
  AND (@enable_unread::boolean = false OR nn.read = false)
  AND (@enable_action_type::boolean = false OR n.action_type = ANY(@action_type::text[]))
  ORDER BY n.created_on DESC
  LIMIT @limit_rows::int;
