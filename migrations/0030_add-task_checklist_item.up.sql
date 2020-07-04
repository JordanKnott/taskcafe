CREATE TABLE task_checklist_item (
  task_checklist_item_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_checklist_id uuid NOT NULL REFERENCES task_checklist(task_checklist_id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL,
  complete boolean NOT NULL DEFAULT false,
  name text NOT NULL,
  position float NOT NULL,
  due_date timestamptz
);
