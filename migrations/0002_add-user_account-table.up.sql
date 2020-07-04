CREATE TABLE user_account (
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL
);
