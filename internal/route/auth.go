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

type authResource struct{}

// LoginRequestData is the request data when a user logs in
type LoginRequestData struct {
	Username string
	Password string
}

// NewUserAccount is the request data for a new user
type NewUserAccount struct {
	FullName string `json:"fullname"`
	Username string
	Password string
	Initials string
	Email    string
}

// RegisterUserRequestData is the request data for registering a new user (duh)
type RegisterUserRequestData struct {
	User NewUserAccount
}

type RegisteredUserResponseData struct {
	Setup bool `json:"setup"`
}

// ConfirmUserRequestData is the request data for upgrading an invited user to a normal user
type ConfirmUserRequestData struct {
	ConfirmToken string
}

// InstallRequestData is the request data for installing new Taskcafe app
type InstallRequestData struct {
	User NewUserAccount
}

type Setup struct {
	ConfirmToken string `json:"confirmToken"`
}

// LoginResponseData is the response data for when a user logs in
type LoginResponseData struct {
	AccessToken string `json:"accessToken"`
	Setup       bool   `json:"setup"`
}

// LogoutResponseData is the response data for when a user logs out
type LogoutResponseData struct {
	Status string `json:"status"`
}

// RefreshTokenResponseData is the response data for when an access token is refreshed
type RefreshTokenResponseData struct {
	AccessToken string `json:"accessToken"`
}

// AvatarUploadResponseData is the response data for a user profile is uploaded
type AvatarUploadResponseData struct {
	UserID string `json:"userID"`
	URL    string `json:"url"`
}

