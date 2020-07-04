-- name: CreateProjectLabel :one
INSERT INTO project_label (project_id, label_color_id, created_date, name)
  VALUES ($1, $2, $3, $4) RETURNING *;

-- name: GetProjectLabelsForProject :many
SELECT * FROM project_label WHERE project_id = $1;

-- name: GetProjectLabelByID :one
SELECT * FROM project_label WHERE project_label_id = $1;

-- name: DeleteProjectLabelByID :exec
DELETE FROM project_label WHERE project_label_id = $1;

-- name: UpdateProjectLabelName :one
UPDATE project_label SET name = $2 WHERE project_label_id = $1 RETURNING *;

-- name: UpdateProjectLabelColor :one
UPDATE project_label SET label_color_id = $2 WHERE project_label_id = $1 RETURNING *;

-- name: UpdateProjectLabel :one
UPDATE project_label SET name = $2, label_color_id = $3 WHERE project_label_id = $1 RETURNING *;
