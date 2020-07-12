//+build mage

package main

import (
	"fmt"
	"github.com/magefile/mage/sh"
	"io/ioutil"
	"os"
	"strings"
)

var Aliases = map[string]interface{}{
	"g": Generate,
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
