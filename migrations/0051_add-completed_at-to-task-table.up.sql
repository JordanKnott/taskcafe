ALTER TABLE task ADD COLUMN completed_at timestamptz;
UPDATE task as t1 SET completed_at = NOW()
  FROM task as t2
  WHERE t1.task_id = t2.task_id AND t1.complete = true;
