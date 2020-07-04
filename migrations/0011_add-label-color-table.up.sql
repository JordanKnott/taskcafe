CREATE TABLE label_color (
  label_color_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  color_hex TEXT NOT NULL,
  position FLOAT NOT NULL
);
