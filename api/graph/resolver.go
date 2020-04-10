//go:generate go run github.com/99designs/gqlgen
package graph

import (
	"sync"

	"github.com/jordanknott/project-citadel/api/pg"
)

type Resolver struct {
	Repository pg.Repository
	mu         sync.Mutex
}
