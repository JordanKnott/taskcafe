CREATE TABLE task_assigned (
  task_assigned_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id uuid NOT NULL REFERENCES task(task_id),
  user_id uuid NOT NULL REFERENCES user_account(user_id),
  assigned_date timestamptz NOT NULL
);
