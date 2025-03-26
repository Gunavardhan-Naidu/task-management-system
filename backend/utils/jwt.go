package utils

import (
	"os"
	"strings"
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
	jwtSecret := strings.TrimSpace(os.Getenv("JWT_SECRET"))
	return token.SignedString([]byte(jwtSecret))
}
