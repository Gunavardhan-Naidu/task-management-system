package utils

import (
	"context"
	"os"

	"github.com/sashabaranov/go-openai"
)

// GenerateTaskSuggestions takes a prompt and returns AI-generated task suggestions.
func GenerateTaskSuggestions(prompt string) (string, error) {
	// Create a new OpenAI client
	client := openai.NewClient(os.Getenv("OPENAI_API_KEY"))

	// Create a chat completion request
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
		},
	)

	if err != nil {
		return "", err
	}

	// Return the AI-generated response
	return resp.Choices[0].Message.Content, nil
}
