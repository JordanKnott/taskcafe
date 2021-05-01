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
		log.Info("middleware")
		requestID := uuid.New()
		foundToken := true
		tokenRaw := ""
		c, err := r.Cookie("authToken")
		if err != nil {
			if err == http.ErrNoCookie {
				foundToken = false
			}
		}
		if !foundToken {
			token := r.Header.Get("Authorization")
			if token != "" {
				tokenRaw = token
			}
		} else {
			tokenRaw = c.Value
		}
		authTokenID, err := uuid.Parse(tokenRaw)
		log.Info("checking if logged in")
		ctx := r.Context()
		if err == nil {
			token, err := m.repo.GetAuthTokenByID(r.Context(), authTokenID)
			if err == nil {
				ctx = context.WithValue(ctx, utils.UserIDKey, token.UserID)
			}
		}

		// ctx = context.WithValue(ctx, utils.RestrictedModeKey, accessClaims.Restricted)
		// ctx = context.WithValue(ctx, utils.OrgRoleKey, accessClaims.OrgRole)
		ctx = context.WithValue(ctx, utils.ReqIDKey, requestID)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
