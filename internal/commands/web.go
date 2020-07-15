package commands

import (
	"fmt"
	"github.com/spf13/cobra"
	"net/http"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/jordanknott/project-citadel/api/internal/config"
	"github.com/jordanknott/project-citadel/api/internal/route"
	log "github.com/sirupsen/logrus"
)

func newWebCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "web",
		Short: "Run the web server",
		Long:  "Run the web & api server",
		Run: func(cmd *cobra.Command, args []string) {
			appConfig, err := config.LoadConfig("conf/app.toml")
			if err != nil {
				log.WithError(err).Error("loading config")
			}
			Formatter := new(log.TextFormatter)
			Formatter.TimestampFormat = "02-01-2006 15:04:05"
			Formatter.FullTimestamp = true
			log.SetFormatter(Formatter)
			log.SetLevel(log.InfoLevel)

			connection := fmt.Sprintf("user=%s password=%s host=%s dbname=%s sslmode=disable",
				appConfig.Database.User,
				appConfig.Database.Password,
				appConfig.Database.Host,
				appConfig.Database.Name,
			)
			db, err := sqlx.Connect("postgres", connection)

			if err != nil {
				log.Panic(err)
			}
			db.SetMaxOpenConns(25)
			db.SetMaxIdleConns(25)
			db.SetConnMaxLifetime(5 * time.Minute)

			defer db.Close()
			log.WithFields(log.Fields{"url": appConfig.General.Host}).Info("starting server")
			r, _ := route.NewRouter(appConfig, db)
			http.ListenAndServe(appConfig.General.Host, r)
		},
	}
}
