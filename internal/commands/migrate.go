package commands

import (
	"fmt"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/httpfs"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

// MigrateLog is a logger for go migrate
type MigrateLog struct {
	verbose bool
}

// Printf logs to logrus
func (l *MigrateLog) Printf(format string, v ...interface{}) {
	log.Printf("%s", v)
}

// Verbose shows if verbose print enabled
func (l *MigrateLog) Verbose() bool {
	return l.verbose
}

func newMigrateCmd() *cobra.Command {
	c := &cobra.Command{
		Use:   "migrate",
		Short: "Run the database schema migrations",
		Long:  "Run the database schema migrations",
		RunE: func(cmd *cobra.Command, args []string) error {
			connection := fmt.Sprintf("user=%s password=%s host=%s dbname=%s port=%s sslmode=disable",
				viper.GetString("database.user"),
				viper.GetString("database.password"),
				viper.GetString("database.host"),
				viper.GetString("database.name"),
				viper.GetString("database.port"),
			)
			db, err := sqlx.Connect("postgres", connection)
			if err != nil {
				return err
			}
			defer db.Close()

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
		},
	}
	return c
}
