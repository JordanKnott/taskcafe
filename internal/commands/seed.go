package commands

import (
	"context"
	"fmt"
	"time"

	"github.com/brianvoe/gofakeit/v5"
	"github.com/manifoldco/promptui"

	"github.com/jordanknott/taskcafe/internal/db"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

var (
	teams      int
	projects   int
	taskGroups int
	tasks      int
)

func newSeedCmd() *cobra.Command {
	cc := &cobra.Command{
		Use:   "seed",
		Short: "Seeds the database with random data for testing",
		Long:  "Seeds the database with random data for testing. CAN NOT BE UNDONE.",
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
			var dbConnection *sqlx.DB
			var err error
			var retryDuration time.Duration
			maxRetryNumber := 4
			for i := 0; i < maxRetryNumber; i++ {
				dbConnection, err = sqlx.Connect("postgres", connection)
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

			prompt := promptui.Prompt{
				Label:     "Seed database",
				IsConfirm: true,
			}

			_, err = prompt.Run()

			if err != nil {
				return err
			}

			ctx := context.Background()
			repository := db.NewRepository(dbConnection)
			now := time.Now().UTC()
			organizations, err := repository.GetAllOrganizations(ctx)
			organizationId := organizations[0].OrganizationID
			for teamIdx := 0; teamIdx <= teams; teamIdx++ {
				teamName := gofakeit.Company()
				team, err := repository.CreateTeam(ctx, db.CreateTeamParams{
					Name:           teamName,
					CreatedAt:      now,
					OrganizationID: organizationId,
				})
				if err != nil {
					return err
				}

				for projectIdx := 0; projectIdx <= projects; projectIdx++ {
					projectName := gofakeit.Dessert()
					project, err := repository.CreateTeamProject(ctx, db.CreateTeamProjectParams{
						TeamID:    team.TeamID,
						Name:      projectName,
						CreatedAt: now,
					})
					if err != nil {
						return err
					}
					for taskGroupIdx := 0; taskGroupIdx <= taskGroups; taskGroupIdx++ {
						taskGroupName := gofakeit.LoremIpsumSentence(8)
						taskGroup, err := repository.CreateTaskGroup(ctx, db.CreateTaskGroupParams{
							Name:      taskGroupName,
							ProjectID: project.ProjectID,
							CreatedAt: now,
							Position:  float64(65535 * (taskGroupIdx + 1)),
						})
						if err != nil {
							return err
						}
						for taskIdx := 0; taskIdx <= tasks; taskIdx++ {
							taskName := gofakeit.Sentence(8)
							task, err := repository.CreateTask(ctx, db.CreateTaskParams{
								Name:        taskName,
								TaskGroupID: taskGroup.TaskGroupID,
								CreatedAt:   now,
								Position:    float64(65535 * (taskIdx + 1)),
							})
							if err != nil {
								return err
							}
							fmt.Printf("Creating %d / %d / %d / %d - %d\n", teamIdx, projectIdx, taskGroupIdx, taskIdx, task.TaskID)
						}
					}
				}
			}

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
