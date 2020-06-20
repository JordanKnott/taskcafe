ALTER TABLE task_label DROP CONSTRAINT task_label_project_label_id_fkey;
ALTER TABLE task_label
  ADD CONSTRAINT task_label_project_label_id_fkey
  FOREIGN KEY (project_label_id)
  REFERENCES project_label(project_label_id)
  ON DELETE CASCADE;
