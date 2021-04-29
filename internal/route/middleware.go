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
		c, err := r.Cookie("authToken")
		if err != nil {
			if err == http.ErrNoCookie {
				foundToken = false
			} else {
				log.WithError(err).Error("unknown error")
				w.WriteHeader(http.StatusBadRequest)
				return
			}
		}
		if !foundToken {
			token := r.Header.Get("Authorization")
			if token == "" {
				log.WithError(err).Error("no auth token found in cookie or authorization header")
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			tokenRaw = token
		} else {
			tokenRaw = c.Value
		}
		authTokenID := uuid.MustParse(tokenRaw)
		token, err := m.repo.GetAuthTokenByID(r.Context(), authTokenID)

		if err != nil {
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

		ctx := context.WithValue(r.Context(), utils.UserIDKey, token.UserID)
		// ctx = context.WithValue(ctx, utils.RestrictedModeKey, accessClaims.Restricted)
		// ctx = context.WithValue(ctx, utils.OrgRoleKey, accessClaims.OrgRole)
		ctx = context.WithValue(ctx, utils.ReqIDKey, requestID)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
