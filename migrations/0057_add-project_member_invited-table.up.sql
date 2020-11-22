CREATE TABLE project_member_invited (
  project_member_invited_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL
    REFERENCES project(project_id) ON DELETE CASCADE,
  user_account_invited_id uuid NOT NULL
    REFERENCES user_account_invited(user_account_invited_id) ON DELETE CASCADE
);
