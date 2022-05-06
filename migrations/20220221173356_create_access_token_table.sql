-- +goose Up
-- +goose StatementBegin
CREATE TABLE access_token (
    token text PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES user_account(user_id) ON DELETE CASCADE,
    expires_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL
);
-- +goose StatementEnd
