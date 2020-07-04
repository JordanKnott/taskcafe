package main

import (
	"fmt"
	_ "github.com/lib/pq"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/BurntSushi/toml"
	"github.com/jmoiron/sqlx"
	"github.com/jordanknott/project-citadel/api/internal/route"
	log "github.com/sirupsen/logrus"
)

type Database struct {
	Host     string
	Name     string
	User     string
	Password string
}
type AppConfig struct {
	Database Database
}

func main() {
	dat, err := ioutil.ReadFile("conf/app.toml")
	if err != nil {
		panic(err)
	}

	var appConfig AppConfig
	_, err = toml.Decode(string(dat), &appConfig)
	if err != nil {
		panic(err)
	}

	Formatter := new(log.TextFormatter)
	Formatter.TimestampFormat = "02-01-2006 15:04:05"
	Formatter.FullTimestamp = true
	log.SetFormatter(Formatter)
	log.SetLevel(log.InfoLevel)
	connection := fmt.Sprintf("user=%s password=%s host=%s dbname=%s sslmode=disable",
		appConfig.Database.User,
		appConfig.Database.Password,
		appConfig.Database.Host,
		appConfig.Database.Name,
	)
	db, err := sqlx.Connect("postgres", connection)
	if err != nil {
		log.Panic(err)
	}
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	defer db.Close()
	fmt.Println("starting graphql server on http://localhost:3333")
	fmt.Println("starting graphql playground on http://localhost:3333/__graphql")
	r, _ := route.NewRouter(db)
	http.ListenAndServe(":3333", r)
}
