package router

import (
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"

	"github.com/jordanknott/project-citadel/api/graph"
	"github.com/jordanknott/project-citadel/api/pg"
)

func (h *CitadelHandler) PingHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("pong"))
}

func (h *CitadelHandler) ProfileImageUpload(w http.ResponseWriter, r *http.Request) {
	log.Info("preparing to upload file")
	userID, ok := r.Context().Value("userID").(uuid.UUID)
	if !ok {
		log.Error("not a valid uuid")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Parse our multipart form, 10 << 20 specifies a maximum
	// upload of 10 MB files.
	r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("file")
	if err != nil {
		log.WithError(err).Error("issue while uploading file")
		return
	}
	defer file.Close()
	log.WithFields(log.Fields{"filename": handler.Filename, "size": handler.Size, "header": handler.Header}).Info("file metadata")

	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		log.WithError(err).Error("while reading file")
		return
	}
	err = ioutil.WriteFile("uploads/"+handler.Filename, fileBytes, 0644)
	if err != nil {
		log.WithError(err).Error("while reading file")
		return
	}

	h.repo.UpdateUserAccountProfileAvatarURL(r.Context(), pg.UpdateUserAccountProfileAvatarURLParams{UserID: userID, ProfileAvatarUrl: sql.NullString{String: "http://localhost:3333/uploads/" + handler.Filename, Valid: true}})
	// return that we have successfully uploaded our file!
	log.Info("file uploaded")
	json.NewEncoder(w).Encode(AvatarUploadResponseData{URL: "http://localhost:3333/uploads/" + handler.Filename, UserID: userID.String()})

}

func NewRouter(db *sqlx.DB) (chi.Router, error) {
	formatter := new(log.TextFormatter)
	formatter.TimestampFormat = "02-01-2006 15:04:05"
	formatter.FullTimestamp = true

	routerLogger := log.New()
	routerLogger.SetLevel(log.DebugLevel)
	routerLogger.Formatter = formatter
	r := chi.NewRouter()
	cors := cors.New(cors.Options{
		// AllowedOrigins: []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "Cookie"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	})
	r.Use(cors.Handler)
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(NewStructuredLogger(routerLogger))
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	repository := pg.NewRepository(db)
	citadelHandler := CitadelHandler{repository}

	r.Group(func(mux chi.Router) {
		mux.Mount("/auth", authResource{}.Routes(citadelHandler))
		mux.Handle("/__graphql", graph.NewPlaygroundHandler("/graphql"))
		var imgServer = http.FileServer(http.Dir("./uploads/"))
		mux.Mount("/uploads/", http.StripPrefix("/uploads/", imgServer))

	})
	r.Group(func(mux chi.Router) {
		mux.Use(AuthenticationMiddleware)
		mux.Post("/users/me/avatar", citadelHandler.ProfileImageUpload)
		mux.Get("/ping", citadelHandler.PingHandler)
		mux.Handle("/graphql", graph.NewHandler(repository))
	})

	return r, nil
}
