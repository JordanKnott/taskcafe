package command

import (
	"net/http"
	"strings"

	_ "github.com/lib/pq"

	// "github.com/jordanknott/taskcafe/internal/config"
	// "github.com/jordanknott/taskcafe/internal/utils"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const mainDescription = `Taskcafé is an open soure project management
system written in Golang & React.`

func VersionTemplate() string {
	/*
			info := utils.Version()
			return fmt.Sprintf(`Version: %s
		Commit: %s
		Built: %s`, info.Version, info.CommitHash, info.BuildDate+"\n")
	*/
	return ""
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

	Formatter := new(logrus.TextFormatter)
	Formatter.TimestampFormat = "02-01-2006 15:04:05"
	Formatter.FullTimestamp = true
	logrus.SetFormatter(Formatter)
	logrus.SetLevel(logrus.InfoLevel)

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
	// config.InitDefaults()

	err := viper.ReadInConfig()
	if err == nil {
		return
	}
	if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
		panic(err)
	}

}

// Execute the root cobra command
func Execute() {
	rootCmd.SetVersionTemplate(VersionTemplate())
	rootCmd.AddCommand(newMigrateCmd(), newUserCmd(), newWebCmd())
	rootCmd.Execute()
}
