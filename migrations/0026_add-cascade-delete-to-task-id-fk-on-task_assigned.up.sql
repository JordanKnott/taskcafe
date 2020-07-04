ALTER TABLE task_assigned DROP CONSTRAINT task_assigned_task_id_fkey;
ALTER TABLE task_assigned
  ADD CONSTRAINT task_assigned_task_id_fkey
  FOREIGN KEY (task_id)
  REFERENCES task(task_id)
  ON DELETE CASCADE;
