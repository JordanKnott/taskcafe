package notification

import (
	"github.com/RichardKnop/machinery/v1"

	"github.com/google/uuid"
	"github.com/jordanknott/taskcafe/internal/db"
)

func RegisterTasks(server *machinery.Server, repo db.Repository) {
	tasks := NotificationTasks{repo}
	server.RegisterTasks(map[string]interface{}{
		"taskMemberWasAdded": tasks.TaskMemberWasAdded,
	})
}

type NotificationTasks struct {
	Repository db.Repository
}

func (m *NotificationTasks) TaskMemberWasAdded(taskID, notifierID, notifiedID string) (bool, error) {
	return true, nil
}

type NotificationQueue struct {
	Server *machinery.Server
}

func (n *NotificationQueue) TaskMemberWasAdded(taskID, notifier, notified uuid.UUID) error {
	return nil
}
