-- name: GetAllProjects :many
SELECT * FROM project;

-- name: GetAllProjectsForTeam :many
SELECT * FROM project WHERE team_id = $1;

-- name: GetProjectByID :one
SELECT * FROM project WHERE project_id = $1;

-- name: CreateProject :one
INSERT INTO project(owner, team_id, created_at, name) VALUES ($1, $2, $3, $4) RETURNING *;

-- name: SetProjectOwner :one
UPDATE project SET owner = $2 WHERE project_id = $1 RETURNING *;

-- name: UpdateProjectNameByID :one
UPDATE project SET name = $2 WHERE project_id = $1 RETURNING *;

-- name: DeleteProjectByID :exec
DELETE FROM project WHERE project_id = $1;

-- name: GetProjectMembersForProjectID :many
SELECT * FROM project_member WHERE project_id = $1;

-- name: GetRoleForProjectMemberByUserID :one
SELECT code, role.name FROM project_member INNER JOIN role ON role.code = project_member.role_code 
WHERE user_id = $1 AND project_id = $2;

-- name: CreateProjectMember :one
INSERT INTO project_member (project_id, user_id, role_code, added_at) VALUES ($1, $2, $3, $4)
  RETURNING *;

-- name: DeleteProjectMember :exec
DELETE FROM project_member WHERE user_id = $1 AND project_id = $2;

-- name: UpdateProjectMemberRole :one
UPDATE project_member SET role_code = $3 WHERE project_id = $1 AND user_id = $2
  RETURNING *;

-- name: GetOwnedTeamProjectsForUserID :many
SELECT project_id FROM project WHERE owner = $1 AND team_id = $2;

-- name: GetOwnedProjectsForUserID :many
SELECT * FROM project WHERE owner = $1;

-- name: GetMemberProjectIDsForUserID :many
SELECT project_id FROM project_member WHERE user_id = $1;

-- name: UpdateProjectOwnerByOwnerID :many
UPDATE project SET owner = $2 WHERE owner = $1 RETURNING project_id;
