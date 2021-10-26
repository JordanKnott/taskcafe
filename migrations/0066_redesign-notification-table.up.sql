DROP TABLE notification_object CASCADE;
DROP TABLE notification CASCADE;

CREATE TABLE notification (
  notification_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id uuid,
  action_type int NOT NULL,
  data jsonb,
  created_on timestamptz NOT NULL
);

CREATE TABLE notification_notified (
  notified_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id uuid REFERENCES notification(notification_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_account(user_id) ON DELETE CASCADE,
  read boolean NOT NULL DEFAULT false,
  read_at timestamptz
);
