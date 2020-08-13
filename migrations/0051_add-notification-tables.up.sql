CREATE TABLE notification_object (
  notification_object_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id uuid NOT NULL,
  action_type int NOT NULL,
  actor_id uuid NOT NULL,
  entity_type int NOT NULL,
  created_on timestamptz NOT NULL
);

CREATE TABLE notification (
  notification_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_object_id uuid REFERENCES notification_object(notification_object_id) ON DELETE CASCADE,
  notifier_id uuid NOT NULL REFERENCES user_account(user_id) ON DELETE CASCADE,
  read boolean NOT NULL DEFAULT false
);
