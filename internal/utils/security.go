package utils

import (
	"time"

	log "github.com/sirupsen/logrus"
)

type SecurityConfig struct {
	AccessTokenExpiration time.Duration
	Secret                []byte
	UserAuthHeader        string
}

func (c SecurityConfig) IsRemoteAuth() bool {
	return c.UserAuthHeader != ""
}

func GetSecurityConfig(accessTokenExp string, secret []byte) (SecurityConfig, error) {
	exp, err := time.ParseDuration(accessTokenExp)
	if err != nil {
		log.WithError(err).Error("issue parsing duration")
		return SecurityConfig{}, err
	}
	return SecurityConfig{AccessTokenExpiration: exp, Secret: secret}, nil
}
