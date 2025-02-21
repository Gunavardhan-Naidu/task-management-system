package utils

import (
	"task-management-system/models"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateJWT(user models.User) (string, error) {
	claims := jwt.MapClaims{
		"id":  user.ID,
		"exp": time.Now().Add(time.Hour * 72).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte("your_secret_key"))
}
