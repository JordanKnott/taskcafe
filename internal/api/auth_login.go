package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/jordanknott/taskcafe/internal/util"
	"github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
)

type AuthLoginRequestData struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type AuthLoginResponseData struct {
	UserID string `json:"userId`
}

func (api *TaskcafeApi) AuthLogin(w http.ResponseWriter, r *http.Request) {
	var request AuthLoginRequestData
	ctx := r.Context()
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		logrus.WithError(err).Warn("bad request body")
		return
	}

	userAccount, err := api.Data.GetUserAccountByUsername(ctx, request.Username)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		logrus.WithError(err).Debug("error while getting user account by username")
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(userAccount.PasswordHash), []byte(request.Password))
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		logrus.WithError(err).Debug("error while hashing and comparing passwords")
	}

	createdAt := time.Now().UTC()
	expiresAt := createdAt.AddDate(0, 0, 7)
	token, err := util.GenerateAccessToken()
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		logrus.WithError(err).Error("error while creating new access token")
	}

	w.Header().Set("Content-type", "application/json")
	http.SetCookie(w, &http.Cookie{
		Name:     "accessToken",
		Value:    token,
		Expires:  expiresAt,
		Path:     "/",
		HttpOnly: true,
	})
	json.NewEncoder(w).Encode(AuthLoginResponseData{UserID: userAccount.UserID.String()})
}
