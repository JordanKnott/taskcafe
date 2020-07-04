ALTER TABLE team ADD COLUMN organization_id uuid NOT NULL REFERENCES organization(organization_id);
