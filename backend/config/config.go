package config

import (
	"os"
)

type Config struct {
	Port         string
	DatabaseURL  string
	JWTSecret    string
	OpenAIAPIKey string
}

// LoadConfig loads configuration from environment variables
func LoadConfig() *Config {
	return &Config{
		Port:         getEnv("PORT", "8080"),
		DatabaseURL:  getEnv("DATABASE_URL", "host=localhost user=guna password=admin dbname=taskmanager port=5432 sslmode=disable"),
		JWTSecret:    getEnv("JWT_SECRET", "your_secret_key"),
		OpenAIAPIKey: getEnv("OPENAI_API_KEY", ""),
	}
}

// getEnv retrieves the value of the environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
