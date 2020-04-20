package router

import (
	"context"
	"net/http"
	"strings"

	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
)

func AuthenticationMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		bearerTokenRaw := r.Header.Get("Authorization")
		splitToken := strings.Split(bearerTokenRaw, "Bearer")
		log.WithFields(log.Fields{
			"bearerToken": bearerTokenRaw,
		}).Warning("loading bearer token")
		if len(splitToken) != 2 {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		accessTokenString := strings.TrimSpace(splitToken[1])
		accessClaims, err := ValidateAccessToken(accessTokenString)
		if err != nil {
			if _, ok := err.(*ErrExpiredToken); ok {
				w.Write([]byte(`{
	"data": {},
	"errors": [
	{
		"extensions": {
			"code": "UNAUTHENTICATED"
		}
	}
	]
				}`))
				return
			}
			log.Error(err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		userID, err := uuid.Parse(accessClaims.UserID)
		if err != nil {
			log.Error(err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		ctx := context.WithValue(r.Context(), "userID", userID)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
