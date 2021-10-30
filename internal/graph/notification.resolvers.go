package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"database/sql"
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

func (r *notificationResolver) ActionType(ctx context.Context, obj *db.Notification) (ActionType, error) {
	return ActionTypeTaskMemberAdded, nil // TODO
}

func (r *notificationResolver) CausedBy(ctx context.Context, obj *db.Notification) (*NotificationCausedBy, error) {
	user, err := r.Repository.GetUserAccountByID(ctx, obj.CausedBy)
	if err != nil {
		if err == sql.ErrNoRows {
			return &NotificationCausedBy{
				Fullname: "Unknown user",
				Username: "unknown",
				ID:       obj.CausedBy,
			}, nil
		}
		log.WithError(err).Error("error while resolving Notification.CausedBy")
		return &NotificationCausedBy{}, err
	}
	return &NotificationCausedBy{
		Fullname: user.FullName,
		Username: user.Username,
		ID:       obj.CausedBy,
	}, nil
}

func (r *notificationResolver) Data(ctx context.Context, obj *db.Notification) ([]NotificationData, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *notificationResolver) CreatedAt(ctx context.Context, obj *db.Notification) (*time.Time, error) {
	return &obj.CreatedOn, nil
}

func (r *queryResolver) Notifications(ctx context.Context) ([]Notified, error) {
	userID, ok := GetUserID(ctx)
	logger.New(ctx).Info("fetching notifications")
	if !ok {
		return []Notified{}, nil
	}
	notifications, err := r.Repository.GetAllNotificationsForUserID(ctx, userID)
	if err == sql.ErrNoRows {
		return []Notified{}, nil
	} else if err != nil {
		return []Notified{}, err
	}
	userNotifications := []Notified{}
	for _, notified := range notifications {
		var readAt *time.Time
		if notified.ReadAt.Valid {
			readAt = &notified.ReadAt.Time
		}
		n := Notified{
			ID:     notified.NotifiedID,
			Read:   notified.Read,
			ReadAt: readAt,
			Notification: &db.Notification{
				NotificationID: notified.NotificationID,
				CausedBy:       notified.CausedBy,
				ActionType:     notified.ActionType,
				Data:           notified.Data,
				CreatedOn:      notified.CreatedOn,
			},
		}
		userNotifications = append(userNotifications, n)
	}
	return userNotifications, nil
}

func (r *subscriptionResolver) NotificationAdded(ctx context.Context) (<-chan *Notified, error) {
	panic(fmt.Errorf("not implemented"))
}

// Notification returns NotificationResolver implementation.
func (r *Resolver) Notification() NotificationResolver { return &notificationResolver{r} }

type notificationResolver struct{ *Resolver }
