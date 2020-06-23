ALTER TABLE refresh_token
  ADD CONSTRAINT refresh_token_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES user_account(user_id)
  ON DELETE CASCADE;
