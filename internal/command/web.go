package command

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/jordanknott/taskcafe/internal/api"
	"github.com/jordanknott/taskcafe/internal/config"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

func newWebCmd() *cobra.Command{
  cc := &cobra.Command{
		Use:   "web",
		Short: "Run the web server",
		Long:  "Run the web & api server",
		RunE: func(cmd *cobra.Command, args []string) error {
			Formatter := new(logrus.TextFormatter)
			Formatter.TimestampFormat = "02-01-2006 15:04:05"
			Formatter.FullTimestamp = true
			logrus.SetFormatter(Formatter)
			logrus.SetLevel(logrus.InfoLevel)

			appConfig, err := config.GetAppConfig()
			if err != nil {
				return err
			}

			var db *sql.DB
			var retryDuration time.Duration
			maxRetryNumber := 4
			for i := 0; i < maxRetryNumber; i++ {
			db, err = sql.Open("postgres", appConfig.Database.GetDatabaseConnectionUri())
				if err == nil {
					break
				}
				retryDuration = time.Duration(i*2) * time.Second
				logrus.WithFields(logrus.Fields{"retryNumber": i, "retryDuration": retryDuration}).WithError(err).Error("issue connecting to database, retrying")
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
				logrus.Info("running auto schema migrations")
        /*
				if err = runMigration(db); err != nil {
					return err
				}
        */
			}

			r, _ := api.NewRouter(db)

			logrus.WithFields(logrus.Fields{"url": viper.GetString("server.hostname")}).Info("starting server")
			return http.ListenAndServe(viper.GetString("server.hostname"), r)
		},
	}

	cc.Flags().Bool("migrate", false, "if true, auto run's schema migrations before starting the web server")

	viper.BindPFlag("migrate", cc.Flags().Lookup("migrate"))
	viper.SetDefault("migrate", false)
	return cc
}
