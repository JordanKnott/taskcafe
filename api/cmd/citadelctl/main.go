package main

import (
	"context"
	"fmt"
	"io/ioutil"

	_ "github.com/lib/pq"

	"github.com/jmoiron/sqlx"
	"github.com/jordanknott/project-citadel/api/pg"

	"github.com/BurntSushi/toml"
	// "github.com/jordanknott/project-citadel/api/router"
	// "time"
)

type color struct {
	Name     string
	Color    string
	Position int
}

type colors struct {
	Color []color
}

func main() {
	// dur := time.Hour * 24 * 7 * 30
	// token, err := router.NewAccessTokenCustomExpiration("21345076-6423-4a00-a6bd-cd9f830e2764", dur)
	// if err != nil {
	// 	panic(err)
	// }
	// fmt.Println(token)

	fmt.Println("seeding database...")

	dat, err := ioutil.ReadFile("data/colors.toml")
	if err != nil {
		panic(err)
	}

	var labelColors colors
	_, err = toml.Decode(string(dat), &labelColors)
	if err != nil {
		panic(err)
	}
	db, err := sqlx.Connect("postgres", "user=postgres password=test host=0.0.0.0 dbname=citadel sslmode=disable")
	repository := pg.NewRepository(db)
	for _, color := range labelColors.Color {
		fmt.Printf("%v\n", color)
		repository.CreateLabelColor(context.Background(), pg.CreateLabelColorParams{color.Name, color.Color, float64(color.Position)})
	}

}
