-- name: GetAllNotificationsForUserID :many
SELECT * FROM notification_notified AS nn
  INNER JOIN notification AS n ON n.notification_id = nn.notification_id
  LEFT JOIN user_account ON user_account.user_id = n.caused_by
  WHERE nn.user_id = $1;

-- name: MarkNotificationAsRead :exec
UPDATE notification_notified SET read = true, read_at = $2 WHERE user_id = $1;

-- name: CreateNotification :one
INSERT INTO notification (caused_by, data, action_type, created_on)
  VALUES ($1, $2, $3, $4) RETURNING *;

-- name: CreateNotificationNotifed :one
INSERT INTO notification_notified (notification_id, user_id) VALUES ($1, $2) RETURNING *;
