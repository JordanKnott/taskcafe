package commands

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/httpfs"
	"github.com/google/uuid"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"github.com/jmoiron/sqlx"
	"github.com/jordanknott/taskcafe/internal/route"
	"github.com/jordanknott/taskcafe/internal/utils"
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

			connection := fmt.Sprintf("user=%s password=%s host=%s dbname=%s port=%s sslmode=disable",
				viper.GetString("database.user"),
				viper.GetString("database.password"),
				viper.GetString("database.host"),
				viper.GetString("database.name"),
				viper.GetString("database.port"),
			)
			var db *sqlx.DB
			var err error
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

			log.WithFields(log.Fields{"url": viper.GetString("server.hostname")}).Info("starting server")
			secret := viper.GetString("server.secret")
			if strings.TrimSpace(secret) == "" {
				log.Warn("server.secret is not set, generating a random secret")
				secret = uuid.New().String()
			}
			r, _ := route.NewRouter(db, utils.EmailConfig{
				From:               viper.GetString("smtp.from"),
				Host:               viper.GetString("smtp.host"),
				Port:               viper.GetInt("smtp.port"),
				Username:           viper.GetString("smtp.username"),
				Password:           viper.GetString("smtp.password"),
				InsecureSkipVerify: viper.GetBool("smtp.skip_verify"),
			}, []byte(secret))
			return http.ListenAndServe(viper.GetString("server.hostname"), r)
		},
	}

	viper.SetDefault("smtp.from", "no-reply@example.com")
	viper.SetDefault("smtp.host", "localhost")
	viper.SetDefault("smtp.port", 587)
	viper.SetDefault("smtp.username", "")
	viper.SetDefault("smtp.password", "")
	viper.SetDefault("smtp.skip_verify", false)

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
