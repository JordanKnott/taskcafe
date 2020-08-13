package commands

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const TaskcafeConfDirEnvName = "TASKCAFE_CONFIG_DIR"

const TaskcafeAppConf = "taskcafe"

const mainDescription = `Taskcafé is an open soure project management
system written in Golang & React.`

var (
	version = "dev"
	commit  = "none"
	date    = "unknown"
)

var versionTemplate = fmt.Sprintf(`Version: %s
Commit: %s
Built: %s`, version, commit, date+"\n")

var commandError error
var configDir string
var verbose bool
var noColor bool
var cfgFile string

var rootCmd = &cobra.Command{
	Use:     "taskcafe",
	Long:    mainDescription,
	Version: version,
}

var migration http.FileSystem

func init() {
	cobra.OnInitialize(initConfig)

	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file path")
	migration = http.Dir("./migrations")
}

func initConfig() {
	if cfgFile != "" {
		// Use config file from the flag.
		viper.SetConfigFile(cfgFile)
	} else {
		// Search config in home directory with name ".cobra" (without extension).
		viper.AddConfigPath("./conf")
		viper.AddConfigPath(".")
		viper.AddConfigPath("/etc/taskcafe")
		viper.SetConfigName("taskcafe")
	}

	viper.SetEnvPrefix("TASKCAFE")
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		panic(err)
	}
}

func Execute() {
	rootCmd.SetVersionTemplate(versionTemplate)
	rootCmd.AddCommand(newWebCmd(), newMigrateCmd(), newTokenCmd())
	rootCmd.Execute()
}
