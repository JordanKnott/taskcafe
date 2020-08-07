package main

import (
	"github.com/jordanknott/taskcafe/internal/commands"
	_ "github.com/lib/pq"
)

func main() {
	commands.Execute()
}
