package notification

import (
	"context"
	"time"

	"github.com/RichardKnop/machinery/v1"
	"github.com/RichardKnop/machinery/v1/tasks"

	"github.com/google/uuid"
	"github.com/jordanknott/taskcafe/internal/db"
	log "github.com/sirupsen/logrus"
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
	tid := uuid.MustParse(taskID)
	notifier := uuid.MustParse(notifierID)
	notified := uuid.MustParse(notifiedID)
	if notifier == notified {
		return true, nil
	}
	ctx := context.Background()
	now := time.Now().UTC()
	notificationObject, err := m.Repository.CreateNotificationObject(ctx, db.CreateNotificationObjectParams{EntityType: 1, EntityID: tid, ActionType: 1, ActorID: notifier, CreatedOn: now})
	if err != nil {
		return false, err
	}
	notification, err := m.Repository.CreateNotification(ctx, db.CreateNotificationParams{NotificationObjectID: notificationObject.NotificationObjectID, NotifierID: notified})
	if err != nil {
		return false, err
	}
	log.WithFields(log.Fields{"notificationID": notification.NotificationID}).Info("created new notification")
	return true, nil
}

type NotificationQueue struct {
	Server *machinery.Server
}

func (n *NotificationQueue) TaskMemberWasAdded(taskID, notifier, notified uuid.UUID) error {
	task := tasks.Signature{
		Name: "taskMemberWasAdded",
		Args: []tasks.Arg{
			{
				Name:  "taskID",
				Type:  "string",
				Value: taskID.String(),
			},
			{
				Name:  "notifierID",
				Type:  "string",
				Value: notifier.String(),
			},
			{
				Name:  "notifiedID",
				Type:  "string",
				Value: notified.String(),
			},
		},
	}

	_, err := n.Server.SendTask(&task)
	if err != nil {
		return err
	}
	return nil
}
