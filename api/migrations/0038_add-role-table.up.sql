CREATE TABLE role (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO role VALUES ('owner', 'Owner');
INSERT INTO role VALUES ('admin', 'Admin');
INSERT INTO role VALUES ('member', 'Member');
INSERT INTO role VALUES ('observer', 'Observer');
