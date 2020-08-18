package route

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"github.com/jordanknott/taskcafe/internal/auth"
	"github.com/jordanknott/taskcafe/internal/db"
	log "github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("taskcafe_test_key")

type authResource struct{}

type LoginRequestData struct {
	Username string
	Password string
}

type NewUserAccount struct {
	FullName string `json:"fullname"`
	Username string
	Password string
	Initials string
	Email    string
}

type InstallRequestData struct {
	User NewUserAccount
}

type LoginResponseData struct {
	AccessToken string `json:"accessToken"`
	IsInstalled bool   `json:"isInstalled"`
}

type LogoutResponseData struct {
	Status string `json:"status"`
}

type RefreshTokenResponseData struct {
	AccessToken string `json:"accessToken"`
}

type AvatarUploadResponseData struct {
	UserID string `json:"userID"`
	URL    string `json:"url"`
}

func (h *TaskcafeHandler) RefreshTokenHandler(w http.ResponseWriter, r *http.Request) {

	_, err := h.repo.GetSystemOptionByKey(r.Context(), "is_installed")
	if err == sql.ErrNoRows {
		user, err := h.repo.GetUserAccountByUsername(r.Context(), "system")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		accessTokenString, err := auth.NewAccessToken(user.UserID.String(), auth.InstallOnly, user.RoleCode)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
		w.Header().Set("Content-type", "application/json")
		json.NewEncoder(w).Encode(LoginResponseData{AccessToken: accessTokenString, IsInstalled: false})

		return
	} else if err != nil {
		log.WithError(err).Error("get system option")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	c, err := r.Cookie("refreshToken")
	if err != nil {
		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		log.WithError(err).Error("unknown error")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	refreshTokenID := uuid.MustParse(c.Value)
	token, err := h.repo.GetRefreshTokenByID(r.Context(), refreshTokenID)
	if err != nil {
		if err == sql.ErrNoRows {

			log.WithError(err).WithFields(log.Fields{"refreshTokenID": refreshTokenID.String()}).Error("no tokens found")
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		log.WithError(err).Error("token retrieve failure")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	user, err := h.repo.GetUserAccountByID(r.Context(), token.UserID)
	if err != nil {
		log.WithError(err).Error("user retrieve failure")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	refreshCreatedAt := time.Now().UTC()
	refreshExpiresAt := refreshCreatedAt.AddDate(0, 0, 1)
	refreshTokenString, err := h.repo.CreateRefreshToken(r.Context(), db.CreateRefreshTokenParams{token.UserID, refreshCreatedAt, refreshExpiresAt})

	err = h.repo.DeleteRefreshTokenByID(r.Context(), token.TokenID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}

	accessTokenString, err := auth.NewAccessToken(token.UserID.String(), auth.Unrestricted, user.RoleCode)
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
	json.NewEncoder(w).Encode(LoginResponseData{AccessToken: accessTokenString, IsInstalled: true})
}

func (h *TaskcafeHandler) LogoutHandler(w http.ResponseWriter, r *http.Request) {
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
	err = h.repo.DeleteRefreshTokenByID(r.Context(), refreshTokenID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(LogoutResponseData{Status: "success"})
}

func (h *TaskcafeHandler) LoginHandler(w http.ResponseWriter, r *http.Request) {
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
			"username": requestData.Username,
		}).Warn("password incorrect for user")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	refreshCreatedAt := time.Now().UTC()
	refreshExpiresAt := refreshCreatedAt.AddDate(0, 0, 1)
	refreshTokenString, err := h.repo.CreateRefreshToken(r.Context(), db.CreateRefreshTokenParams{user.UserID, refreshCreatedAt, refreshExpiresAt})

	accessTokenString, err := auth.NewAccessToken(user.UserID.String(), auth.Unrestricted, user.RoleCode)
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
	json.NewEncoder(w).Encode(LoginResponseData{accessTokenString, false})
}

func (h *TaskcafeHandler) InstallHandler(w http.ResponseWriter, r *http.Request) {
	if restricted, ok := r.Context().Value("restricted_mode").(auth.RestrictedMode); ok {
		if restricted != auth.InstallOnly {
			log.Warning("attempted to install without install only restriction")
			w.WriteHeader(http.StatusBadRequest)
			return
		}
	}

	_, err := h.repo.GetSystemOptionByKey(r.Context(), "is_installed")
	if err != sql.ErrNoRows {
		log.WithError(err).Error("install handler called even though system is installed")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var requestData InstallRequestData
	err = json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	createdAt := time.Now().UTC()
	hashedPwd, err := bcrypt.GenerateFromPassword([]byte(requestData.User.Password), 14)
	user, err := h.repo.CreateUserAccount(r.Context(), db.CreateUserAccountParams{
		FullName:     requestData.User.FullName,
		Username:     requestData.User.Username,
		Initials:     requestData.User.Initials,
		Email:        requestData.User.Email,
		PasswordHash: string(hashedPwd),
		CreatedAt:    createdAt,
		RoleCode:     "admin",
	})

	_, err = h.repo.CreateSystemOption(r.Context(), db.CreateSystemOptionParams{Key: "is_installed", Value: sql.NullString{Valid: true, String: "true"}})
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	refreshCreatedAt := time.Now().UTC()
	refreshExpiresAt := refreshCreatedAt.AddDate(0, 0, 1)
	refreshTokenString, err := h.repo.CreateRefreshToken(r.Context(), db.CreateRefreshTokenParams{user.UserID, refreshCreatedAt, refreshExpiresAt})

	accessTokenString, err := auth.NewAccessToken(user.UserID.String(), auth.Unrestricted, user.RoleCode)
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
	json.NewEncoder(w).Encode(LoginResponseData{accessTokenString, false})
}

func (rs authResource) Routes(taskcafeHandler TaskcafeHandler) chi.Router {
	r := chi.NewRouter()
	r.Post("/login", taskcafeHandler.LoginHandler)
	r.Post("/refresh_token", taskcafeHandler.RefreshTokenHandler)
	r.Post("/logout", taskcafeHandler.LogoutHandler)
	return r
}
