CREATE TABLE user_account_invited (
  user_account_invited_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  invited_on timestamptz NOT NULL DEFAULT NOW(),
  has_joined boolean NOT NULL DEFAULT false
);
