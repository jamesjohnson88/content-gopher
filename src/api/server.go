package main

import (
	"context"
	"github.com/google/generative-ai-go/genai"
	mcq "github.com/jamesjohnson88/content-gopher/handlers/content_types/multiple_choice_question"
	"github.com/jamesjohnson88/content-gopher/handlers/sessions"
	"github.com/jamesjohnson88/content-gopher/internal/config"
	"github.com/jamesjohnson88/content-gopher/internal/middleware"
	"google.golang.org/api/option"
	"log"
	"net/http"
)

// todo - pass a ctx to allow for server cleanup? overkill?
func NewServer(cfg *config.Config) http.Handler {
	mux := http.NewServeMux()

	geminiClient, err := genai.NewClient(context.Background(), option.WithAPIKey(cfg.GeminiApiKey))
	if err != nil {
		log.Fatal(err)
	}
	defer geminiClient.Close()

	addRoutes(
		mux,
		cfg,
		geminiClient)

	handler := middleware.LoggingMiddleware(mux)
	handler = middleware.CorsMiddleware(handler)

	return handler
}

func addRoutes(mux *http.ServeMux, cfg *config.Config, geminiClient *genai.Client) {
	// check what files are available in the working directory that the user can build upon
	// or choose to start a new one
	mux.Handle("GET /api/sessions", http.NotFoundHandler())
	// begin new sessions - specify type, params, etc.
	mux.Handle("POST /api/sessions", sessions.NewSessionHandler(cfg))
	// update session
	mux.Handle("PUT /api/sessions", http.NotFoundHandler())

	// provide the available options for creating sessions
	mux.Handle("GET /api/sessions/options", sessions.NewSessionOptionsHandler())

	// multiple choice question session
	mux.Handle("GET /api/content/multiple-choice-question", mcq.NewMultipleChoiceContentHandler(cfg, geminiClient))
}
