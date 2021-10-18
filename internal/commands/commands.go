package commands

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/jordanknott/taskcafe/internal/utils"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const mainDescription = `Taskcafé is an open soure project management
system written in Golang & React.`

func VersionTemplate() string {
	info := utils.Version()
	return fmt.Sprintf(`Version: %s
Commit: %s
Built: %s`, info.Version, info.CommitHash, info.BuildDate+"\n")
}

var cfgFile string

var rootCmd = &cobra.Command{
	Use:     "taskcafe",
	Long:    mainDescription,
	Version: VersionTemplate(),
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

	err := viper.ReadInConfig()
	if err == nil {
		return
	}
	if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
		panic(err)
	}

	viper.SetDefault("server.hostname", "0.0.0.0:3333")
	viper.SetDefault("database.host", "127.0.0.1")
	viper.SetDefault("database.name", "taskcafe")
	viper.SetDefault("database.user", "taskcafe")
	viper.SetDefault("database.password", "taskcafe_test")

	viper.SetDefault("queue.broker", "amqp://guest:guest@localhost:5672/")
	viper.SetDefault("queue.store", "memcache://localhost:11211")

}

// Execute the root cobra command
func Execute() {
	viper.SetDefault("server.hostname", "0.0.0.0:3333")
	viper.SetDefault("database.host", "127.0.0.1")
	viper.SetDefault("database.name", "taskcafe")
	viper.SetDefault("database.user", "taskcafe")
	viper.SetDefault("database.password", "taskcafe_test")
	viper.SetDefault("database.port", "5432")
	viper.SetDefault("security.token_expiration", "15m")
	viper.SetDefault("server.remote_user_header", "")

	viper.SetDefault("queue.broker", "amqp://guest:guest@localhost:5672/")
	viper.SetDefault("queue.store", "memcache://localhost:11211")

	rootCmd.SetVersionTemplate(VersionTemplate())
	rootCmd.AddCommand(newWebCmd(), newMigrateCmd(), newWorkerCmd(), newResetPasswordCmd(), newSeedCmd())
	rootCmd.Execute()
}
