CREATE TABLE task_comment (
  task_comment_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id uuid NOT NULL REFERENCES task(task_id),
  created_at timestamptz NOT NULL,
  updated_at timestamptz,
  created_by uuid NOT NULL REFERENCES user_account(user_id),
  pinned boolean NOT NULL DEFAULT false,
  message TEXT NOT NULL
);
