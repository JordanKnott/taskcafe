package route

import (
	"encoding/json"
	"net/http"

	log "github.com/sirupsen/logrus"
)

type ClientLog struct {
	Level      string `json:"level"`
	Message    string `json:"message"`
	Logger     string `json:"logger"`
	Stacktrace string `json:"stacktrace"`
	Timestamp  string `json:"timestamp"`
}

type ClientLogs struct {
	Logs []ClientLog `json:"logs"`
}

func (h *TaskcafeHandler) HandleClientLog(w http.ResponseWriter, r *http.Request) {
	var clientLogs ClientLogs
	err := json.NewDecoder(r.Body).Decode(&clientLogs)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Debug("bad request body")
		return
	}
	for _, logEntry := range clientLogs.Logs {
		log.WithField("level", logEntry.Level).WithField("message", logEntry.Message).Info("found log")
	}
}
