CREATE TABLE project_label (
  project_label_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES project(project_id),
  label_color_id uuid NOT NULL REFERENCES label_color(label_color_id),
  created_date timestamptz NOT NULL,
  name text
);
