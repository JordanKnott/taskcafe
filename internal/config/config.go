package config

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/go-redis/redis/v8"

	mConfig "github.com/RichardKnop/machinery/v1/config"
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

	JobEnabled   = "job.enabled"
	JobBroker    = "job.broker"
	JobStore     = "job.store"
	JobQueueName = "job.queue_name"

	MessageQueue = "message.queue"

	SmtpFrom       = "smtp.from"
	SmtpHost       = "smtp.host"
	SmtpPort       = "smtp.port"
	SmtpUsername   = "smtp.username"
	SmtpPassword   = "smtp.password"
	SmtpSkipVerify = "false"
)

var defaults = map[string]interface{}{
	ServerHostname:          "0.0.0.0:3333",
	DatabaseHost:            "127.0.0.1",
	DatabaseName:            "taskcafe",
	DatabaseUser:            "taskcafe",
	DatabasePassword:        "taskcafe_test",
	DatabasePort:            "5432",
	DatabaseSslMode:         "disable",
	SecurityTokenExpiration: "15m",
	SecuritySecret:          "",
	MessageQueue:            "localhost:6379",
	JobEnabled:              false,
	JobBroker:               "redis://localhost:6379",
	JobStore:                "redis://localhost:6379",
	JobQueueName:            "taskcafe_tasks",
	SmtpFrom:                "no-reply@example.com",
	SmtpHost:                "localhost",
	SmtpPort:                "587",
	SmtpUsername:            "",
	SmtpPassword:            "",
	SmtpSkipVerify:          false,
}

func InitDefaults() {
	for key, value := range defaults {
		viper.SetDefault(key, value)
	}
}

type AppConfig struct {
	Email        EmailConfig
	Security     SecurityConfig
	Database     DatabaseConfig
	Job          JobConfig
	MessageQueue MessageQueueConfig
}

type MessageQueueConfig struct {
	URI string
}

type JobConfig struct {
	Enabled   bool
	Broker    string
	QueueName string
	Store     string
}

func GetJobConfig() JobConfig {
	return JobConfig{
		Enabled:   viper.GetBool(JobEnabled),
		Broker:    viper.GetString(JobBroker),
		QueueName: viper.GetString(JobQueueName),
		Store:     viper.GetString(JobStore),
	}
}

func (cfg *JobConfig) GetJobConfig() mConfig.Config {
	return mConfig.Config{
		Broker:        cfg.Broker,
		DefaultQueue:  cfg.QueueName,
		ResultBackend: cfg.Store,
		/*
			AMQP: &mConfig.AMQPConfig{
				Exchange:     "machinery_exchange",
				ExchangeType: "direct",
				BindingKey:   "machinery_task",
			} */
	}
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

type DatabaseConfig struct {
	Host     string
	Port     string
	Name     string
	Username string
	Password string
	SslMode  string
}

func (cfg DatabaseConfig) GetDatabaseConnectionUri() string {
	connection := fmt.Sprintf("user=%s password=%s host=%s dbname=%s port=%s sslmode=%s",
		cfg.Username,
		cfg.Password,
		cfg.Host,
		cfg.Name,
		cfg.Port,
		cfg.SslMode,
	)
	return connection
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
	jobCfg := GetJobConfig()
	databaseCfg := GetDatabaseConfig()
	emailCfg := GetEmailConfig()
	messageCfg := MessageQueueConfig{URI: viper.GetString("message.queue")}
	return AppConfig{
		Email:        emailCfg,
		Security:     securityCfg,
		Database:     databaseCfg,
		Job:          jobCfg,
		MessageQueue: messageCfg,
	}, err
}

func GetSecurityConfig(accessTokenExp string, secret []byte) (SecurityConfig, error) {
	exp, err := time.ParseDuration(accessTokenExp)
	if err != nil {
		log.WithError(err).Error("issue parsing duration")
		return SecurityConfig{}, err
	}
	return SecurityConfig{AccessTokenExpiration: exp, Secret: secret}, nil
}

func (c MessageQueueConfig) GetMessageQueueClient() (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Addr: c.URI,
	})

	_, err := client.Ping(context.Background()).Result()
	if !errors.Is(err, nil) {
		return nil, err
	}

	return client, nil
}

func GetEmailConfig() EmailConfig {
	return EmailConfig{
		From:               viper.GetString(SmtpFrom),
		Host:               viper.GetString(SmtpHost),
		Port:               viper.GetInt(SmtpPort),
		Username:           viper.GetString(SmtpUsername),
		Password:           viper.GetString(SmtpPassword),
		InsecureSkipVerify: viper.GetBool(SmtpSkipVerify),
	}
}

func GetDatabaseConfig() DatabaseConfig {
	return DatabaseConfig{
		Username: viper.GetString(DatabaseUser),
		Password: viper.GetString(DatabasePassword),
		Port:     viper.GetString(DatabasePort),
		SslMode:  viper.GetString(DatabaseSslMode),
		Name:     viper.GetString(DatabaseName),
		Host:     viper.GetString(DatabaseHost),
	}
}
