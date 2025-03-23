package config

import (
	"errors"
	"os"
)

type Config struct {
	Port         string
	DBHost       string
	DBUser       string
	DBPassword   string
	DBName       string
	DBPort       string
	DBSSLMode    string
	JWTSecret    string
	OpenAIAPIKey string
}

// LoadConfig loads configuration from environment variables
func LoadConfig() (*Config, error) {
	cfg := Config{
		Port:         getEnv("PORT", "8080"),
		DBHost:       getEnv("DB_HOST", ""),
		DBUser:       getEnv("DB_USER", ""),
		DBPassword:   getEnv("DB_PASSWORD", ""),
		DBName:       getEnv("DB_NAME", ""),
		DBPort:       getEnv("DB_PORT", "5432"),
		DBSSLMode:    getEnv("DB_SSLMODE", "disable"),
		JWTSecret:    getEnv("JWT_SECRET", ""),
		OpenAIAPIKey: getEnv("OPENAI_API_KEY", ""),
	}

	if cfg.DBHost == "" || cfg.DBUser == "" || cfg.DBPassword == "" || cfg.DBName == "" {
		return nil, errors.New("missing required database configuration")
	}
	if cfg.JWTSecret == "" {
		return nil, errors.New("JWT_SECRET is required")
	}

	return &cfg, nil
}

// getEnv retrieves the value of the environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
