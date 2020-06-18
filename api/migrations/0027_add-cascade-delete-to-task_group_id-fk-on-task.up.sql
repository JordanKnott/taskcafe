ALTER TABLE task DROP CONSTRAINT task_task_group_id_fkey;
ALTER TABLE task
  ADD CONSTRAINT task_task_group_id_fkey
  FOREIGN KEY (task_group_id)
  REFERENCES task_group(task_group_id)
  ON DELETE CASCADE;
