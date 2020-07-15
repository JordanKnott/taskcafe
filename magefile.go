//+build mage

package main

import (
	"fmt"
	"github.com/magefile/mage/sh"
	"github.com/shurcooL/vfsgen"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
)

var Aliases = map[string]interface{}{
	"g": Generate,
}

func Vfs() error {
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

// Runs go mod download and then installs the binary.
func Generate() error {

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
	// return sh.Run("go", "install", "./...")
	// fmt.Println(schema.String())
	err = ioutil.WriteFile("internal/graph/schema.graphqls", []byte(schema.String()), os.FileMode(0755))
	if err != nil {
		panic(err)
	}
	return sh.Run("gqlgen")
}
