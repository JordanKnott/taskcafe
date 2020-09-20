CREATE TABLE personal_project (
  personal_project_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_account(user_id) ON DELETE CASCADE
);
