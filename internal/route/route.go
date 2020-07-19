package route

import (
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"

	"github.com/jordanknott/project-citadel/internal/config"
	"github.com/jordanknott/project-citadel/internal/db"
	"github.com/jordanknott/project-citadel/internal/frontend"
	"github.com/jordanknott/project-citadel/internal/graph"
	"github.com/jordanknott/project-citadel/internal/logger"
	"os"
	"path/filepath"
)

// spaHandler implements the http.Handler interface, so we can use it
// to respond to HTTP requests. The path to the static directory and
// path to the index file within that static directory are used to
// serve the SPA in the given static directory.
type FrontendHandler struct {
	staticPath string
	indexPath  string
}

func IsDir(f http.File) bool {
	fi, err := f.Stat()
	if err != nil {
		return false
	}
	return fi.IsDir()
}

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

type CitadelHandler struct {
	config config.AppConfig
	repo   db.Repository
}

func NewRouter(config config.AppConfig, dbConnection *sqlx.DB) (chi.Router, error) {
	formatter := new(log.TextFormatter)
	formatter.TimestampFormat = "02-01-2006 15:04:05"
	formatter.FullTimestamp = true

	routerLogger := log.New()
	routerLogger.SetLevel(log.InfoLevel)
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
	r.Use(logger.NewStructuredLogger(routerLogger))
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	repository := db.NewRepository(dbConnection)
	citadelHandler := CitadelHandler{config, *repository}

	var imgServer = http.FileServer(http.Dir("./uploads/"))
	r.Group(func(mux chi.Router) {
		mux.Mount("/auth", authResource{}.Routes(citadelHandler))
		mux.Handle("/__graphql", graph.NewPlaygroundHandler("/graphql"))
		mux.Mount("/uploads/", http.StripPrefix("/uploads/", imgServer))

	})
	r.Group(func(mux chi.Router) {
		mux.Use(AuthenticationMiddleware)
		mux.Post("/users/me/avatar", citadelHandler.ProfileImageUpload)
		mux.Post("/auth/install", citadelHandler.InstallHandler)
		mux.Handle("/graphql", graph.NewHandler(config, *repository))
	})

	frontend := FrontendHandler{staticPath: "build", indexPath: "index.html"}
	r.Handle("/*", frontend)

	return r, nil
}
