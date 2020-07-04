ALTER TABLE user_account ADD COLUMN role_code text
  NOT NULL REFERENCES role(code) ON DELETE CASCADE DEFAULT 'member';
