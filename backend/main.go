package main

import (
	"fmt"
	"log"
	"path/filepath"
	"task-management-system/config"
	"task-management-system/database"
	"task-management-system/handlers"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/websocket/v2"
	"github.com/joho/godotenv"
)

func main() {
	// // Load .env file
	// err := godotenv.Load()
	// if err != nil {
	// 	log.Fatal("Error loading .env file")
	// }

	// Load .env file from the project root
	envPath := filepath.Join("..", ".env")
	log.Println("Loading .env from:", envPath)

	err := godotenv.Load(envPath)
	if err != nil {
		log.Fatal("Error loading .env file:", err)
	}
	app := fiber.New()

	// Enable CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",                    // Allow requests from your frontend
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",              // Allow these HTTP methods
		AllowHeaders: "Origin,Content-Type,Accept,Authorization", // Allow these headers
	}))

	// Initialize database
	database.Connect()

	//Auth routes
	app.Post("/auth/register", handlers.Register)
	app.Post("/auth/login", handlers.Login)

	// JWT Middleware
	protectedRoutes := app.Group("/tasks")        // Create a group for task routes
	protectedRoutes.Use(handlers.JWTMiddleware()) // Apply JWT middleware to this group

	// WebSocket endpoint
	protectedRoutes.Get("/ws", websocket.New(handlers.HandleWebSocket))

	// Task routes
	protectedRoutes.Post("/tasks", handlers.CreateTask)       // Create a new task
	protectedRoutes.Get("/tasks", handlers.GetTasks)          // Get all tasks
	protectedRoutes.Put("/tasks/:id", handlers.UpdateTask)    // Update a task by ID
	protectedRoutes.Delete("/tasks/:id", handlers.DeleteTask) // Delete a task by ID

	// Start server
	cfg, err := config.LoadConfig()
	if err != nil {
		panic(err)
	}
	fmt.Println("Starting server on port:", cfg.Port)
	app.Listen(":8080")
}
