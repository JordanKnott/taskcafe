package main

import (
	"github.com/jordanknott/project-citadel/api/internal/commands"
	_ "github.com/lib/pq"
)

func main() {
	commands.Execute()
}
