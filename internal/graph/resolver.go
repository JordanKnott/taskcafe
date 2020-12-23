//go:generate sh ../scripts/genSchema.sh
//go:generate go run github.com/99designs/gqlgen

package graph

import (
	"sync"

	"github.com/jordanknott/taskcafe/internal/db"
	"github.com/jordanknott/taskcafe/internal/utils"
)

// Resolver handles resolving GraphQL queries & mutations
type Resolver struct {
	Repository  db.Repository
	EmailConfig utils.EmailConfig
	mu          sync.Mutex
}
