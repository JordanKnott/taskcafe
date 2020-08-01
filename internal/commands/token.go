package commands

import (
	"fmt"
	"time"

	"github.com/jordanknott/taskcafe/internal/auth"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

func newTokenCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "token",
		Short: "Create a long lived JWT token for dev purposes",
		Long:  "Create a long lived JWT token for dev purposes",
		Args:  cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			token, err := auth.NewAccessTokenCustomExpiration(args[0], time.Hour*24)
			if err != nil {
				log.WithError(err).Error("issue while creating access token")
				return
			}
			fmt.Println(token)
		},
	}
}
