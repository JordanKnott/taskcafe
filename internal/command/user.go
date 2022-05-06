package command

import "github.com/spf13/cobra"

func newUserCmd() *cobra.Command {
	cc := cobra.Command{Use: "user"}
	cc.AddCommand(newUserListCmd(), newUserCreateCmd())
	return &cc
}
