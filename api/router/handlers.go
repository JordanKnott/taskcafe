package router

import "github.com/jordanknott/project-citadel/api/pg"

type CitadelHandler struct {
	repo pg.Repository
}
