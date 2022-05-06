package util

import (
	"crypto/rand"
	"encoding/hex"
)

func GenerateAccessToken() (string, error) {
  b := make([]byte, 128)
  if _, err := rand.Read(b); err != nil {
    return "", err
  }
  return hex.EncodeToString(b), nil
}
