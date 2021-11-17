package commands

import (
	"net/http"
	"time"

	"github.com/RichardKnop/machinery/v1"
	mTasks "github.com/RichardKnop/machinery/v1/tasks"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/httpfs"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"github.com/jmoiron/sqlx"
	"github.com/jordanknott/taskcafe/internal/config"
	"github.com/jordanknott/taskcafe/internal/route"
	log "github.com/sirupsen/logrus"
)

var autoMigrate bool

func newWebCmd() *cobra.Command {
	cc := &cobra.Command{
		Use:   "web",
		Short: "Run the web server",
		Long:  "Run the web & api server",
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

			redisClient, err := appConfig.MessageQueue.GetMessageQueueClient()
			if err != nil {
				return err
			}
			defer redisClient.Close()

			connection := appConfig.Database.GetDatabaseConnectionUri()
			var db *sqlx.DB
			var retryDuration time.Duration
			maxRetryNumber := 4
			for i := 0; i < maxRetryNumber; i++ {
				db, err = sqlx.Connect("postgres", connection)
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
			db.SetMaxOpenConns(25)
			db.SetMaxIdleConns(25)
			db.SetConnMaxLifetime(5 * time.Minute)
			defer db.Close()

			if viper.GetBool("migrate") {
				log.Info("running auto schema migrations")
				if err = runMigration(db); err != nil {
					return err
				}
			}

			var server *machinery.Server
			jobConfig := appConfig.Job.GetJobConfig()
			server, err = machinery.NewServer(&jobConfig)
			if err != nil {
				return err
			}
			signature := &mTasks.Signature{
				Name: "scheduleDueDateNotifications",
			}
			server.SendTask(signature)

			r, _ := route.NewRouter(db, redisClient, server, appConfig)
			log.WithFields(log.Fields{"url": viper.GetString("server.hostname")}).Info("starting server")
			return http.ListenAndServe(viper.GetString("server.hostname"), r)
		},
	}

	cc.Flags().Bool("migrate", false, "if true, auto run's schema migrations before starting the web server")

	viper.BindPFlag("migrate", cc.Flags().Lookup("migrate"))
	viper.SetDefault("migrate", false)
	return cc
}

func runMigration(db *sqlx.DB) error {
	driver, err := postgres.WithInstance(db.DB, &postgres.Config{})
	if err != nil {
		return err
	}

	src, err := httpfs.New(migration, "./")
	if err != nil {
		return err
	}
	m, err := migrate.NewWithInstance("httpfs", src, "postgres", driver)
	if err != nil {
		return err
	}
	logger := &MigrateLog{}
	m.Log = logger
	err = m.Up()
	if err != nil && err != migrate.ErrNoChange {
		return err
	}
	return nil
}
