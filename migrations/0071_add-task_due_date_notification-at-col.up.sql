ALTER TABLE task_due_date_reminder ADD COLUMN remind_at timestamptz NOT NULL DEFAULT NOW();