// RefreshTokenHandler handles when a user attempts to refresh token
func (h *TaskcafeHandler) RefreshTokenHandler(w http.ResponseWriter, r *http.Request) {
	userExists, err := h.repo.HasAnyUser(r.Context())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.WithError(err).Error("issue while fetching if user accounts exist")
		return
	}

	log.WithField("userExists", userExists).Info("checking if setup")
	if !userExists {
		w.Header().Set("Content-type", "application/json")
		json.NewEncoder(w).Encode(LoginResponseData{AccessToken: "", Setup: true})
		return
	}

	c, err := r.Cookie("refreshToken")
	if err != nil {
		if err == http.ErrNoCookie {
			log.Warn("no cookie")
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

	if !user.Active {
		log.WithFields(log.Fields{
			"username": user.Username,
		}).Warn("attempt to refresh token with inactive user")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	refreshCreatedAt := time.Now().UTC()
	refreshExpiresAt := refreshCreatedAt.AddDate(0, 0, 1)
	refreshTokenString, err := h.repo.CreateRefreshToken(r.Context(), db.CreateRefreshTokenParams{token.UserID, refreshCreatedAt, refreshExpiresAt})

	err = h.repo.DeleteRefreshTokenByID(r.Context(), token.TokenID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	log.Info("here 1")
	accessTokenString, err := auth.NewAccessToken(token.UserID.String(), auth.Unrestricted, user.RoleCode, h.jwtKey)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	log.Info("here 2")
	w.Header().Set("Content-type", "application/json")
	http.SetCookie(w, &http.Cookie{
		Name:     "refreshToken",
		Value:    refreshTokenString.TokenID.String(),
		Expires:  refreshExpiresAt,
		HttpOnly: true,
	})
	json.NewEncoder(w).Encode(LoginResponseData{AccessToken: accessTokenString, Setup: false})
}

// LogoutHandler removes all refresh tokens to log out user
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

// LoginHandler creates a new refresh & access token for the user if given the correct credentials
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

	if !user.Active {
		log.WithFields(log.Fields{
			"username": requestData.Username,
		}).Warn("attempt to login with inactive user")
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

	accessTokenString, err := auth.NewAccessToken(user.UserID.String(), auth.Unrestricted, user.RoleCode, h.jwtKey)
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

// TODO: remove
// InstallHandler creates first user on fresh install
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

	log.WithField("userID", user.UserID.String()).Info("creating install access token")
	accessTokenString, err := auth.NewAccessToken(user.UserID.String(), auth.Unrestricted, user.RoleCode, h.jwtKey)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
	log.Info(accessTokenString)

	w.Header().Set("Content-type", "application/json")
	http.SetCookie(w, &http.Cookie{
		Name:     "refreshToken",
		Value:    refreshTokenString.TokenID.String(),
		Expires:  refreshExpiresAt,
		HttpOnly: true,
	})
	json.NewEncoder(w).Encode(LoginResponseData{accessTokenString, false})
}

func (h *TaskcafeHandler) ConfirmUser(w http.ResponseWriter, r *http.Request) {
	usersExist, err := h.repo.HasActiveUser(r.Context())
	if err != nil {
		log.WithError(err).Error("issue checking if user accounts exist")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var user db.UserAccount
	if !usersExist {
		log.Info("setting first inactive user to active")
		user, err = h.repo.SetFirstUserActive(r.Context())
		if err != nil {
			log.WithError(err).Error("issue checking if user accounts exist")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	} else {
		var requestData ConfirmUserRequestData
		err = json.NewDecoder(r.Body).Decode(&requestData)
		if err != nil {
			log.WithError(err).Error("issue decoding request data")
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		confirmTokenID, err := uuid.Parse(requestData.ConfirmToken)
		if err != nil {
			log.WithError(err).Error("issue parsing confirm token")
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		confirmToken, err := h.repo.GetConfirmTokenByID(r.Context(), confirmTokenID)
		if err != nil {
			log.WithError(err).Error("issue getting token by id")
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		user, err = h.repo.SetUserActiveByEmail(r.Context(), confirmToken.Email)
		if err != nil {
			log.WithError(err).Error("issue getting account by email")
			w.WriteHeader(http.StatusBadRequest)
			return
		}
	}

	now := time.Now().UTC()
	projects, err := h.repo.GetProjectsForInvitedMember(r.Context(), user.Email)
	for _, project := range projects {
		member, err := h.repo.CreateProjectMember(r.Context(),
			db.CreateProjectMemberParams{
				ProjectID: project,
				UserID:    user.UserID,
				AddedAt:   now,
				RoleCode:  "member",
			},
		)
		if err != nil {
			log.WithError(err).Error("issue creating project member")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		log.WithField("memberID", member.ProjectMemberID).Info("creating project member")
		err = h.repo.DeleteProjectMemberInvitedForEmail(r.Context(), user.Email)
		if err != nil {
			log.WithError(err).Error("issue deleting project member invited")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		err = h.repo.DeleteUserAccountInvitedForEmail(r.Context(), user.Email)
		if err != nil {
			log.WithError(err).Error("issue deleting user account invited")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		err = h.repo.DeleteConfirmTokenForEmail(r.Context(), user.Email)
		if err != nil {
			log.WithError(err).Error("issue deleting confirm token")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

	}

	refreshCreatedAt := time.Now().UTC()
	refreshExpiresAt := refreshCreatedAt.AddDate(0, 0, 1)
	refreshTokenString, err := h.repo.CreateRefreshToken(r.Context(), db.CreateRefreshTokenParams{user.UserID, refreshCreatedAt, refreshExpiresAt})

	accessTokenString, err := auth.NewAccessToken(user.UserID.String(), auth.Unrestricted, user.RoleCode, h.jwtKey)
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

func (h *TaskcafeHandler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	userExists, err := h.repo.HasAnyUser(r.Context())
	if err != nil {
		log.WithError(err).Error("issue checking if user accounts exist")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var requestData RegisterUserRequestData
	err = json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		log.WithError(err).Error("issue decoding register user request data")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if userExists {
		_, err := h.repo.GetInvitedUserByEmail(r.Context(), requestData.User.Email)
		if err != nil {
			if err == sql.ErrNoRows {
				hasActiveUser, err := h.repo.HasActiveUser(r.Context())
				if err != nil {
					log.WithError(err).Error("error checking for active user")
					w.WriteHeader(http.StatusInternalServerError)
				}
				if !hasActiveUser {
					json.NewEncoder(w).Encode(RegisteredUserResponseData{Setup: true})
					return
				}
			} else {
				log.WithError(err).Error("error while retrieving invited user by email")
				w.WriteHeader(http.StatusForbidden)
				return
			}
		}
	}
	// TODO: accept user if public registration is enabled

	createdAt := time.Now().UTC()
	hashedPwd, err := bcrypt.GenerateFromPassword([]byte(requestData.User.Password), 14)
	if err != nil {
		log.Error("issue generating passoed")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	user, err := h.repo.CreateUserAccount(r.Context(), db.CreateUserAccountParams{
		FullName:     requestData.User.FullName,
		Username:     requestData.User.Username,
		Initials:     requestData.User.Initials,
		Email:        requestData.User.Email,
		PasswordHash: string(hashedPwd),
		CreatedAt:    createdAt,
		RoleCode:     "admin",
		Active:       false,
	})
	if err != nil {
		log.Error("issue registering user account")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	log.WithField("username", user.UserID).Info("registered new user account")
	json.NewEncoder(w).Encode(RegisteredUserResponseData{Setup: !userExists})
}

// Routes registers all authentication routes
func (rs authResource) Routes(taskcafeHandler TaskcafeHandler) chi.Router {
	r := chi.NewRouter()
	r.Post("/login", taskcafeHandler.LoginHandler)
	r.Post("/refresh_token", taskcafeHandler.RefreshTokenHandler)
	r.Post("/logout", taskcafeHandler.LogoutHandler)
	return r
}
