ALTER TABLE team ADD COLUMN owner uuid REFERENCES user_account(user_id) ON DELETE
 CASCADE;
UPDATE team SET owner = (SELECT user_id FROM user_account WHERE role_code = 'admin' LIMIT 1);
ALTER TABLE team ALTER COLUMN owner SET NOT NULL;
