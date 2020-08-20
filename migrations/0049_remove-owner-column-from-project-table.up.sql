INSERT INTO project_member (user_id, project_id, added_at, role_code)
  SELECT owner as user_id, project_id, NOW() as added_at, 'admin' as role_code
FROM project;
ALTER TABLE project DROP COLUMN owner;
