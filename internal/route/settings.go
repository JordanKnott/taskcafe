package route

import (
	"encoding/json"
	"net/http"

	log "github.com/sirupsen/logrus"
)

type PublicSettingsResponse struct {
	IsConfigured            bool `json:"isConfigured"`
	AllowPublicRegistration bool `json:"allowPublicRegistration"`
}

func (h *TaskcafeHandler) PublicSettings(w http.ResponseWriter, r *http.Request) {
	userExists, err := h.repo.HasAnyUser(r.Context())
	if err != nil {
		log.WithError(err).Error("issue checking if user accounts exist")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(PublicSettingsResponse{IsConfigured: userExists, AllowPublicRegistration: false})
}
