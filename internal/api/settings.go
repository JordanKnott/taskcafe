package api

import (
	"encoding/json"
	"net/http"

	"github.com/sirupsen/logrus"
)

type PublicSettingsResponseData struct {
	IsInstalled             bool `json:"isInstalled"`
	AllowPublicRegistration bool `json:"allowPublicRegistration`
}

func (api *TaskcafeApi) PublicSettings(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	isInstalled, err := api.Data.HasAnyUserAccount(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		logrus.WithError(err).Error()
	}
	json.NewEncoder(w).Encode(PublicSettingsResponseData{IsInstalled: isInstalled, AllowPublicRegistration: false})
}
