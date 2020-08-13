package commands

import (
	"fmt"
	"net/http"
	"time"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/httpfs"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"github.com/jmoiron/sqlx"
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

			connection := fmt.Sprintf("user=%s password=%s host=%s dbname=%s sslmode=disable",
				viper.GetString("database.user"),
				viper.GetString("database.password"),
				viper.GetString("database.host"),
				viper.GetString("database.name"),
			)
			var db *sqlx.DB
			var err error
			retryNumber := 0
			for i := 0; retryNumber <= 3; i++ {
				retryNumber++
				db, err = sqlx.Connect("postgres", connection)
				if err == nil {
					break
				}
				retryDuration := time.Duration(i*2) * time.Second
				log.WithFields(log.Fields{"retryNumber": retryNumber, "retryDuration": retryDuration}).WithError(err).Error("issue connecting to database, retrying")
				time.Sleep(retryDuration)
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

			log.WithFields(log.Fields{"url": viper.GetString("server.hostname")}).Info("starting server")
			r, _ := route.NewRouter(db)
			http.ListenAndServe(viper.GetString("server.hostname"), r)
			return nil
		},
	}
	cc.Flags().Bool("migrate", false, "if true, auto run's schema migrations before starting the web server")
	viper.BindPFlag("migrate", cc.Flags().Lookup("migrate"))
	viper.SetDefault("migrate", false)
	viper.SetDefault("server.hostname", "0.0.0.0:3333")
	viper.SetDefault("database.host", "127.0.0.1")
	viper.SetDefault("database.name", "taskcafe")
	viper.SetDefault("database.user", "taskcafe")
	viper.SetDefault("database.password", "taskcafe_test")

	viper.SetDefault("queue.broker", "amqp://guest:guest@localhost:5672/")
	viper.SetDefault("queue.store", "memcache://localhost:11211")
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
