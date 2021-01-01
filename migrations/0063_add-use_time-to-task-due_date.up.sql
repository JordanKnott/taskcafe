ALTER TABLE task ADD COLUMN has_time boolean NOT NULL DEFAULT false;
UPDATE task SET has_time = true;
