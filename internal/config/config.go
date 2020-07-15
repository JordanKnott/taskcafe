package config

import (
	"github.com/BurntSushi/toml"
	"io/ioutil"
)

type Database struct {
	Host     string
	Name     string
	User     string
	Password string
}

type General struct {
	Host string
}

type EmailNotifications struct {
	Enabled     bool
	DisplayName string `toml:"display_name"`
	FromAddress string `toml:"from_address"`
}

type Storage struct {
	StorageSystem string `toml:"local_storage"`
	UploadDirPath string `toml:"upload_dir_path"`
}

type Smtp struct {
	Username           string
	Password           string
	Server             string
	Port               int
	ConnectionSecurity string `toml:"connection_security"`
}

type AppConfig struct {
	General            General
	Database           Database
	EmailNotifications EmailNotifications `toml:"email_notifications"`
	Storage            Storage
	Smtp               Smtp
}

func LoadConfig(path string) (AppConfig, error) {
	dat, err := ioutil.ReadFile("conf/app.toml")
	if err != nil {
		return AppConfig{}, err
	}

	var appConfig AppConfig
	_, err = toml.Decode(string(dat), &appConfig)
	if err != nil {
		return AppConfig{}, err
	}
	return appConfig, nil
}
