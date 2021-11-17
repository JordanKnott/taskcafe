package commands

import (
	"time"

	"github.com/spf13/cobra"

	"github.com/RichardKnop/machinery/v1"
	mTasks "github.com/RichardKnop/machinery/v1/tasks"

	queueLog "github.com/RichardKnop/machinery/v1/log"
	"github.com/jmoiron/sqlx"
	"github.com/jordanknott/taskcafe/internal/config"
	"github.com/jordanknott/taskcafe/internal/jobs"
	log "github.com/sirupsen/logrus"
)

func newJobCmd() *cobra.Command {
	cc := &cobra.Command{
		Use:   "job",
		Short: "Run a task manually",
		Long:  "Run a task manually",
		RunE: func(cmd *cobra.Command, args []string) error {
			Formatter := new(log.TextFormatter)
			Formatter.TimestampFormat = "02-01-2006 15:04:05"
			Formatter.FullTimestamp = true
			log.SetFormatter(Formatter)
			log.SetLevel(log.InfoLevel)

			appConfig, err := config.GetAppConfig()
			if err != nil {
				log.Panic(err)
			}
			db, err := sqlx.Connect("postgres", config.GetDatabaseConfig().GetDatabaseConnectionUri())
			if err != nil {
				log.Panic(err)
			}
			db.SetMaxOpenConns(25)
			db.SetMaxIdleConns(25)
			db.SetConnMaxLifetime(5 * time.Minute)
			defer db.Close()

			log.Info("starting task queue server instance")
			jobConfig := appConfig.Job.GetJobConfig()
			server, err := machinery.NewServer(&jobConfig)
			if err != nil {
				// do something with the error
			}
			queueLog.Set(&jobs.MachineryLogger{})

			signature := &mTasks.Signature{
				Name: "scheduleDueDateNotifications",
			}
			server.SendTask(signature)

			return nil
		},
	}
	return cc
}
