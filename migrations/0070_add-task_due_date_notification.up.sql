CREATE TABLE task_due_date_reminder_duration (
  code text PRIMARY KEY
);

INSERT INTO task_due_date_reminder_duration VALUES ('MINUTE');
INSERT INTO task_due_date_reminder_duration VALUES ('HOUR');
INSERT INTO task_due_date_reminder_duration VALUES ('DAY');
INSERT INTO task_due_date_reminder_duration VALUES ('WEEK');

CREATE TABLE task_due_date_reminder (
  due_date_reminder_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id uuid NOT NULL REFERENCES task(task_id) ON DELETE CASCADE,
  period int NOT NULL,
  duration text NOT NULL REFERENCES task_due_date_reminder_duration(code) ON DELETE CASCADE
);
