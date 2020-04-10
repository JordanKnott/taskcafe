package main

import (
	_ "github.com/lib/pq"

	"fmt"
	"net/http"

	"github.com/jmoiron/sqlx"
	"github.com/jordanknott/project-citadel/api/router"
	log "github.com/sirupsen/logrus"
)

func main() {
	Formatter := new(log.TextFormatter)
	Formatter.TimestampFormat = "02-01-2006 15:04:05"
	Formatter.FullTimestamp = true
	log.SetFormatter(Formatter)
	db, err := sqlx.Connect("postgres", "user=postgres password=test host=0.0.0.0 dbname=citadel sslmode=disable")
	if err != nil {
		log.Panic(err)
	}
	defer db.Close()
	fmt.Println("starting graphql server on http://localhost:3333")
	fmt.Println("starting graphql playground on http://localhost:3333/__graphql")
	r, _ := router.NewRouter(db)
	http.ListenAndServe(":3333", r)
}
