package route

import (
	"context"
	"net/http"

	"github.com/google/uuid"
	"github.com/jordanknott/taskcafe/internal/db"
	"github.com/jordanknott/taskcafe/internal/utils"
	log "github.com/sirupsen/logrus"
)

// AuthenticationMiddleware is a middleware that requires a valid JWT token to be passed via the Authorization header
type AuthenticationMiddleware struct {
	repo db.Repository
}

// Middleware returns the middleware handler
func (m *AuthenticationMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requestID := uuid.New()
		foundToken := true
		tokenRaw := ""

		token := r.Header.Get("Authorization")
		if token != "" {
			tokenRaw = token
		} else {
			foundToken = false
		}

		if !foundToken {
			c, err := r.Cookie("authToken")
			if err != nil {
				if err == http.ErrNoCookie {
					log.WithError(err).Error("error while fetching authToken")
					w.WriteHeader(http.StatusBadRequest)
				}
				log.WithError(err).Error("error while fetching authToken")
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			tokenRaw = c.Value
		}
		authTokenID, err := uuid.Parse(tokenRaw)
		ctx := r.Context()
		if err == nil {
			token, err := m.repo.GetAuthTokenByID(r.Context(), authTokenID)
			if err == nil {
				log.WithField("tokenID", authTokenID).WithField("userID", token.UserID).Info("setting auth token")
				ctx = context.WithValue(ctx, utils.UserIDKey, token.UserID)
			}
		}

		// ctx = context.WithValue(ctx, utils.RestrictedModeKey, accessClaims.Restricted)
		// ctx = context.WithValue(ctx, utils.OrgRoleKey, accessClaims.OrgRole)
		ctx = context.WithValue(ctx, utils.ReqIDKey, requestID)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
