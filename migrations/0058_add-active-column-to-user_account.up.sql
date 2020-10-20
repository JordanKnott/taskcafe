ALTER TABLE user_account ADD COLUMN active boolean NOT NULL DEFAULT false;
UPDATE user_account SET active = true;
