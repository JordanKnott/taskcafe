//+build mage

package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/magefile/mage/mg"
	"github.com/magefile/mage/sh"
	"github.com/shurcooL/vfsgen"
)

const (
	packageName = "github.com/jordanknott/taskcafe"
)

var ldflags = "-X $PACKAGE/internal/utils.commitHash=$COMMIT_HASH -X $PACKAGE/internal/utils.buildDate=$BUILD_DATE -X $PACKAGE/internal/utils.version=$VERSION"

func runWith(env map[string]string, cmd string, inArgs ...interface{}) error {
	s := argsToStrings(inArgs...)
	return sh.RunWith(env, cmd, s...)
}

// Aliases is a list of short names for often used commands
var Aliases = map[string]interface{}{
	"s":  Backend.Schema,
	"up": Docker.Up,
}

// Frontend is the namespace for all commands that interact with the frontend
type Frontend mg.Namespace

// Install the npm dependencies for the React frontend
func (Frontend) Install() error {
	return sh.RunV("yarn", "--cwd", "frontend", "install")
}

// Eslint runs eslint on the frontend source
func (Frontend) Eslint() error {
	return sh.RunV("yarn", "--cwd", "frontend", "lint")
}

// Tsc runs tsc on the frontend source
func (Frontend) Tsc() error {
	return sh.RunV("yarn", "--cwd", "frontend", "tsc")
}

// Lint the frontend source
func (Frontend) Lint() {
	mg.SerialDeps(Frontend.Eslint, Frontend.Tsc)
}

// Build the React frontend
func (Frontend) Build() error {
	return sh.RunV("yarn", "--cwd", "frontend", "build")
}

// Backend is the namespace for all commands that interact with the backend
type Backend mg.Namespace

// GenMigrations embeds schema migration files into Go source code
func (Backend) GenMigrations() error {
	if _, err := os.Stat("internal/migrations"); os.IsNotExist(err) {
		os.Mkdir("internal/migrations/", 0755)
	}
	var fs http.FileSystem = http.Dir("migrations")
	err := vfsgen.Generate(fs, vfsgen.Options{
		Filename:     "internal/migrations/migrations_generated.go",
		PackageName:  "migrations",
		VariableName: "Migrations",
	})
	if err != nil {
		panic(err)
	}
	return nil
}

// GenFrontend embeds built frontend client into Go source code
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

func flagEnv() map[string]string {
	hash, err := sh.Output("git", "rev-parse", "--short", "HEAD")
	if err != nil {
		fmt.Println("[ignore] fatal: no tag matches")
	}
	tag, err := sh.Output("git", "describe", "--exact-match", "--tags")
	if err != nil {
		tag = "nightly"
	}
	return map[string]string{
		"PACKAGE":     packageName,
		"COMMIT_HASH": hash,
		"BUILD_DATE":  time.Now().Format("2006-01-02T15:04:05Z0700"),
		"VERSION":     tag,
	}
}

// Build the Go api service
func (Backend) Build() error {
	fmt.Println("compiling binary dist/taskcafe")
	return runWith(flagEnv(), "go", "build", "-ldflags", ldflags, "-tags", "prod", "-o", "dist/taskcafe", "cmd/taskcafe/main.go")
}

// Schema merges GraphQL schema files into single schema & runs gqlgen
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

func (Backend) Test() error {
	fmt.Println("running taskcafe backend unit tests")
	return sh.RunV("go", "test", "./...")
}

// Install runs frontend:install
func Install() {
	mg.SerialDeps(Frontend.Install)
}

// Build runs frontend:build, backend:genMigrations, backend:genFrontend, backend:build
func Build() {
	mg.SerialDeps(Frontend.Build, Backend.GenMigrations, Backend.GenFrontend, Backend.Build)
}

// Latest is namespace for commands interacting with docker test setups
type Latest mg.Namespace

func (Latest) Up() error {
	return sh.RunV("docker-compose", "-p", "taskcafe-latest", "-f", "testing/docker-compose.latest.yml", "up")
}

// Test is namespace for commands interacting with docker test setups
type Dev mg.Namespace

func (Dev) Up() error {
	return sh.RunV("docker-compose", "-p", "taskcafe-dev", "-f", "testing/docker-compose.dev.yml", "up")
}

// Docker is namespace for commands interacting with docker
type Docker mg.Namespace

// Up runs the main docker compose file
func (Docker) Up() error {
	return sh.RunV("docker-compose", "-p", "taskcafe", "up", "-d")
}

// Migrate runs the migration command for the docker-compose network
func (Docker) Migrate() error {
	return sh.RunV("docker-compose", "-p", "taskcafe", "-f", "docker-compose.yml", "-f", "docker-compose.migrate.yml", "run", "--rm", "migrate")
}

func argsToStrings(v ...interface{}) []string {
	var args []string
	for _, arg := range v {
		switch v := arg.(type) {
		case string:
			if v != "" {
				args = append(args, v)
			}
		case []string:
			if v != nil {
				args = append(args, v...)
			}
		default:
			panic("invalid type")
		}
	}

	return args
}
