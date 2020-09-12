package auth

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	log "github.com/sirupsen/logrus"
)

// RestrictedMode is used restrict JWT access to just the install route
type RestrictedMode string

const (
	// Unrestricted is the code to allow access to all routes
	Unrestricted RestrictedMode = "unrestricted"
	// InstallOnly is the code to restrict access ONLY to install route
	InstallOnly = "install_only"
)

// Role is the role code for the user
type Role string

const (
	// RoleAdmin is the code for the admin role
	RoleAdmin Role = "admin"
	// RoleMember is the code for the member role
	RoleMember Role = "member"
)

// AccessTokenClaims is the claims the access JWT token contains
type AccessTokenClaims struct {
	UserID     string         `json:"userId"`
	Restricted RestrictedMode `json:"restricted"`
	OrgRole    Role           `json:"orgRole"`
	jwt.StandardClaims
}

// ErrExpiredToken is the error returned if the token has expired
type ErrExpiredToken struct{}

// Error returns the error message for ErrExpiredToken
func (r *ErrExpiredToken) Error() string {
	return "token is expired"
}

// ErrMalformedToken is the error returned if the token has malformed
type ErrMalformedToken struct{}

// Error returns the error message for ErrMalformedToken
func (r *ErrMalformedToken) Error() string {
	return "token is malformed"
}

// NewAccessToken generates a new JWT access token with the correct claims
func NewAccessToken(userID string, restrictedMode RestrictedMode, orgRole string, jwtKey []byte) (string, error) {
	role := RoleMember
	if orgRole == "admin" {
		role = RoleAdmin
	}
	accessExpirationTime := time.Now().Add(5 * time.Second)
	accessClaims := &AccessTokenClaims{
		UserID:         userID,
		Restricted:     restrictedMode,
		OrgRole:        role,
		StandardClaims: jwt.StandardClaims{ExpiresAt: accessExpirationTime.Unix()},
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenString, err := accessToken.SignedString(jwtKey)
	if err != nil {
		return "", err
	}
	return accessTokenString, nil
}

// NewAccessTokenCustomExpiration creates an access token with a custom duration
func NewAccessTokenCustomExpiration(userID string, dur time.Duration, jwtKey []byte) (string, error) {
	accessExpirationTime := time.Now().Add(dur)
	accessClaims := &AccessTokenClaims{
		UserID:         userID,
		Restricted:     Unrestricted,
		OrgRole:        RoleMember,
		StandardClaims: jwt.StandardClaims{ExpiresAt: accessExpirationTime.Unix()},
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenString, err := accessToken.SignedString(jwtKey)
	if err != nil {
		return "", err
	}
	return accessTokenString, nil
}

// ValidateAccessToken validates a JWT access token and returns the contained claims or an error if it's invalid
func ValidateAccessToken(accessTokenString string, jwtKey []byte) (AccessTokenClaims, error) {
	accessClaims := &AccessTokenClaims{}
	accessToken, err := jwt.ParseWithClaims(accessTokenString, accessClaims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil {
		return *accessClaims, nil
	}

	if accessToken.Valid {
		log.WithFields(log.Fields{
			"token":        accessTokenString,
			"timeToExpire": time.Unix(accessClaims.ExpiresAt, 0),
		}).Debug("token is valid")
		return *accessClaims, nil
	}

	if ve, ok := err.(*jwt.ValidationError); ok {
		if ve.Errors&jwt.ValidationErrorMalformed != 0 {
			return AccessTokenClaims{}, &ErrMalformedToken{}
		} else if ve.Errors&(jwt.ValidationErrorExpired|jwt.ValidationErrorNotValidYet) != 0 {
			return AccessTokenClaims{}, &ErrExpiredToken{}
		}
	}
	return AccessTokenClaims{}, err
}
