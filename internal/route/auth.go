package route

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/google/uuid"
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

type ValidateAuthTokenResponse struct {
	Valid  bool   `json:"valid"`
	UserID string `json:"userID"`
}

// LoginResponseData is the response data for when a user logs in
type LoginResponseData struct {
	UserID   string `json:"userID"`
	Complete bool   `json:"complete"`
}

// LogoutResponseData is the response data for when a user logs out
type LogoutResponseData struct {
	Status string `json:"status"`
}

// AuthTokenResponseData is the response data for when an access token is refreshed
type AuthTokenResponseData struct {
	AccessToken string `json:"accessToken"`
}

// AvatarUploadResponseData is the response data for a user profile is uploaded
type AvatarUploadResponseData struct {
	UserID string `json:"userID"`
	URL    string `json:"url"`
}

// LogoutHandler removes all refresh tokens to log out user
func (h *TaskcafeHandler) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	c, err := r.Cookie("authToken")
	if err != nil {
		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	refreshTokenID := uuid.MustParse(c.Value)
	err = h.repo.DeleteAuthTokenByID(r.Context(), refreshTokenID)
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

	authCreatedAt := time.Now().UTC()
	authExpiresAt := authCreatedAt.AddDate(0, 0, 1)
	authToken, err := h.repo.CreateAuthToken(r.Context(), db.CreateAuthTokenParams{user.UserID, authCreatedAt, authExpiresAt})

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}

	w.Header().Set("Content-type", "application/json")
	http.SetCookie(w, &http.Cookie{
		Name:     "authToken",
		Value:    authToken.TokenID.String(),
		Expires:  authExpiresAt,
		Path:     "/",
		HttpOnly: true,
	})
	json.NewEncoder(w).Encode(LoginResponseData{Complete: true, UserID: authToken.UserID.String()})
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

	authCreatedAt := time.Now().UTC()
	authExpiresAt := authCreatedAt.AddDate(0, 0, 1)
	authToken, err := h.repo.CreateAuthToken(r.Context(), db.CreateAuthTokenParams{user.UserID, authCreatedAt, authExpiresAt})

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-type", "application/json")
	http.SetCookie(w, &http.Cookie{
		Name:     "authToken",
		Value:    authToken.TokenID.String(),
		Path:     "/",
		Expires:  authExpiresAt,
		HttpOnly: true,
	})
	json.NewEncoder(w).Encode(LoginResponseData{Complete: true, UserID: authToken.UserID.String()})
}
func (h *TaskcafeHandler) ValidateAuthTokenHandler(w http.ResponseWriter, r *http.Request) {
	c, err := r.Cookie("authToken")
	if err != nil {
		if err == http.ErrNoCookie {
			json.NewEncoder(w).Encode(ValidateAuthTokenResponse{Valid: false, UserID: ""})
			return
		}
		log.WithError(err).Error("unknown error")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	authTokenID := uuid.MustParse(c.Value)
	token, err := h.repo.GetAuthTokenByID(r.Context(), authTokenID)
	if err != nil {
		json.NewEncoder(w).Encode(ValidateAuthTokenResponse{Valid: false, UserID: ""})
	} else {
		json.NewEncoder(w).Encode(ValidateAuthTokenResponse{Valid: true, UserID: token.UserID.String()})
	}
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
					return
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
		log.WithError(err).Error("issue registering user account")
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
	r.Post("/logout", taskcafeHandler.LogoutHandler)
	r.Post("/validate", taskcafeHandler.ValidateAuthTokenHandler)
	return r
}
