CREATE TABLE task_checklist (
  task_checklist_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id uuid NOT NULL REFERENCES task(task_id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL,
  name text NOT NULL,
  position float NOT NULL
);
