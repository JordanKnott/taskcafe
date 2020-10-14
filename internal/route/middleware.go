package route

import (
	"context"
	"net/http"
	"strings"

	"github.com/google/uuid"
	"github.com/jordanknott/taskcafe/internal/auth"
	"github.com/jordanknott/taskcafe/internal/utils"
	log "github.com/sirupsen/logrus"
)

// AuthenticationMiddleware is a middleware that requires a valid JWT token to be passed via the Authorization header
type AuthenticationMiddleware struct {
	jwtKey []byte
}

// Middleware returns the middleware handler
func (m *AuthenticationMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requestID := uuid.New()
		bearerTokenRaw := r.Header.Get("Authorization")
		splitToken := strings.Split(bearerTokenRaw, "Bearer")
		if len(splitToken) != 2 {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		accessTokenString := strings.TrimSpace(splitToken[1])
		accessClaims, err := auth.ValidateAccessToken(accessTokenString, m.jwtKey)
		if err != nil {
			if _, ok := err.(*auth.ErrExpiredToken); ok {
				w.WriteHeader(http.StatusUnauthorized)
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

		var userID uuid.UUID
		if accessClaims.Restricted == auth.InstallOnly {
			userID = uuid.New()
		} else {
			userID, err = uuid.Parse(accessClaims.UserID)
			if err != nil {
				log.WithError(err).Error("middleware access token userID parse")
				w.WriteHeader(http.StatusBadRequest)
				return
			}
		}
		ctx := context.WithValue(r.Context(), utils.UserIDKey, userID)
		ctx = context.WithValue(ctx, utils.RestrictedModeKey, accessClaims.Restricted)
		ctx = context.WithValue(ctx, utils.OrgRoleKey, accessClaims.OrgRole)
		ctx = context.WithValue(ctx, utils.ReqIDKey, requestID)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
