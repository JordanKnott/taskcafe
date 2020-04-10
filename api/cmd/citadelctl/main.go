package main

import (
	"fmt"
	"github.com/jordanknott/project-citadel/api/router"
	"time"
)

func main() {
	dur := time.Hour * 24 * 7 * 30
	token, err := router.NewAccessTokenCustomExpiration("21345076-6423-4a00-a6bd-cd9f830e2764", dur)
	if err != nil {
		panic(err)
	}
	fmt.Println(token)
}
