package api

import (
	"database/sql"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/jordanknott/taskcafe/internal/db"
	"github.com/sirupsen/logrus"
)

type TaskcafeApi struct {
	Data db.Repository
}

func NewRouter(dbConnection *sql.DB) (chi.Router, error) {

	formatter := new(logrus.TextFormatter)
	formatter.TimestampFormat = "02-01-2006 15:04:05"
	formatter.FullTimestamp = true

	routerLogger := logrus.New()
	routerLogger.SetLevel(logrus.InfoLevel)
	routerLogger.Formatter = formatter
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	// r.Use(logger.NewStructuredLogger(routerLogger))
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Cookie", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	repository := db.NewRepository(dbConnection)
	taskcafeApi := TaskcafeApi{*repository}

	r.Group(func(mux chi.Router) {
		mux.Post("/auth/login", taskcafeApi.AuthLogin)
		mux.Post("/public_settings", taskcafeApi.PublicSettings)
		// mux.Post("/auth/logout", taskcafeApi.AuthLogout)
		// mux.Post("/auth/me", taskcafeApi.AuthMe)
		/*
			mux.Handle("/__graphql", graph.NewPlaygroundHandler("/graphql"))
			mux.Mount("/uploads/", http.StripPrefix("/uploads/", imgServer))
			mux.Post("/auth/confirm", taskcafeHandler.ConfirmUser)
			mux.Post("/auth/register", taskcafeHandler.RegisterUser)
			mux.Get("/settings", taskcafeHandler.PublicSettings)
			mux.Post("/logger", taskcafeHandler.HandleClientLog)
		*/
	})
	/*
		auth := AuthenticationMiddleware{*repository}
		jobQueue := jobs.JobQueue{
			Repository: *repository,
			AppConfig:  appConfig,
			Server:     jobServer,
		}
		r.Group(func(mux chi.Router) {
			mux.Use(auth.Middleware)
			mux.Post("/users/me/avatar", taskcafeHandler.ProfileImageUpload)
			mux.Mount("/graphql", graph.NewHandler(*repository, appConfig, jobQueue, redisClient))
		})
	*/

	// frontend := FrontendHandler{staticPath: "build", indexPath: "index.html"}
	// r.Handle("/*", frontend)

	return r, nil
}
