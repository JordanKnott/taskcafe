ALTER TABLE task_label DROP CONSTRAINT task_label_task_id_fkey;
ALTER TABLE task_label
  ADD CONSTRAINT task_label_task_id_fkey
  FOREIGN KEY (task_id)
  REFERENCES task(task_id)
  ON DELETE CASCADE;
