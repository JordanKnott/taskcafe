package graph

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/jordanknott/taskcafe/internal/db"
	log "github.com/sirupsen/logrus"
)

// GetOwnedList todo: remove this
func GetOwnedList(ctx context.Context, r db.Repository, user db.UserAccount) (*OwnedList, error) {
	return &OwnedList{}, nil
}

type CreateNotificationParams struct {
	NotifiedList []uuid.UUID
	ActionType   ActionType
	CausedBy     uuid.UUID
	Data         map[string]string
}

func (r *Resolver) CreateNotification(ctx context.Context, data CreateNotificationParams) error {
	now := time.Now().UTC()
	raw, err := json.Marshal(NotifiedData{Data: data.Data})
	if err != nil {
		log.WithError(err).Error("error while marshal json data for notification")
		return err
	}
	log.WithField("ActionType", data.ActionType).Info("creating notification object")
	n, err := r.Repository.CreateNotification(ctx, db.CreateNotificationParams{
		CausedBy:   data.CausedBy,
		ActionType: data.ActionType.String(),
		CreatedOn:  now,
		Data:       json.RawMessage(raw),
	})
	if err != nil {
		log.WithError(err).Error("error while creating notification")
		return err
	}
	for _, nn := range data.NotifiedList {
		log.WithFields(log.Fields{"UserID": nn, "NotificationID": n.NotificationID}).Info("creating notification notified object")
		notified, err := r.Repository.CreateNotificationNotifed(ctx, db.CreateNotificationNotifedParams{
			UserID:         nn,
			NotificationID: n.NotificationID,
		})
		if err != nil {
			log.WithError(err).Error("error while creating notification notified object")
			return err
		}
		for ouid, observers := range r.Notifications.Subscribers {
			log.WithField("ouid", ouid).Info("checking user subscribers")
			for oid, ochan := range observers {
				log.WithField("ouid", ouid).WithField("oid", oid).Info("checking user subscriber")
				ochan <- &Notified{
					ID:           notified.NotifiedID,
					Read:         notified.Read,
					ReadAt:       &notified.ReadAt.Time,
					Notification: &n,
				}
			}
		}
	}
	return nil
}

// GetMemberList returns a list of projects the user is a member of
func GetMemberList(ctx context.Context, r db.Repository, user db.UserAccount) (*MemberList, error) {
	projectMemberIDs, err := r.GetMemberProjectIDsForUserID(ctx, user.UserID)
	if err != sql.ErrNoRows && err != nil {
		return &MemberList{}, err
	}
	var projects []db.Project
	for _, projectID := range projectMemberIDs {
		project, err := r.GetProjectByID(ctx, projectID)
		if err != nil {
			return &MemberList{}, err
		}
		projects = append(projects, project)
	}
	teamMemberIDs, err := r.GetMemberTeamIDsForUserID(ctx, user.UserID)
	if err != sql.ErrNoRows && err != nil {
		return &MemberList{}, err
	}
	var teams []db.Team
	for _, teamID := range teamMemberIDs {
		team, err := r.GetTeamByID(ctx, teamID)
		if err != nil {
			return &MemberList{}, err
		}
		teams = append(teams, team)
	}

	return &MemberList{Teams: teams, Projects: projects}, nil
}

type ActivityData struct {
	Data map[string]string
}

type NotifiedData struct {
	Data map[string]string
}
