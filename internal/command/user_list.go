package command

import (
	"context"
	"database/sql"
	"os"

	"github.com/jedib0t/go-pretty/v6/table"
	"github.com/jordanknott/taskcafe/internal/config"
	"github.com/jordanknott/taskcafe/internal/db"
	"github.com/spf13/cobra"
)

func newUserListCmd() *cobra.Command {
	return &cobra.Command{
		Use: "list",
		RunE: func(cmd *cobra.Command, args []string) error {
			appConfig, err := config.GetAppConfig()
			if err != nil {
				return err
			}
			dbConn, err := sql.Open("postgres", appConfig.Database.GetDatabaseConnectionUri())
			if err != nil {
				return err
			}
			t := table.NewWriter()
			t.SetOutputMirror(os.Stdout)
			t.AppendHeader(table.Row{"#", "Full Name", "Username", "Email"})
			repo := db.NewRepository(dbConn)
			accounts, err := repo.GetUserAccounts(context.Background())
			if err != nil {
				return nil
			}
			for _, account := range accounts {
				t.AppendRow(table.Row{account.UserID.String(), account.Fullname, account.Username, account.Email})
			}
			t.Render()
			return nil
		},
	}
}
