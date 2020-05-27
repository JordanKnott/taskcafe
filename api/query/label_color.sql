-- name: GetLabelColorByID :one
SELECT * FROM label_color WHERE label_color_id = $1;

-- name: GetLabelColors :many
SELECT * FROM label_color;

-- name: CreateLabelColor :one
INSERT INTO label_color (name, color_hex, position) VALUES ($1, $2, $3)
  RETURNING *;
