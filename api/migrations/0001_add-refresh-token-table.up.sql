CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE refresh_token (
  token_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL
);
