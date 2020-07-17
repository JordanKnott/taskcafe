ALTER TABLE task_group DROP CONSTRAINT task_group_project_id_fkey;
ALTER TABLE task_group
  ADD CONSTRAINT task_group_project_id_fkey
  FOREIGN KEY (project_id)
  REFERENCES project(project_id)
  ON DELETE CASCADE;
