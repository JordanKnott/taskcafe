CREATE TABLE task (
  task_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_group_id uuid NOT NULL REFERENCES task_group(task_group_id),
  created_at timestamptz NOT NULL,
  name text NOT NULL,
  position float NOT NULL
);
