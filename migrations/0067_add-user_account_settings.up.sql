CREATE TABLE account_setting_data_type (
  data_type_id text PRIMARY KEY
);

INSERT INTO account_setting_data_type VALUES ('string');

CREATE TABLE account_setting (
  account_setting_id text PRIMARY KEY,
  constrained boolean NOT NULL,
  data_type text NOT NULL REFERENCES account_setting_data_type(data_type_id) ON DELETE CASCADE,
  constrained_default_value text
    REFERENCES account_setting_allowed_values(allowed_value_id) ON DELETE CASCADE,
  unconstrained_default_value text
);

INSERT INTO account_setting VALUES ('email_notification_frequency', true, 'string');

CREATE TABLE account_setting_allowed_values (
  allowed_value_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_id int NOT NULL REFERENCES account_setting(account_setting_id) ON DELETE CASCADE,
  item_value text NOT NULL
);

INSERT INTO account_setting_allowed_values (setting_id, item_value) VALUES (0, 'never');
INSERT INTO account_setting_allowed_values (setting_id, item_value) VALUES (0, 'hourly');
INSERT INTO account_setting_allowed_values (setting_id, item_value) VALUES (0, 'instant');

CREATE TABLE account_setting_value (
  account_setting_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_account(user_id) ON DELETE CASCADE,
  setting_id  int NOT NULL REFERENCES account_setting(account_setting_id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  allowed_value_id uuid REFERENCES account_setting_allowed_values(allowed_value_id) ON DELETE CASCADE,
  unconstrained_value text
);
