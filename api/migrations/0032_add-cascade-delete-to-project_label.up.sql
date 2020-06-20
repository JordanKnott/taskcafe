ALTER TABLE project_label DROP CONSTRAINT project_label_project_id_fkey;
ALTER TABLE project_label
  ADD CONSTRAINT project_label_project_id_fkey
  FOREIGN KEY (project_id)
  REFERENCES project(project_id)
  ON DELETE CASCADE;
