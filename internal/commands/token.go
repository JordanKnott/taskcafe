package commands

import (
	"context"
	"fmt"
	"time"

	"github.com/jordanknott/taskcafe/internal/config"
	"github.com/jordanknott/taskcafe/internal/db"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func newTokenCmd() *cobra.Command {
	cc := &cobra.Command{
		Use:   "token [username]",
		Short: "Creates an access token for a user",
		Long:  "Creates an access token for a user",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			Formatter := new(log.TextFormatter)
			Formatter.TimestampFormat = "02-01-2006 15:04:05"
			Formatter.FullTimestamp = true
			log.SetFormatter(Formatter)
			log.SetLevel(log.InfoLevel)
			appConfig, err := config.GetAppConfig()
			if err != nil {
				return err
			}

			var dbConnection *sqlx.DB
			var retryDuration time.Duration
			maxRetryNumber := 4
			for i := 0; i < maxRetryNumber; i++ {
				dbConnection, err = sqlx.Connect("postgres", appConfig.Database.GetDatabaseConnectionUri())
				if err == nil {
					break
				}
				retryDuration = time.Duration(i*2) * time.Second
				log.WithFields(log.Fields{"retryNumber": i, "retryDuration": retryDuration}).WithError(err).Error("issue connecting to database, retrying")
				if i != maxRetryNumber-1 {
					time.Sleep(retryDuration)
				}
			}
			if err != nil {
				return err
			}
			dbConnection.SetMaxOpenConns(25)
			dbConnection.SetMaxIdleConns(25)
			dbConnection.SetConnMaxLifetime(5 * time.Minute)
			defer dbConnection.Close()

			if viper.GetBool("migrate") {
				log.Info("running auto schema migrations")
				if err = runMigration(dbConnection); err != nil {
					return err
				}
			}

			ctx := context.Background()
			repository := db.NewRepository(dbConnection)
			user, err := repository.GetUserAccountByUsername(ctx, args[0])
			if err != nil {
				return err
			}

			token, err := repository.CreateAuthToken(ctx, db.CreateAuthTokenParams{
				UserID:    user.UserID,
				CreatedAt: time.Now(),
				ExpiresAt: time.Now().Add(time.Hour * 24 * 7),
			})

			if err != nil {
				return err
			}

			fmt.Printf("Created token: %s\n", token.TokenID.String())
			return nil
		},
	}

	cc.Flags().Bool("migrate", false, "if true, auto run's schema migrations before starting the web server")
	cc.Flags().IntVar(&teams, "teams", 5, "number of teams to generate")
	cc.Flags().IntVar(&projects, "projects", 10, "number of projects to create per team (personal projects are included)")
	cc.Flags().IntVar(&taskGroups, "task_groups", 5, "number of task groups to generate per project")
	cc.Flags().IntVar(&tasks, "tasks", 25, "number of tasks to generate per task group")

	viper.SetDefault("migrate", false)
	return cc
}
