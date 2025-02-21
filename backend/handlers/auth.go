package handlers

import (
	"log"
	"task-management-system/database"
	"task-management-system/models"
	"task-management-system/utils"

	"fmt"
	"net/http"

	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func Register(c *fiber.Ctx) error {
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// // Hash the password before storing it
	// hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	// if err != nil {
	// 	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not hash password"})
	// }
	// user.Password = string(hashedPassword)

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
	if input.Username == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Username cannot be empty"})
	}
	if input.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Password cannot be empty"})
	}
	input.Username = strings.TrimSpace(input.Username)
	input.Password = strings.TrimSpace(input.Password)

	// Log the login attempt
	log.Printf("Attempting to log in user: %s", input.Username)
	// Find the user by username
	if err := database.DB.Where("username = ?", input.Username).First(&input).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid username"})
	}

	log.Printf("Retrieved password for user %s: %s", user.Username, user.Password)
	// // Compare the password
	if user.Password != input.Password {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid username or password"})
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(input)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not generate token"})
	}

	return c.JSON(fiber.Map{"token": token})
}

func JWTMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		tokenString := c.Get("Authorization")
		if tokenString == "" {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "Missing or invalid token"})
		}

		// Parse the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validate the token's signing method etc.
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte("your_secret_key"), nil // Replace with your actual secret key
		})

		if err != nil || !token.Valid {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
		}

		// Token is valid, proceed to the next handler
		return c.Next()
	}
}
