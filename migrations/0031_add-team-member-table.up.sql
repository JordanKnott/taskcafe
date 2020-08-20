CREATE TABLE team_member (
  team_member_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id uuid NOT NULL REFERENCES team(team_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_account(user_id) ON DELETE CASCADE,
  UNIQUE(team_id, user_id),
  addedDate timestamptz NOT NULL
);
