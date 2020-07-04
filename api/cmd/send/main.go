package main

import (
	"fmt"

	"github.com/RichardKnop/machinery/v1"
	"github.com/RichardKnop/machinery/v1/config"
	"github.com/RichardKnop/machinery/v1/tasks"
)

func Add(args ...int64) (int64, error) {
	sum := int64(0)
	for _, arg := range args {
		sum += arg
	}
	return sum, nil
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

	addTask0 := tasks.Signature{
		Name: "userRegistration",
		Args: []tasks.Arg{
			{
				Type:  "string",
				Value: "21345076-6423-4a00-a6bd-cd9f830e2764",
			},
		},
	}

	asyncResult, err := server.SendTask(&addTask0)
	if err != nil {
		fmt.Errorf("Could not send task: %s", err.Error())
	}
	fmt.Println(asyncResult.GetState())

	// results, err := asyncResult.Get(time.Duration(time.Millisecond * 5))
	// fmt.Printf("split([\"foo\"]) = %v\n", tasks.HumanReadableResults(results))

}
