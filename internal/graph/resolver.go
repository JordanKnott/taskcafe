//go:generate sh ../scripts/genSchema.sh
//go:generate go run github.com/99designs/gqlgen
package graph

import (
	"sync"

	"github.com/jordanknott/project-citadel/api/internal/config"
	"github.com/jordanknott/project-citadel/api/internal/db"
)

type Resolver struct {
	Config     config.AppConfig
	Repository db.Repository
	mu         sync.Mutex
}
