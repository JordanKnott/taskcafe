package router

import (
	"github.com/dgrijalva/jwt-go"
)

type AccessTokenClaims struct {
	UserID string `json:"userId"`
	jwt.StandardClaims
}

type RefreshTokenClaims struct {
	UserID string `json:"userId"`
	jwt.StandardClaims
}

type LoginRequestData struct {
	Username string
	Password string
}

type LoginResponseData struct {
	AccessToken string `json:"accessToken"`
}

type LogoutResponseData struct {
	Status string `json:"status"`
}

type RefreshTokenResponseData struct {
	AccessToken string `json:"accessToken"`
}

type AvatarUploadResponseData struct {
	UserID string `json:"userID"`
	URL    string `json:"url"`
}
