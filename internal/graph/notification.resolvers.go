package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jordanknott/taskcafe/internal/db"
	"github.com/jordanknott/taskcafe/internal/logger"
	"github.com/jordanknott/taskcafe/internal/utils"
	log "github.com/sirupsen/logrus"
)

func (r *mutationResolver) NotificationToggleRead(ctx context.Context, input NotificationToggleReadInput) (*Notified, error) {
	userID, ok := GetUserID(ctx)
	if !ok {
		return &Notified{}, errors.New("unknown user ID")
	}
	notified, err := r.Repository.GetNotifiedByID(ctx, input.NotifiedID)
	if err != nil {
		log.WithError(err).Error("error while getting notified by ID")
		return &Notified{}, err
	}
	readAt := time.Now().UTC()
	read := true
	if notified.Read {
		read = false
		err = r.Repository.MarkNotificationAsRead(ctx, db.MarkNotificationAsReadParams{
			UserID:     userID,
			NotifiedID: input.NotifiedID,
			Read:       false,
			ReadAt: sql.NullTime{
				Valid: false,
				Time:  time.Time{},
			},
		})
	} else {
		err = r.Repository.MarkNotificationAsRead(ctx, db.MarkNotificationAsReadParams{
			UserID:     userID,
			Read:       true,
			NotifiedID: input.NotifiedID,
			ReadAt: sql.NullTime{
				Valid: true,
				Time:  readAt,
			},
		})
	}
	if err != nil {
		log.WithError(err).Error("error while marking notification as read")
		return &Notified{}, err
	}

	return &Notified{
		ID:     notified.NotifiedID,
		Read:   read,
		ReadAt: &readAt,
		Notification: &db.Notification{
			NotificationID: notified.NotificationID,
			CausedBy:       notified.CausedBy,
			ActionType:     notified.ActionType,
			Data:           notified.Data,
			CreatedOn:      notified.CreatedOn,
		},
	}, nil
}

func (r *mutationResolver) NotificationMarkAllRead(ctx context.Context) (*NotificationMarkAllAsReadResult, error) {
	userID, ok := GetUserID(ctx)
	if !ok {
		return &NotificationMarkAllAsReadResult{}, errors.New("invalid user ID")
	}
	now := time.Now().UTC()
	err := r.Repository.MarkAllNotificationsRead(ctx, db.MarkAllNotificationsReadParams{UserID: userID, ReadAt: sql.NullTime{Valid: true, Time: now}})
	if err != nil {
		return &NotificationMarkAllAsReadResult{}, err
	}
	return &NotificationMarkAllAsReadResult{Success: false}, nil
}

func (r *notificationResolver) ID(ctx context.Context, obj *db.Notification) (uuid.UUID, error) {
	return obj.NotificationID, nil
}

func (r *notificationResolver) ActionType(ctx context.Context, obj *db.Notification) (ActionType, error) {
	actionType := ActionType(obj.ActionType)
	if !actionType.IsValid() {
		log.WithField("ActionType", obj.ActionType).Error("ActionType is invalid")
		return actionType, errors.New("ActionType is invalid")
	}
	return ActionType(obj.ActionType), nil // TODO
}

