package command

import (
	"database/sql"

	"github.com/jordanknott/taskcafe/internal/config"
	"github.com/pressly/goose/v3"
	"github.com/spf13/cobra"
)

func newMigrateCreateCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "create name type",
		Short: "Create a new migration file",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			appConfig, err := config.GetAppConfig()
			if err != nil {
				return err
			}

			db, err := sql.Open("postgres", appConfig.Database.GetDatabaseConnectionUri())
			if err != nil {
				return err
			}
			return goose.Create(db, "migrations", args[0], args[1])
		},
	}
}
