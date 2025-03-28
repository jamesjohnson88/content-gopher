package main

import (
	"context"
	"github.com/google/generative-ai-go/genai"
	"github.com/jamesjohnson88/content-gopher/handlers/sessions"
	"github.com/jamesjohnson88/content-gopher/internal/middleware"
	"google.golang.org/api/option"
	"log"
	"net/http"
)

func NewServer(cfg *Config) http.Handler {
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

func addRoutes(mux *http.ServeMux, cfg *Config, client *genai.Client) {
	// check what files are available in the working directory that the user can build upon
	// or choose to start a new one
	mux.Handle("GET /api/sessions", http.NotFoundHandler())

	mux.Handle("GET /api/sessions/options", sessions.NewSessionOptionsHandler())

	// begin new sessions - specify type, params, etc.
	mux.Handle("POST /api/sessions", sessions.NewSessionHandler())
	// update session
	mux.Handle("PUT /api/sessions", http.NotFoundHandler())

	// request content from AI model
	mux.Handle("GET /api/multi-choice", http.NotFoundHandler())
	// update a single multi choice question
	mux.Handle("PATCH /api/multi-choice", http.NotFoundHandler())
}
