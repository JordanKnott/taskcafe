CREATE TABLE project (
  project_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id uuid NOT NULL REFERENCES team(team_id),
  created_at timestamptz NOT NULL,
  name text NOT NULL
);
