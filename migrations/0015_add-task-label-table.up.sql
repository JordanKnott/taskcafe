CREATE TABLE task_label (
  task_label_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id uuid NOT NULL REFERENCES task(task_id),
  project_label_id uuid NOT NULL REFERENCES project_label(project_label_id),
  assigned_date timestamptz NOT NULL
);
