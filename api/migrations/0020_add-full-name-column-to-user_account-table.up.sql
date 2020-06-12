ALTER TABLE user_account ADD COLUMN full_name TEXT;
UPDATE user_account SET full_name = CONCAT(first_name, ' ', last_name);
ALTER TABLE user_account ALTER COLUMN full_name SET NOT NULL;
