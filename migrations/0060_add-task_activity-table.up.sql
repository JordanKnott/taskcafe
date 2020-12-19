CREATE TABLE task_activity_type (
  task_activity_type_id int PRIMARY KEY,
  code text NOT NULL,
  template text NOT NULL
);

INSERT INTO task_activity_type (task_activity_type_id, code, template) VALUES
  (1, 'task_added_to_task_group', 'added this task to {{ index .Data "TaskGroup" }}'),
  (2, 'task_moved_to_task_group', 'moved this task from {{ index .Data "PrevTaskGroup" }} to {{ index .Data "CurTaskGroup"}}'),
  (3, 'task_mark_complete', 'marked this task complete'),
  (4, 'task_mark_incomplete', 'marked this task incomplete'),
  (5, 'task_due_date_changed', 'changed the due date to {{ index .Data "DueDate" }}'),
  (6, 'task_due_date_added', 'moved this task from {{ index .Data "PrevTaskGroup" }} to {{ index .Data "CurTaskGroup"}}'),
  (7, 'task_due_date_removed', 'moved this task from {{ index .Data "PrevTaskGroup" }} to {{ index .Data "CurTaskGroup"}}'),
  (8, 'task_checklist_changed', 'moved this task from {{ index .Data "PrevTaskGroup" }} to {{ index .Data "CurTaskGroup"}}'),
  (9, 'task_checklist_added', 'moved this task from {{ index .Data "PrevTaskGroup" }} to {{ index .Data "CurTaskGroup"}}'),
  (10, 'task_checklist_removed', 'moved this task from {{ index .Data "PrevTaskGroup" }} to {{ index .Data "CurTaskGroup"}}');

CREATE TABLE task_activity (
  task_activity_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  active boolean NOT NULL DEFAULT true,
  task_id uuid NOT NULL REFERENCES task(task_id),
  created_at timestamptz NOT NULL,
  caused_by uuid NOT NULL,
  activity_type_id int NOT NULL REFERENCES task_activity_type(task_activity_type_id),
  data jsonb
);
