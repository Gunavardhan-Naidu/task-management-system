package handlers

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"task-management-system/database"
	"task-management-system/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

const (
	TokenExpiration = time.Hour * 24
)

var JWTSecret = os.Getenv("JWT_SECRET")

func Register(c *fiber.Ctx) error {
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}
	// Validate email
	if user.Email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Email cannot be empty"})
	}

	// Hash the password before storing it
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not hash password"})
	}
	user.Password = string(hashedPassword)

	if user.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Password cannot be empty"})
	}

	// Save the user to the database
	if err := database.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create user"})
	}
	return c.JSON(fiber.Map{"status": "user registered"})
}

func Login(c *fiber.Ctx) error {
	var user models.User
	var input models.User
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}
	if input.Username == "" && input.Email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Username or email cannot be empty"})
	}
	if input.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Password cannot be empty"})
	}
	input.Username = strings.TrimSpace(input.Username)
	input.Email = strings.TrimSpace(input.Email)
	input.Password = strings.TrimSpace(input.Password)

	// Log the login attempt
	log.Printf("Attempting to log in user: %s", input.Username)

	// Find the user by username or email
	query := database.DB
	if input.Username != "" {
		query = query.Where("username = ?", input.Username)
	} else {
		query = query.Where("email = ?", input.Email)
	}

	if err := query.First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid username or email"})
	}

	log.Printf("Retrieved password for user %s: %s", user.Username, user.Password)
	// // Compare the password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid password"})
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID":   user.ID,
		"username": user.Username,
		"exp":      time.Now().Add(TokenExpiration).Unix(),
	})

	tokenString, err := token.SignedString([]byte(JWTSecret))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not generate token"})
	}

	return c.JSON(fiber.Map{
		"token": tokenString,
		"user": fiber.Map{
			"id":       user.ID,
			"username": user.Username,
		},
	})
}

func JWTMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		tokenString := c.Get("Authorization")
		if tokenString == "" {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "Authorization header is required"})
		}

		// Remove "Bearer " prefix if present
		if len(tokenString) > 7 && strings.ToUpper(tokenString[0:7]) == "BEARER " {
			tokenString = tokenString[7:]
		}

		// Parse the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Check signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}

			// Check if JWTSecret is set
			if JWTSecret == "" {
				return nil, fmt.Errorf("JWT secret is not configured")
			}

			return []byte(JWTSecret), nil
		})

		// // Handle token parsing errors
		// if err != nil {
		// 	if errors.Is(err, jwt.ErrTokenMalformed) {
		// 		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "Malformed token"})
		// 	} else if errors.Is(err, jwt.ErrTokenExpired) || errors.Is(err, jwt.ErrTokenNotValidYet) {
		// 		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "Token is expired"})
		// 	}
		// }
		// if !token.Valid {
		// 	return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
		// }
		if err != nil {
			log.Println("Token parsing error:", err)
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "hello token"})
		}

		// Add user info to context
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			// Validate required claims
			if claims["userID"] == nil || claims["username"] == nil {
				return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token claims"})
			}

			c.Locals("userID", claims["userID"])
			c.Locals("username", claims["username"])
		} else {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token claims"})
		}

		return c.Next()
	}
}
