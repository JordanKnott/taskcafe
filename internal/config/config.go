package config

import (
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

const (
	ServerHostname   = "server.hostname"
	DatabaseHost     = "database.host"
	DatabaseName     = "database.name"
	DatabaseUser     = "database.user"
	DatabasePassword = "database.password"
	DatabasePort     = "database.port"
	DatabaseSslMode  = "database.sslmode"

	SecurityTokenExpiration = "security.token_expiration"
	SecuritySecret          = "security.secret"

	QueueBroker = "queue.broker"
	QueueStore  = "queue.store"

	SmtpFrom       = "smtp.from"
	SmtpHost       = "smtp.host"
	SmtpPort       = "smtp.port"
	SmtpUsername   = "smtp.username"
	SmtpPassword   = "smtp.password"
	SmtpSkipVerify = "false"
)

var defaults = map[string]string{
	ServerHostname:          "0.0.0.0:3333",
	DatabaseHost:            "127.0.0.1",
	DatabaseName:            "taskcafe",
	DatabaseUser:            "taskcafe",
	DatabasePassword:        "taskcafe_test",
	DatabasePort:            "5432",
	DatabaseSslMode:         "disable",
	SecurityTokenExpiration: "15m",
	SecuritySecret:          "",
	QueueBroker:             "amqp://guest:guest@localhost:5672/",
	QueueStore:              "memcache://localhost:11211",
	SmtpFrom:                "no-reply@example.com",
	SmtpHost:                "localhost",
	SmtpPort:                "587",
	SmtpUsername:            "",
	SmtpPassword:            "",
	SmtpSkipVerify:          "false",
}

func InitDefaults() {
	for key, value := range defaults {
		viper.SetDefault(key, value)
	}
}

func GetDatabaseConnectionUri() string {
	connection := fmt.Sprintf("user=%s password=%s host=%s dbname=%s port=%s sslmode=%s",
		viper.GetString(DatabaseUser),
		viper.GetString(DatabasePassword),
		viper.GetString(DatabaseHost),
		viper.GetString(DatabaseName),
		viper.GetString(DatabasePort),
		viper.GetString(DatabaseSslMode),
	)
	return connection
}

type AppConfig struct {
	Email    EmailConfig
	Security SecurityConfig
}

type EmailConfig struct {
	Host               string
	Port               int
	From               string
	Username           string
	Password           string
	SiteURL            string
	InsecureSkipVerify bool
}

type SecurityConfig struct {
	AccessTokenExpiration time.Duration
	Secret                []byte
}

func GetAppConfig() (AppConfig, error) {
	secret := viper.GetString(SecuritySecret)
	if strings.TrimSpace(secret) == "" {
		log.Warn("server.secret is not set, generating a random secret")
		secret = uuid.New().String()
	}
	securityCfg, err := GetSecurityConfig(viper.GetString(SecurityTokenExpiration), []byte(secret))
	if err != nil {
		return AppConfig{}, err
	}
	emailCfg := GetEmailConfig()
	return AppConfig{
		Email:    emailCfg,
		Security: securityCfg,
	}, nil
}

func GetSecurityConfig(accessTokenExp string, secret []byte) (SecurityConfig, error) {
	exp, err := time.ParseDuration(accessTokenExp)
	if err != nil {
		log.WithError(err).Error("issue parsing duration")
		return SecurityConfig{}, err
	}
	return SecurityConfig{AccessTokenExpiration: exp, Secret: secret}, nil
}

func GetEmailConfig() EmailConfig {
	return EmailConfig{
		From:               viper.GetString("smtp.from"),
		Host:               viper.GetString("smtp.host"),
		Port:               viper.GetInt("smtp.port"),
		Username:           viper.GetString("smtp.username"),
		Password:           viper.GetString("smtp.password"),
		InsecureSkipVerify: viper.GetBool("smtp.skip_verify"),
	}
}
