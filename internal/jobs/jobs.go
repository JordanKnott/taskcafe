package jobs

import (
	"github.com/RichardKnop/machinery/v1"

	"github.com/google/uuid"
	"github.com/jordanknott/taskcafe/internal/config"
	"github.com/jordanknott/taskcafe/internal/db"
)

func RegisterTasks(server *machinery.Server, repo db.Repository) {
	tasks := JobTasks{repo}
	server.RegisterTasks(map[string]interface{}{
		"taskMemberWasAdded": tasks.TaskMemberWasAdded,
	})
}

type JobTasks struct {
	Repository db.Repository
}

func (t *JobTasks) TaskMemberWasAdded(taskID, notifierID, notifiedID string) (bool, error) {
	return true, nil
}

type JobQueue struct {
	AppConfig config.AppConfig
	Server    *machinery.Server
}

func (q *JobQueue) TaskMemberWasAdded(taskID, notifier, notified uuid.UUID) error {
	return nil
}
