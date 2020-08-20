INSERT INTO team_member (user_id, team_id, addeddate, role_code)
  SELECT owner as user_id, team_id, NOW() as addeddate, 'admin' as role_code
FROM team ON CONFLICT ON CONSTRAINT team_member_team_id_user_id_key DO NOTHING;
ALTER TABLE team DROP COLUMN owner;
