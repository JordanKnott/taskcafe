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
	"s": Backend.Schema,
}

type Frontend mg.Namespace

func (Frontend) Install() error {
	return sh.Run("yarn", "install", "--cwd", "frontend")
}

func (Frontend) Build() error {
	return sh.Run("yarn", "build", "--cwd", "frontend")
}

type Backend mg.Namespace

func (Backend) GenFrontend() error {
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

func Build() {
	mg.SerialDeps(Frontend.Install, Frontend.Build, Backend.GenFrontend, Backend.Build)
}