func (r *notificationResolver) CausedBy(ctx context.Context, obj *db.Notification) (*NotificationCausedBy, error) {
	user, err := r.Repository.GetUserAccountByID(ctx, obj.CausedBy)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
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
	notifiedData := NotifiedData{}
	err := json.Unmarshal(obj.Data, &notifiedData)
	if err != nil {
		return []NotificationData{}, err
	}
	data := []NotificationData{}
	for key, value := range notifiedData.Data {
		data = append(data, NotificationData{Key: key, Value: value})
	}
	return data, nil
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

func (r *queryResolver) Notified(ctx context.Context, input NotifiedInput) (*NotifiedResult, error) {
	userID, ok := GetUserID(ctx)
	if !ok {
		return &NotifiedResult{}, errors.New("userID is not found")
	}
	log.WithField("userID", userID).Info("fetching notified")
	if input.Cursor != nil {
		t, id, err := utils.DecodeCursor(*input.Cursor)
		if err != nil {
			log.WithError(err).Error("error decoding cursor")
			return &NotifiedResult{}, err
		}
		enableRead := false
		enableActionType := false
		actionTypes := []string{}
		switch input.Filter {
		case NotificationFilterUnread:
			enableRead = true
			break
		case NotificationFilterMentioned:
			enableActionType = true
			actionTypes = []string{"COMMENT_MENTIONED"}
			break
		case NotificationFilterAssigned:
			enableActionType = true
			actionTypes = []string{"TASK_ASSIGNED"}
			break
		}
		n, err := r.Repository.GetNotificationsForUserIDCursor(ctx, db.GetNotificationsForUserIDCursorParams{
			CreatedOn:        t,
			NotificationID:   id,
			LimitRows:        int32(input.Limit + 1),
			UserID:           userID,
			EnableUnread:     enableRead,
			EnableActionType: enableActionType,
			ActionType:       actionTypes,
		})
		if err != nil {
			log.WithError(err).Error("error decoding fetching notifications")
			return &NotifiedResult{}, err
		}
		hasNextPage := false
		log.WithFields(log.Fields{
			"nLen":       len(n),
			"cursorTime": t,
			"cursorId":   id,
			"limit":      input.Limit,
		}).Info("fetched notified")
		var endCursor *db.GetNotificationsForUserIDCursorRow
		if len(n) != 0 {
			endCursor = &n[len(n)-1]
			if len(n) == input.Limit+1 {
				hasNextPage = true
				n = n[:len(n)-1]
				endCursor = &n[len(n)-1]
			}
		}
		userNotifications := []Notified{}
		for _, notified := range n {
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
		var endCursorEncoded *string
		if endCursor != nil {
			eCur := utils.EncodeCursor(endCursor.CreatedOn, endCursor.NotificationID)
			endCursorEncoded = &eCur
		}
		pageInfo := &PageInfo{
			HasNextPage: hasNextPage,
			EndCursor:   endCursorEncoded,
		}
		log.WithField("pageInfo", pageInfo).Info("created page info")
		return &NotifiedResult{
			TotalCount: len(n) - 1,
			PageInfo:   pageInfo,
			Notified:   userNotifications,
		}, nil
	}
	enableRead := false
	enableActionType := false
	actionTypes := []string{}
	switch input.Filter {
	case NotificationFilterUnread:
		enableRead = true
		break
	case NotificationFilterMentioned:
		enableActionType = true
		actionTypes = []string{"COMMENT_MENTIONED"}
		break
	case NotificationFilterAssigned:
		enableActionType = true
		actionTypes = []string{"TASK_ASSIGNED"}
		break
	}
	n, err := r.Repository.GetNotificationsForUserIDPaged(ctx, db.GetNotificationsForUserIDPagedParams{
		LimitRows:        int32(input.Limit + 1),
		EnableUnread:     enableRead,
		EnableActionType: enableActionType,
		ActionType:       actionTypes,
		UserID:           userID,
	})
	if err != nil {
		log.WithError(err).Error("error decoding fetching notifications")
		return &NotifiedResult{}, err
	}
	hasNextPage := false
	log.WithFields(log.Fields{
		"nLen":  len(n),
		"limit": input.Limit,
	}).Info("fetched notified")
	var endCursor *db.GetNotificationsForUserIDPagedRow
	if len(n) != 0 {
		endCursor = &n[len(n)-1]
		if len(n) == input.Limit+1 {
			hasNextPage = true
			n = n[:len(n)-1]
			endCursor = &n[len(n)-1]
		}
	}
	userNotifications := []Notified{}
	for _, notified := range n {
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
	var endCursorEncoded *string
	if endCursor != nil {
		eCur := utils.EncodeCursor(endCursor.CreatedOn, endCursor.NotificationID)
		endCursorEncoded = &eCur
	}
	pageInfo := &PageInfo{
		HasNextPage: hasNextPage,
		EndCursor:   endCursorEncoded,
	}
	log.WithField("pageInfo", pageInfo).Info("created page info")
	return &NotifiedResult{
		TotalCount: len(n),
		PageInfo:   pageInfo,
		Notified:   userNotifications,
	}, nil
}

func (r *queryResolver) HasUnreadNotifications(ctx context.Context) (*HasUnreadNotificationsResult, error) {
	userID, ok := GetUserID(ctx)
	if !ok {
		return &HasUnreadNotificationsResult{}, errors.New("userID is missing")
	}
	unread, err := r.Repository.HasUnreadNotification(ctx, userID)
	if err != nil {
		log.WithError(err).Error("error while fetching unread notifications")
		return &HasUnreadNotificationsResult{}, err
	}
	return &HasUnreadNotificationsResult{
		Unread: unread,
	}, nil
}

func (r *subscriptionResolver) NotificationAdded(ctx context.Context) (<-chan *Notified, error) {
	notified := make(chan *Notified, 1)

	userID, ok := GetUserID(ctx)
	if !ok {
		return notified, errors.New("userID is not found")
	}

	id := uuid.New().String()
	go func() {
		<-ctx.Done()
		r.Notifications.Mu.Lock()
		if _, ok := r.Notifications.Subscribers[userID.String()]; ok {
			delete(r.Notifications.Subscribers[userID.String()], id)
		}
		r.Notifications.Mu.Unlock()
	}()

	r.Notifications.Mu.Lock()
	if _, ok := r.Notifications.Subscribers[userID.String()]; !ok {
		r.Notifications.Subscribers[userID.String()] = make(map[string]chan *Notified)
	}
	log.WithField("userID", userID).WithField("id", id).Info("adding new channel")
	r.Notifications.Subscribers[userID.String()][id] = notified
	r.Notifications.Mu.Unlock()
	return notified, nil
}

// Notification returns NotificationResolver implementation.
func (r *Resolver) Notification() NotificationResolver { return &notificationResolver{r} }

type notificationResolver struct{ *Resolver }
