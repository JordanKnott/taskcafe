package jobs

import (
	log "github.com/sirupsen/logrus"
)

// MachineryLogger is a customer logger for machinery worker
type MachineryLogger struct{}

// Print sends to logrus.Info
func (m *MachineryLogger) Print(args ...interface{}) {
	log.Info(args...)
}

// Printf sends to logrus.Infof
func (m *MachineryLogger) Printf(format string, args ...interface{}) {
	log.Infof(format, args...)
}

// Println sends to logrus.Info
func (m *MachineryLogger) Println(args ...interface{}) {
	log.Info(args...)
}

// Fatal sends to logrus.Fatal
func (m *MachineryLogger) Fatal(args ...interface{}) {
	log.Fatal(args...)
}

// Fatalf sends to logrus.Fatalf
func (m *MachineryLogger) Fatalf(format string, args ...interface{}) {
	log.Fatalf(format, args...)
}

// Fatalln sends to logrus.Fatal
func (m *MachineryLogger) Fatalln(args ...interface{}) {
	log.Fatal(args...)
}

// Panic sends to logrus.Panic
func (m *MachineryLogger) Panic(args ...interface{}) {
	log.Panic(args...)
}

// Panicf sends to logrus.Panic
func (m *MachineryLogger) Panicf(format string, args ...interface{}) {
	log.Panic(args...)
}

// Panicln sends to logrus.Panic
func (m *MachineryLogger) Panicln(args ...interface{}) {
	log.Panic(args...)
}
