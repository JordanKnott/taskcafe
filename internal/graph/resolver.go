//go:generate sh ../scripts/genSchema.sh
//go:generate go run github.com/99designs/gqlgen

package graph

import (
	"sync"

	"github.com/jordanknott/taskcafe/internal/config"
	"github.com/jordanknott/taskcafe/internal/db"
)

type NotificationObservers struct {
	Subscribers map[string]map[string]chan *Notified
	Mu          sync.Mutex
}

// Resolver handles resolving GraphQL queries & mutations
type Resolver struct {
	Repository    db.Repository
	AppConfig     config.AppConfig
	Notifications NotificationObservers
}
