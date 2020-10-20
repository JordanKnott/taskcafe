CREATE TABLE user_account_confirm_token (
  confirm_token_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE
);
