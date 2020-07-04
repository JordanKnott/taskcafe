package route

import (
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"

	"github.com/jordanknott/project-citadel/api/internal/db"
	"github.com/jordanknott/project-citadel/api/internal/graph"
	"github.com/jordanknott/project-citadel/api/internal/logger"
)

type CitadelHandler struct {
	repo db.Repository
}

func NewRouter(dbConnection *sqlx.DB) (chi.Router, error) {
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
	citadelHandler := CitadelHandler{*repository}

	var imgServer = http.FileServer(http.Dir("./uploads/"))
	r.Group(func(mux chi.Router) {
		mux.Mount("/auth", authResource{}.Routes(citadelHandler))
		mux.Handle("/__graphql", graph.NewPlaygroundHandler("/graphql"))
		mux.Mount("/uploads/", http.StripPrefix("/uploads/", imgServer))

	})
	r.Group(func(mux chi.Router) {
		mux.Use(AuthenticationMiddleware)
		mux.Post("/users/me/avatar", citadelHandler.ProfileImageUpload)
		mux.Handle("/graphql", graph.NewHandler(*repository))
	})

	return r, nil
}
