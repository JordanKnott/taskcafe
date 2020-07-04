ALTER TABLE project DROP CONSTRAINT project_team_id_fkey;
ALTER TABLE project
  ADD CONSTRAINT project_team_id_fkey
  FOREIGN KEY (team_id)
  REFERENCES team(team_id)
  ON DELETE CASCADE;
