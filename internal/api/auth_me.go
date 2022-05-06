package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/jordanknott/taskcafe/internal/util"
	"github.com/sirupsen/logrus"
)

type AuthMeResponseData struct {
	UserID string `json:"userId`
}

func (api *TaskcafeApi) AuthMe(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	c, err := r.Cookie("Authorization")
	if err != nil {
		logrus.WithError(err).Error("error while getting cookie")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	token, err := api.Data.GetAccessToken(ctx, c.Value)
	if err != nil {
		logrus.WithError(err).Error("error while getting access cookie")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	userAccount, err := api.Data.GetUserAccountByID(ctx, token.UserID)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		logrus.WithError(err).Debug("error while getting user account by username")
		return
	}

	createdAt := time.Now().UTC()
	expiresAt := createdAt.AddDate(0, 0, 7)
	nextToken, err := util.GenerateAccessToken()
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		logrus.WithError(err).Error("error while creating new access token")
	}

	w.Header().Set("Content-type", "application/json")
	http.SetCookie(w, &http.Cookie{
		Name:     "accessToken",
		Value:    nextToken,
		Expires:  expiresAt,
		Path:     "/",
		HttpOnly: true,
	})
	json.NewEncoder(w).Encode(AuthLoginResponseData{UserID: userAccount.UserID.String()})
}
