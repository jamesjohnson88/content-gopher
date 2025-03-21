package main

import (
	"bufio"
	"context"
	"fmt"
	"github.com/google/generative-ai-go/genai"
	"github.com/jamesjohnson88/content-gopher/application/content_types/multiple_choice_question"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
	"log"
	"os"
	"strings"
)

type Config struct {
	GeminiApiKey string `env:"GEMINI_API_KEY,required"`
	GeminiModel  string `env:"GEMINI_MODEL,required"`
}

func main() {
	ctx := context.Background()

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	config := Config{
		GeminiApiKey: os.Getenv("GEMINI_API_KEY"),
		GeminiModel:  os.Getenv("GEMINI_MODEL"),
	}

	geminiClient, err := genai.NewClient(ctx, option.WithAPIKey(config.GeminiApiKey))
	if err != nil {
		log.Fatal(err)
	}
	defer geminiClient.Close()

	genModel := geminiClient.GenerativeModel(config.GeminiModel)

	reader := bufio.NewReader(os.Stdin)
	fmt.Println("Content Gopher x AI Slop")
	fmt.Println("--------------------------")

	for {
		displayInputChoices()
		fmt.Print("> ")
		input, ioErr := reader.ReadString('\n')
		if ioErr != nil {
			fmt.Fprintln(os.Stderr, "Error reading input:", ioErr)
			continue
		}

		switch in := strings.TrimSpace(strings.ToLower(input)); in {
		case "multi":
			multiple_choice_question.Handle(genModel)
			continue
		case "q", "quit":
			fmt.Println("Exiting...")
			os.Exit(0)
		default:
			fmt.Println("Invalid choice, please try again.")
		}
	}
}

func displayInputChoices() {
	fmt.Println("\nSelect content type:")
	fmt.Println("* Enter 'multi' to create multiple choice question content")
	fmt.Println("* Enter 'q' or 'quit' to exit\n")
}
