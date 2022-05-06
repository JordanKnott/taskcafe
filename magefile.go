//go:build mage
// +build mage

package main

import (
	"io"
	"net/http"
	"os"

	"github.com/jordanknott/taskcafe/internal/config"
	"github.com/magefile/mage/mg"
	"github.com/magefile/mage/sh"
	"github.com/spf13/viper"
)

const (
	SqlcTag   = "v1.11.0"
	SqlcUrl   = "https://github.com/kyleconroy/sqlc"
	GqlgenTag = "v0.16.0"
	GqlgenUrl = "https://github.com/99designs/gqlgen"
)

var Aliases = map[string]interface{}{
	"dev:sql": Dev.SqlCompile,
}

type Dev mg.Namespace

func init() {
	viper.AddConfigPath("./conf")
	viper.AddConfigPath(".")
	viper.AddConfigPath("/etc/taskcafe")
	viper.SetConfigName("taskcafe")
	config.InitDefaults()
	err := viper.ReadInConfig()
	if err == nil {
		return
	}
}
func (Dev) Pgcli() error {
	config, err := config.GetAppConfig()
	if err != nil {
		return err
	}
	return sh.RunV("pgcli", config.Database.GetDatabaseStandardUri())
}

func (Dev) SqlCompile() error {
	return sh.RunV("./scripts/sqlc", "generate")
}

func (Dev) InstallScripts() error {
	err := os.Mkdir("scripts", os.FileMode(0755))
	if err != nil {
		return err
	}
	err = sh.RunV("git", "clone", "-b", SqlcTag, "--depth", "1", SqlcUrl, "scripts/sqlc-repo")
	if err != nil {
		return err
	}
	os.Chdir("scripts/sqlc-repo")
	err = sh.RunV("go", "build", "-o", "../sqlc", "cmd/sqlc/main.go")
	if err != nil {
		return err
	}
	os.Chdir("../..")
	err = sh.RunV("git", "clone", "-b", GqlgenTag, "--depth", "1", GqlgenUrl, "scripts/gqlgen-repo")
	if err != nil {
		return err
	}
	os.Chdir("scripts/gqlgen-repo")
	err = sh.RunV("go", "build", "-o", "../gqlgen", "main.go")
	if err != nil {
		return err
	}
	_ = sh.Rm("scripts/sqlc-repo")
	_ = sh.Rm("scripts/gqlgen-repo")
	return nil
}

func downloadFile(url string, filepath string) error {
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	out, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer out.Close()
	_, err = io.Copy(out, resp.Body)
	return err
}
