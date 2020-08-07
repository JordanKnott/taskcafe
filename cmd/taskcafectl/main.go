package main

import (
	"bytes"
	"context"
	"fmt"
	"github.com/BurntSushi/toml"
	"github.com/jmoiron/sqlx"
	"github.com/jordan-wright/email"
	"github.com/jordanknott/taskcafe/pg"
	"github.com/jordanknott/taskcafe/router"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
	"io/ioutil"
	"net/smtp"
	"text/template"
	"time"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
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

type UserRegistration struct {
	Username string
	Year     string
	AppName  string
	AppURL   string
}

type color struct {
	Name     string
	Color    string
	Position int
}

type colors struct {
	Color []color
}

func SendEmail() {
	emailTmpl, err := ioutil.ReadFile("templates/mail/user/registered.tmpl")
	if err != nil {
		panic(err)
	}

	user := UserRegistration{Username: "jordanthedev", AppName: "Taskcafe", AppURL: "http://localhost:3000/", Year: "2020"}
	tmpl, err := template.New("registered").Parse(string(emailTmpl))
	if err != nil {
		panic(err)
	}
	var tpl bytes.Buffer
	if err := tmpl.Execute(&tpl, &user); err != nil {
		panic(err)
	}

	result := tpl.String()

	e := email.NewEmail()
	e.From = "Jordan Knott <no-reply@taskcafe.com>"
	e.To = []string{"jordan@jordanthedev.com"}
	e.Subject = "Jordan Knott (@jordanthedev) invited you to join the team \"Paradox\" on Taskcafe"
	e.Text = []byte("Text Body is, of course, supported!")
	e.HTML = []byte(result)
	e.Send("localhost:1025", smtp.PlainAuth("", "test@gmail.com", "password123", "localhost"))
}

func Seed() {
	dur := time.Hour * 24 * 7 * 30
	token, err := router.NewAccessTokenCustomExpiration("21345076-6423-4a00-a6bd-cd9f830e2764", dur)
	if err != nil {
		panic(err)
	}
	fmt.Println(token)

	fmt.Println("seeding database...")

	dat, err := ioutil.ReadFile("data/dark_colors.toml")
	if err != nil {
		panic(err)
	}

	var labelColors colors
	_, err = toml.Decode(string(dat), &labelColors)
	if err != nil {
		panic(err)
	}
	db, err := sqlx.Connect("postgres", "user=postgres password=test host=0.0.0.0 dbname=taskcafe sslmode=disable")
	repository := pg.NewRepository(db)
	for _, color := range labelColors.Color {
		fmt.Printf("%v\n", color)
		repository.CreateLabelColor(context.Background(), pg.CreateLabelColorParams{color.Name, color.Color, float64(color.Position)})
	}
}
func Migrate() {
	dat, err := ioutil.ReadFile("conf/app.toml")
	if err != nil {
		panic(err)
	}

	var appConfig AppConfig
	_, err = toml.Decode(string(dat), &appConfig)
	if err != nil {
		panic(err)
	}
	connection := fmt.Sprintf("user=%s password=%s host=%s dbname=%s sslmode=disable",
		appConfig.Database.User,
		appConfig.Database.Password,
		appConfig.Database.Host,
		appConfig.Database.Name,
	)
	fmt.Println(connection)
	db, err := sqlx.Connect("postgres", connection)
	if err != nil {
		panic(err)
	}
	defer db.Close()
	driver, err := postgres.WithInstance(db.DB, &postgres.Config{})
	if err != nil {
		panic(err)
	}
	m, err := migrate.NewWithDatabaseInstance(
		"file://migrations",
		"postgres", driver)
	if err != nil {
		panic(err)
	}
	err = m.Up()
	if err != nil {
		panic(err)
	}
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
	connection := fmt.Sprintf("user=%s password=%s host=%s dbname=%s sslmode=disable",
		appConfig.Database.User,
		appConfig.Database.Password,
		appConfig.Database.Host,
		appConfig.Database.Name,
	)
	fmt.Println(connection)
	db, err := sqlx.Connect("postgres", connection)
	if err != nil {
		panic(err)

	}
	createdAt := time.Now().UTC()
	hashedPwd, err := bcrypt.GenerateFromPassword([]byte("test"), 14)
	repo := pg.NewRepository(db)
	if err != nil {
		panic(err)
	}
	_, err = repo.CreateUserAccount(context.Background(), pg.CreateUserAccountParams{
		Username:     "jordan",
		Initials:     "JK",
		Email:        "jordan@jordanthedev.com",
		PasswordHash: string(hashedPwd),
		CreatedAt:    createdAt,
		RoleCode:     "admin",
	})
	if err != nil {
		panic(err)
	}
}
