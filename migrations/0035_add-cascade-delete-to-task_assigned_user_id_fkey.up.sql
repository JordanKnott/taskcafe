ALTER TABLE task_assigned DROP CONSTRAINT task_assigned_user_id_fkey;
ALTER TABLE task_assigned
  ADD CONSTRAINT task_assigned_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES user_account(user_id)
  ON DELETE CASCADE;
