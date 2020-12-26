ALTER TABLE task_activity DROP CONSTRAINT task_activity_task_id_fkey;
ALTER TABLE task_activity
  ADD CONSTRAINT task_activity_task_id_fkey
  FOREIGN KEY (task_id)
  REFERENCES task(task_id)
  ON DELETE CASCADE;

ALTER TABLE task_comment DROP CONSTRAINT task_comment_task_id_fkey;
ALTER TABLE task_comment
  ADD CONSTRAINT task_comment_task_id_fkey
  FOREIGN KEY (task_id)
  REFERENCES task(task_id)
  ON DELETE CASCADE;
