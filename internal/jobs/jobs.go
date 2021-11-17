package jobs

import (
	"context"
	"encoding/json"
	"strconv"
	"time"

	"github.com/RichardKnop/machinery/v1"
	mTasks "github.com/RichardKnop/machinery/v1/tasks"
	"github.com/go-redis/redis/v8"
	"github.com/jinzhu/now"
	log "github.com/sirupsen/logrus"

	"github.com/google/uuid"
	"github.com/jordanknott/taskcafe/internal/config"
	"github.com/jordanknott/taskcafe/internal/db"
	"github.com/jordanknott/taskcafe/internal/utils"
)

type NotifiedData struct {
	Data map[string]string
}

func RegisterTasks(server *machinery.Server, repo db.Repository, appConfig config.AppConfig, messageQueue *redis.Client) {
	tasks := JobTasks{Repository: repo, Server: server, AppConfig: appConfig, MessageQueue: messageQueue}
	server.RegisterTasks(map[string]interface{}{
		"dueDateNotification":          tasks.DueDateNotification,
		"scheduleDueDateNotifications": tasks.ScheduleDueDateNotifications,
	})
}

type JobTasks struct {
	AppConfig    config.AppConfig
	Repository   db.Repository
	Server       *machinery.Server
	MessageQueue *redis.Client
}

func (t *JobTasks) ScheduleDueDateNotifications() (bool, error) {
	ctx := context.Background()
	// tomorrow := now.With(time.Now().UTC().AddDate(0, 0, 1))
	today := now.With(time.Now().UTC())
	start := today.BeginningOfDay()
	log.WithFields(log.Fields{
		"start": start,
	}).Info("fetching duration")
	reminders, err := t.Repository.GetDueDateRemindersForDuration(ctx, start)

	if err != nil {
		log.WithError(err).Error("error while getting due date reminder")
	}
	for _, rem := range reminders {
		log.WithField("id", rem.DueDateReminderID).Info("found reminder")
		signature := &mTasks.Signature{
			UUID: "due_date_reminder_" + rem.DueDateReminderID.String(),
			Name: "dueDateNotification",
			ETA:  &rem.RemindAt,
			Args: []mTasks.Arg{{
				Type:  "string",
				Value: rem.DueDateReminderID.String(),
			}, {
				Type:  "string",
				Value: rem.TaskID.String(),
			}},
		}
		log.WithField("nanoTime", signature.ETA.UnixNano()).Info("rem time")
		etaNano := strconv.FormatInt(signature.ETA.UnixNano(), 10)
		result, err := t.MessageQueue.ZRangeByScore(ctx, "delayed_tasks", &redis.ZRangeBy{Max: etaNano, Min: etaNano}).Result()
		if err != nil {
			log.WithError(err).Error("error while getting due date reminder")
		}
		log.WithField("result", result).Info("result raw")
		if len(result) == 0 {
			log.Info("task not found, sending task")
			t.Server.SendTask(signature)
		}
	}
	return true, nil
}

func (t *JobTasks) DueDateNotification(dueDateIDEncoded string, taskIDEncoded string) (bool, error) {
	ctx := context.Background()
	dueDateID, err := uuid.Parse(dueDateIDEncoded)
	if err != nil {
		log.WithError(err).Error("while parsing task ID")
		return false, err
	}
	taskID, err := uuid.Parse(taskIDEncoded)
	if err != nil {
		log.WithError(err).Error("while parsing task ID")
		return false, err
	}
	dueAt, err := t.Repository.GetDueDateReminderByID(ctx, dueDateID)
	if err != nil {
		log.WithError(err).Error("while getting task by id")
		return false, err
	}
	task, err := t.Repository.GetTaskByID(ctx, taskID)
	if err != nil {
		log.WithError(err).Error("while getting task by id")
		return false, err
	}
	projectInfo, err := t.Repository.GetProjectInfoForTask(ctx, taskID)
	if err != nil {
		log.WithError(err).Error("error while getting project info for task")
		return false, err
	}
	data := map[string]string{
		"TaskID":      task.ShortID,
		"TaskName":    task.Name,
		"ProjectID":   projectInfo.ProjectShortID,
		"ProjectName": projectInfo.Name,
		"DueAt":       dueAt.RemindAt.String(),
	}

	now := time.Now().UTC()
	raw, err := json.Marshal(NotifiedData{Data: data})
	if err != nil {
		log.WithError(err).Error("error while marshal json data for notification")
		return false, err
	}
	n, err := t.Repository.CreateNotification(ctx, db.CreateNotificationParams{
		CausedBy:   uuid.UUID{},
		ActionType: "DUE_DATE_REMINDER",
		CreatedOn:  now,
		Data:       json.RawMessage(raw),
	})
	if err != nil {
		log.WithError(err).Error("error while creating notification")
		return false, err
	}
	watchers, err := t.Repository.GetTaskWatchersForTask(ctx, taskID)
	if err != nil {
		log.WithError(err).Error("while getting watchers")
		return false, err
	}

	for _, watcher := range watchers {
		notified, err := t.Repository.CreateNotificationNotifed(ctx, db.CreateNotificationNotifedParams{
			UserID:         watcher.UserID,
			NotificationID: n.NotificationID,
		})
		if err != nil {
			log.WithError(err).Error("error while creating notification notified object")
			return false, err
		}
		payload, err := json.Marshal(utils.NotificationCreatedMessage{
			NotifiedID:     notified.NotifiedID.String(),
			NotificationID: n.NotificationID.String(),
		})
		if err != nil {
			panic(err)
		}

		if err := t.MessageQueue.Publish(context.Background(), "notification-created", payload).Err(); err != nil {
			panic(err)
		}
	}

	return true, nil
}

type JobQueue struct {
	AppConfig  config.AppConfig
	Repository db.Repository
	Server     *machinery.Server
}

func (q *JobQueue) DueDateNotification(notificationId uuid.UUID) error {
	return nil
}
