//+build mage

package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/magefile/mage/mg"
	"github.com/magefile/mage/sh"
	"github.com/shurcooL/vfsgen"
)

var Aliases = map[string]interface{}{
	"s":  Backend.Schema,
	"up": Docker.Up,
}

type Frontend mg.Namespace

func (Frontend) Install() error {
	return sh.RunV("yarn", "--cwd", "frontend", "install")
}

func (Frontend) Build() error {
	return sh.RunV("yarn", "--cwd", "frontend", "build")
}

type Backend mg.Namespace

func (Backend) GenFrontend() error {
	if _, err := os.Stat("internal/frontend/"); os.IsNotExist(err) {
		os.Mkdir("internal/frontend/", 0755)
	}
	var fs http.FileSystem = http.Dir("frontend/build")
	err := vfsgen.Generate(fs, vfsgen.Options{
		Filename:     "internal/frontend/frontend_generated.go",
		PackageName:  "frontend",
		VariableName: "Frontend",
	})
	if err != nil {
		panic(err)
	}
	return nil
}

func (Backend) Build() error {
	fmt.Println("compiling binary dist/citadel")
	return sh.Run("go", "build", "-o", "dist/citadel", "cmd/citadel/main.go")
}

func (Backend) Schema() error {
	files, err := ioutil.ReadDir("internal/graph/schema/")
	if err != nil {
		panic(err)
	}
	var schema strings.Builder
	for _, file := range files {
		filename := "internal/graph/schema/" + file.Name()
		fmt.Println(filename)
		f, err := os.Open(filename)
		if err != nil {
			panic(err)
		}
		content, err := ioutil.ReadAll(f)
		if err != nil {
			panic(err)
		}
		fmt.Fprintln(&schema, string(content))
	}
	err = ioutil.WriteFile("internal/graph/schema.graphqls", []byte(schema.String()), os.FileMode(0755))
	if err != nil {
		panic(err)
	}
	return sh.Run("gqlgen")
}

func Install() {
	mg.SerialDeps(Frontend.Install)
}

func Build() {
	mg.SerialDeps(Frontend.Build, Backend.GenFrontend, Backend.Build)
}

type Docker mg.Namespace

func (Docker) Up() error {
	return sh.RunV("docker-compose", "-p", "citadel", "up", "-d")
}

func (Docker) Migrate() error {
	return sh.RunV("docker-compose", "-p", "citadel", "-f", "docker-compose.yml", "-f", "docker-compose.migrate.yml", "run", "--rm", "migrate")
}
