package route

import (
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"

	"os"
	"path/filepath"

	"github.com/jordanknott/taskcafe/internal/db"
	"github.com/jordanknott/taskcafe/internal/frontend"
	"github.com/jordanknott/taskcafe/internal/graph"
	"github.com/jordanknott/taskcafe/internal/logger"
	"github.com/jordanknott/taskcafe/internal/utils"
)

// FrontendHandler serves an embed React client through chi
type FrontendHandler struct {
	staticPath string
	indexPath  string
}

// IsDir checks if the given file is a directory
func IsDir(f http.File) bool {
	fi, err := f.Stat()
	if err != nil {
		return false
	}
	return fi.IsDir()
}

// ServeHTTP attempts to serve a requested file for the embedded React client
func (h FrontendHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	f, err := frontend.Frontend.Open(path)
	if os.IsNotExist(err) || IsDir(f) {
		index, err := frontend.Frontend.Open("index.html")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		http.ServeContent(w, r, "index.html", time.Now(), index)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.ServeContent(w, r, path, time.Now(), f)
}

// TaskcafeHandler contains all the route handlers
type TaskcafeHandler struct {
	repo   db.Repository
	jwtKey []byte
}

// NewRouter creates a new router for chi
func NewRouter(dbConnection *sqlx.DB, emailConfig utils.EmailConfig, jwtKey []byte) (chi.Router, error) {
	formatter := new(log.TextFormatter)
	formatter.TimestampFormat = "02-01-2006 15:04:05"
	formatter.FullTimestamp = true

	routerLogger := log.New()
	routerLogger.SetLevel(log.InfoLevel)
	routerLogger.Formatter = formatter
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(logger.NewStructuredLogger(routerLogger))
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	repository := db.NewRepository(dbConnection)
	taskcafeHandler := TaskcafeHandler{*repository, jwtKey}

	var imgServer = http.FileServer(http.Dir("./uploads/"))
	r.Group(func(mux chi.Router) {
		mux.Mount("/auth", authResource{}.Routes(taskcafeHandler))
		mux.Handle("/__graphql", graph.NewPlaygroundHandler("/graphql"))
		mux.Mount("/uploads/", http.StripPrefix("/uploads/", imgServer))
		mux.Post("/auth/confirm", taskcafeHandler.ConfirmUser)
		mux.Post("/auth/register", taskcafeHandler.RegisterUser)
	})
	auth := AuthenticationMiddleware{jwtKey}
	r.Group(func(mux chi.Router) {
		mux.Use(auth.Middleware)
		mux.Post("/users/me/avatar", taskcafeHandler.ProfileImageUpload)
		mux.Handle("/graphql", graph.NewHandler(*repository, emailConfig))
	})

	frontend := FrontendHandler{staticPath: "build", indexPath: "index.html"}
	r.Handle("/*", frontend)

	return r, nil
}
