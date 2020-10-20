package commands

import (
	"fmt"
	"time"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"github.com/RichardKnop/machinery/v1"
	"github.com/RichardKnop/machinery/v1/config"
	queueLog "github.com/RichardKnop/machinery/v1/log"
	"github.com/jmoiron/sqlx"
	repo "github.com/jordanknott/taskcafe/internal/db"
	"github.com/jordanknott/taskcafe/internal/notification"
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

			connection := fmt.Sprintf("user=%s password=%s host=%s dbname=%s sslmode=disable",
				viper.GetString("database.user"),
				viper.GetString("database.password"),
				viper.GetString("database.host"),
				viper.GetString("database.name"),
			)
			db, err := sqlx.Connect("postgres", connection)
			if err != nil {
				log.Panic(err)
			}
			db.SetMaxOpenConns(25)
			db.SetMaxIdleConns(25)
			db.SetConnMaxLifetime(5 * time.Minute)
			defer db.Close()

			var cnf = &config.Config{
				Broker:        viper.GetString("queue.broker"),
				DefaultQueue:  "machinery_tasks",
				ResultBackend: viper.GetString("queue.store"),
				AMQP: &config.AMQPConfig{
					Exchange:     "machinery_exchange",
					ExchangeType: "direct",
					BindingKey:   "machinery_task",
				},
			}

			log.Info("starting task queue server instance")
			server, err := machinery.NewServer(cnf)
			if err != nil {
				// do something with the error
			}
			queueLog.Set(&notification.MachineryLogger{})
			repo := *repo.NewRepository(db)
			notification.RegisterTasks(server, repo)

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
