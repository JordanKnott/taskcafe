-- name: GetLabelColorByID :one
SELECT * FROM label_color WHERE label_color_id = $1;
