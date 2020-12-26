package auth

import (
	"testing"
	"time"

	"github.com/dgrijalva/jwt-go"
)

// Override time value for jwt tests.  Restore default value after.
func at(t time.Time, f func()) {
	jwt.TimeFunc = func() time.Time {
		return t
	}
	f()
	jwt.TimeFunc = time.Now
}

func TestAuth_ValidateAccessToken(t *testing.T) {
	expectedToken := AccessTokenClaims{
		UserID:         "1234",
		Restricted:     "unrestricted",
		OrgRole:        "member",
		StandardClaims: jwt.StandardClaims{ExpiresAt: 1000},
	}
	// jwt with the claims of expectedToken signed by secretKey
	jwtString := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0IiwicmVzdHJpY3RlZCI6InVucmVzdHJpY3RlZCIsIm9yZ1JvbGUiOiJtZW1iZXIiLCJleHAiOjEwMDB9.Zc4mrnogDccYffA7dWogdWsZMELftQluh2X5xDyzOpA"
	secretKey := []byte("secret")

	// Check that decrypt failure is detected
	token, err := ValidateAccessToken(jwtString, []byte("incorrectSecret"))
	if err == nil {
		t.Errorf("[IncorrectKey] Expected an error when validating a token with the incorrect key, instead got token %v", token)
	} else if _, ok := err.(*ErrMalformedToken); !ok {
		t.Errorf("[IncorrectKey] Expected an ErrMalformedToken error when validating a token with the incorrect key, instead got error %T:%v", err, err)
	}

	// Check that token expiration check works
	token, err = ValidateAccessToken(jwtString, secretKey)
	if err == nil {
		t.Errorf("[TokenExpired] Expected an error when validating an expired token, instead got token %v", token)
	} else if _, ok := err.(*ErrExpiredToken); !ok {
		t.Errorf("[TokenExpired] Expected an ErrExpiredToken error when validating an expired token, instead got error %T:%v", err, err)
	}
	
	// Check that token validation works with a valid token
	// Set the time to be valid for the token expiration
	at(time.Unix(500, 0), func() {
		token, err = ValidateAccessToken(jwtString, secretKey)
		if err != nil {
			t.Errorf("[TokenValid] Expected no errors when validating token, instead got err %v", err)
		} else if token != expectedToken {
			t.Errorf("[TokenValid] Expected token with claims %v but instead had claims %v", expectedToken, token)
		}
	})
}