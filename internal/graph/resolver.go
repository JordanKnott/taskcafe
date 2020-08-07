//go:generate sh ../scripts/genSchema.sh
//go:generate go run github.com/99designs/gqlgen
package graph

import (
	"sync"

	"github.com/jordanknott/taskcafe/internal/config"
	"github.com/jordanknott/taskcafe/internal/db"
)

type Resolver struct {
	Config     config.AppConfig
	Repository db.Repository
	mu         sync.Mutex
}
