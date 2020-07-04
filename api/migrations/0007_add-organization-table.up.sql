CREATE TABLE organization (
  organization_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz NOT NULL,
  name text NOT NULL
);

INSERT INTO organization (created_at, name) VALUES (NOW(), 'sys_default_organization');
