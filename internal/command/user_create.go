package command

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/jordanknott/taskcafe/internal/config"
	"github.com/jordanknott/taskcafe/internal/db"
	"github.com/manifoldco/promptui"
	"github.com/spf13/cobra"
	"golang.org/x/crypto/bcrypt"
)

func newUserCreateCmd() *cobra.Command {
	return &cobra.Command{
		Use: "create <username> <email>",
		RunE: func(cmd *cobra.Command, args []string) error {
			appConfig, err := config.GetAppConfig()
			if err != nil {
				return err
			}
			dbConn, err := sql.Open("postgres", appConfig.Database.GetDatabaseConnectionUri())
			if err != nil {
				return err
			}
			prompt := promptui.Prompt{
				Label: "User's fullname",
			}
			fullname, err := prompt.Run()
			if err != nil {
				return err
			}
			prompt = promptui.Prompt{
				Label: "User's password",
				Mask:  '*',
			}
			password, err := prompt.Run()
			if err != nil {
				return err
			}
			repo := db.NewRepository(dbConn)
			hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
			if err != nil {
				return err
			}
			createdAt := time.Now().UTC()
			account, err := repo.CreateUserAccount(context.Background(), db.CreateUserAccountParams{Username: args[0], Email: args[1], Fullname: fullname, PasswordHash: string(hash), CreatedAt: createdAt})
			if err != nil {
				return err
			}
			fmt.Println("Created account: " + account.UserID.String())
			return nil
		},
	}
}
