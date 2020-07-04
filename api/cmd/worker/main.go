package main

import (
	"context"
	"fmt"

	"github.com/RichardKnop/machinery/v1"
	"github.com/RichardKnop/machinery/v1/config"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/jordanknott/project-citadel/api/pg"
	_ "github.com/lib/pq"
)

type MachineTasks struct {
	Repository pg.Repository
}

func (m *MachineTasks) UserRegistration(userID string) (bool, error) {
	ctx := context.Background()
	uid, err := uuid.Parse(userID)
	if err != nil {
		return false, err
	}
	user, err := m.Repository.GetUserAccountByID(ctx, uid)
	if err != nil {
		return false, err
	}
	if user.Username == "jordan" {
		return true, nil
	}
	return false, nil
}

func main() {
	var cnf = &config.Config{
		Broker:        "amqp://guest:guest@localhost:5672/",
		DefaultQueue:  "machinery_tasks",
		ResultBackend: "memcache://localhost:11211",
		AMQP: &config.AMQPConfig{
			Exchange:     "machinery_exchange",
			ExchangeType: "direct",
			BindingKey:   "machinery_task",
		},
	}

	fmt.Println("starting server")
	server, err := machinery.NewServer(cnf)
	if err != nil {
		// do something with the error
	}

	db, err := sqlx.Connect("postgres", "user=postgres password=test host=0.0.0.0 dbname=citadel sslmode=disable")
	repo := pg.NewRepository(db)
	tasks := MachineTasks{repo}
	server.RegisterTasks(map[string]interface{}{
		"userRegistration": tasks.UserRegistration,
	})

	worker := server.NewWorker("citadel_worker", 10)
	fmt.Println("launching worker")
	err = worker.Launch()
	if err != nil {
		// do something with the error
	}
}
