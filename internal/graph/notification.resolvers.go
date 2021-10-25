package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jordanknott/taskcafe/internal/db"
	"github.com/jordanknott/taskcafe/internal/logger"
	log "github.com/sirupsen/logrus"
)

func (r *notificationResolver) ID(ctx context.Context, obj *db.Notification) (uuid.UUID, error) {
	return obj.NotificationID, nil
}

func (r *notificationResolver) Entity(ctx context.Context, obj *db.Notification) (*NotificationEntity, error) {
	logger.New(ctx).WithFields(log.Fields{"notificationID": obj.NotificationID}).Info("fetching entity for notification")
	entity, err := r.Repository.GetEntityForNotificationID(ctx, obj.NotificationID)
	logger.New(ctx).WithFields(log.Fields{"entityID": entity.EntityID}).Info("fetched entity")
	if err != nil {
		return &NotificationEntity{}, err
	}
	entityType := GetEntityType(entity.EntityType)
	switch entityType {
	case EntityTypeTask:
		task, err := r.Repository.GetTaskByID(ctx, entity.EntityID)
		if err != nil {
			return &NotificationEntity{}, err
		}
		return &NotificationEntity{Type: entityType, ID: entity.EntityID, Name: task.Name}, err

	default:
		panic(fmt.Errorf("not implemented"))
	}
}

func (r *notificationResolver) ActionType(ctx context.Context, obj *db.Notification) (ActionType, error) {
	entity, err := r.Repository.GetEntityForNotificationID(ctx, obj.NotificationID)
	if err != nil {
		return ActionTypeTaskMemberAdded, err
	}
	actionType := GetActionType(entity.ActionType)
	return actionType, nil
}

func (r *notificationResolver) Actor(ctx context.Context, obj *db.Notification) (*NotificationActor, error) {
	entity, err := r.Repository.GetEntityForNotificationID(ctx, obj.NotificationID)
	if err != nil {
		return &NotificationActor{}, err
	}
	logger.New(ctx).WithFields(log.Fields{"entityID": entity.ActorID}).Info("fetching actor")
	user, err := r.Repository.GetUserAccountByID(ctx, entity.ActorID)
	if err != nil {
		return &NotificationActor{}, err
	}
	return &NotificationActor{ID: entity.ActorID, Name: user.FullName, Type: ActorTypeUser}, nil
}

func (r *notificationResolver) CreatedAt(ctx context.Context, obj *db.Notification) (*time.Time, error) {
	entity, err := r.Repository.GetEntityForNotificationID(ctx, obj.NotificationID)
	if err != nil {
		return &time.Time{}, err
	}
	return &entity.CreatedOn, nil
}

func (r *queryResolver) Notifications(ctx context.Context) ([]db.Notification, error) {
	userID, ok := GetUserID(ctx)
	logger.New(ctx).Info("fetching notifications")
	if !ok {
		return []db.Notification{}, errors.New("user id is missing")
	}
	notifications, err := r.Repository.GetAllNotificationsForUserID(ctx, userID)
	if err == sql.ErrNoRows {
		return []db.Notification{}, nil
	} else if err != nil {
		return []db.Notification{}, err
	}
	return notifications, nil
}

// Notification returns NotificationResolver implementation.
func (r *Resolver) Notification() NotificationResolver { return &notificationResolver{r} }

type notificationResolver struct{ *Resolver }
