-- name: GetAllNotificationsForUserID :many
SELECT n.* FROM notification as n
INNER JOIN notification_object as no ON no.notification_object_id = n.notification_object_id
WHERE n.notifier_id = $1 ORDER BY no.created_on DESC;

-- name: GetNotificationForNotificationID :one
SELECT n.*, no.* FROM notification as n
  INNER JOIN notification_object as no ON no.notification_object_id = n.notification_object_id
WHERE n.notification_id = $1;

-- name: CreateNotificationObject :one
INSERT INTO notification_object(entity_type, action_type, entity_id, created_on, actor_id)
  VALUES ($1, $2, $3, $4, $5) RETURNING *;

-- name: GetEntityIDForNotificationID :one
SELECT no.entity_id FROM notification as n
  INNER JOIN notification_object as no ON no.notification_object_id = n.notification_object_id
WHERE n.notification_id = $1;

-- name: GetEntityForNotificationID :one
SELECT no.created_on, no.entity_id, no.entity_type, no.action_type, no.actor_id FROM notification as n
  INNER JOIN notification_object as no ON no.notification_object_id = n.notification_object_id
WHERE n.notification_id = $1;

-- name: CreateNotification :one
INSERT INTO notification(notification_object_id, notifier_id)
  VALUES ($1, $2) RETURNING *;
