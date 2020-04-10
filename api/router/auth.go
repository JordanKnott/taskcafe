package router

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"github.com/jordanknott/project-citadel/api/pg"
	log "github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("citadel_test_key")

type authResource struct{}

func (h *CitadelHandler) RefreshTokenHandler(w http.ResponseWriter, r *http.Request) {
	c, err := r.Cookie("refreshToken")
	if err != nil {
		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	refreshTokenID := uuid.MustParse(c.Value)
	token, err := h.repo.GetRefreshTokenByID(r.Context(), refreshTokenID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	refreshCreatedAt := time.Now().UTC()
	refreshExpiresAt := refreshCreatedAt.AddDate(0, 0, 1)
	refreshTokenString, err := h.repo.CreateRefreshToken(r.Context(), pg.CreateRefreshTokenParams{token.UserID, refreshCreatedAt, refreshExpiresAt})

	err = h.repo.DeleteRefreshTokenByID(r.Context(), token.TokenID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}

	accessTokenString, err := NewAccessToken("1")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}

	w.Header().Set("Content-type", "application/json")
	http.SetCookie(w, &http.Cookie{
		Name:     "refreshToken",
		Value:    refreshTokenString.TokenID.String(),
		Expires:  refreshExpiresAt,
		HttpOnly: true,
	})
	json.NewEncoder(w).Encode(LoginResponseData{AccessToken: accessTokenString})
}

func (h *CitadelHandler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var requestData LoginRequestData
	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Debug("bad request body")
		return
	}

	user, err := h.repo.GetUserAccountByUsername(r.Context(), requestData.Username)
	if err != nil {
		log.WithFields(log.Fields{
			"username": requestData.Username,
		}).Warn("user account not found")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(requestData.Password))
	if err != nil {
		log.WithFields(log.Fields{
			"password":      requestData.Password,
			"password_hash": user.PasswordHash,
		}).Warn("password incorrect")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	userID := uuid.MustParse("0183d9ab-d0ed-4c9b-a3df-77a0cdd93dca")
	refreshCreatedAt := time.Now().UTC()
	refreshExpiresAt := refreshCreatedAt.AddDate(0, 0, 1)
	refreshTokenString, err := h.repo.CreateRefreshToken(r.Context(), pg.CreateRefreshTokenParams{userID, refreshCreatedAt, refreshExpiresAt})

	accessTokenString, err := NewAccessToken("1")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}

	w.Header().Set("Content-type", "application/json")
	http.SetCookie(w, &http.Cookie{
		Name:     "refreshToken",
		Value:    refreshTokenString.TokenID.String(),
		Expires:  refreshExpiresAt,
		HttpOnly: true,
	})
	json.NewEncoder(w).Encode(LoginResponseData{accessTokenString})
}

func (rs authResource) Routes(citadelHandler CitadelHandler) chi.Router {
	r := chi.NewRouter()
	r.Post("/login", citadelHandler.LoginHandler)
	r.Post("/refresh_token", citadelHandler.RefreshTokenHandler)
	return r
}
