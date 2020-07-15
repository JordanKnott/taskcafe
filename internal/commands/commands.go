package commands

import (
	"fmt"
	"github.com/spf13/cobra"
)

const CitadelConfDirEnvName = "CITADEL_CONFIG_DIR"

const CitadelAppConf = "citadel"

const mainDescription = `citadel is an open soure project management
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

var rootCmd = &cobra.Command{
	Use:     "citadel",
	Long:    mainDescription,
	Version: version,
}

func Execute() {
	rootCmd.SetVersionTemplate(versionTemplate)
	rootCmd.AddCommand(newWebCmd(), newMigrateCmd())
	rootCmd.Execute()
}
