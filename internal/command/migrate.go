package command

import (
	"database/sql"
	"fmt"

	"github.com/jordanknott/taskcafe/internal/config"
	"github.com/pressly/goose/v3"
	"github.com/spf13/cobra"
)

func newMigrateCmd() *cobra.Command {
	cc := &cobra.Command{
		Use:   "migrate",
		Short: "run the migrations",
		Long:  "Run the migrations",
		RunE: func(cmd *cobra.Command, args []string) error {
			appConfig, err := config.GetAppConfig()
			if err != nil {
				return err
			}

			fmt.Println(appConfig.Database.GetDatabaseConnectionUri())
			db, err := sql.Open("postgres", appConfig.Database.GetDatabaseConnectionUri())
			if err != nil {
				return err
			}
			return goose.Up(db, "migrations")
		},
	}
	cc.AddCommand(newMigrateCreateCmd())
	return cc
}
