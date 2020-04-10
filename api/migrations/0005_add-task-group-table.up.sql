CREATE TABLE task_group (
  task_group_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES project(project_id),
  created_at timestamptz NOT NULL,
  name text NOT NULL,
  position float NOT NULL
);
