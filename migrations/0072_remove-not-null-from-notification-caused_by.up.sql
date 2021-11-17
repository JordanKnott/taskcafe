ALTER TABLE notification ALTER COLUMN caused_by DROP NOT NULL;
  UPDATE notification SET caused_by = null WHERE caused_by = '00000000-0000-0000-0000-000000000000';
