package commands

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/jordanknott/taskcafe/internal/auth"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

func newTokenCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "token",
		Short: "Create a long lived JWT token for dev purposes",
		Long:  "Create a long lived JWT token for dev purposes",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			secret := viper.GetString("server.secret")
			if strings.TrimSpace(secret) == "" {
				return errors.New("server.secret must be set (TASKCAFE_SERVER_SECRET)")
			}
			token, err := auth.NewAccessTokenCustomExpiration(args[0], time.Hour*24, []byte(secret))
			if err != nil {
				log.WithError(err).Error("issue while creating access token")
				return err
			}
			fmt.Println(token)
			return nil
		},
	}
}
