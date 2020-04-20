-- name: CreateProjectLabel :one
INSERT INTO project_label (project_id, label_color_id, created_date, name)
  VALUES ($1, $2, $3, $4) RETURNING *;

-- name: GetProjectLabelsForProject :many
SELECT * FROM project_label WHERE project_id = $1;

-- name: GetProjectLabelByID :one
SELECT * FROM project_label WHERE project_label_id = $1;
