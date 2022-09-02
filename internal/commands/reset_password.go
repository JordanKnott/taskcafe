package commands

import (
	"context"
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/jordanknott/taskcafe/internal/db"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"golang.org/x/crypto/bcrypt"
)

func newResetPasswordCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "reset-password <username> <password>",
		Short: "Resets password of the specified user",
		Long:  "If the user forgets its password you can reset it with this command.",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			connection := fmt.Sprintf("user=%s password=%s host=%s dbname=%s sslmode=disable",
				viper.GetString("database.user"),
				viper.GetString("database.password"),
				viper.GetString("database.host"),
				viper.GetString("database.name"),
			)
			var database *sqlx.DB
			var err error
			var retryDuration time.Duration
			maxRetryNumber := 4
			for i := 0; i < maxRetryNumber; i++ {
				database, err = sqlx.Connect("postgres", connection)
				if err == nil {
					break
				}
				retryDuration = time.Duration(i*2) * time.Second
				log.WithFields(log.Fields{"retryNumber": i, "retryDuration": retryDuration}).WithError(err).Error("issue connecting to database, retrying")
				if i != maxRetryNumber-1 {
					time.Sleep(retryDuration)
				}
			}
			database.SetMaxOpenConns(25)
			database.SetMaxIdleConns(25)
			database.SetConnMaxLifetime(5 * time.Minute)
			repo := *db.NewRepository(database)

			username := args[0]
			password := args[1]

			user, err := repo.GetUserAccountByUsername(context.TODO(), username)
			if err != nil {
				fmt.Println("There is no user with that username. :/")
				return nil
			}

			hashedPwd, err := bcrypt.GenerateFromPassword([]byte(password), 14)

			if _, err := repo.SetUserPassword(context.TODO(), db.SetUserPasswordParams{UserID: user.UserID, PasswordHash: string(hashedPwd)}); err != nil {
				return err
			}
			fmt.Println("Updated user \"" + username + "\" password.")
			defer database.Close()
			return nil
		},
	}
}
