// +build prod

package commands

import (
	"github.com/jordanknott/taskcafe/internal/migrations"
)

func init() {
	migration = migrations.Migrations
}
