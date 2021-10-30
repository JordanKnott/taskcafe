package commands

import (
	"time"

	"github.com/spf13/cobra"

	"github.com/RichardKnop/machinery/v1"
	queueLog "github.com/RichardKnop/machinery/v1/log"
	"github.com/jmoiron/sqlx"
	"github.com/jordanknott/taskcafe/internal/config"
	repo "github.com/jordanknott/taskcafe/internal/db"
	"github.com/jordanknott/taskcafe/internal/jobs"
	log "github.com/sirupsen/logrus"
)

func newWorkerCmd() *cobra.Command {
	cc := &cobra.Command{
		Use:   "worker",
		Short: "Run the task queue worker",
		Long:  "Run the task queue worker",
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
			repo := *repo.NewRepository(db)
			jobs.RegisterTasks(server, repo)

			worker := server.NewWorker("taskcafe_worker", 10)
			log.Info("starting task queue worker")
			err = worker.Launch()
			if err != nil {
				log.WithError(err).Error("error while launching ")
				return err
			}
			return nil
		},
	}
	return cc
}
