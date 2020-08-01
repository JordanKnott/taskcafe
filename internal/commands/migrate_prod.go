// +build prod

package commands

import (
	"fmt"

	"github.com/jordanknott/taskcafe/internal/migrations"
)

func init() {
	migration = migrations.Migrations
}
