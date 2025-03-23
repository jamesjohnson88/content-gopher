package main

import (
	"github.com/jamesjohnson88/content-gopher/middleware"
	"net/http"
)

func NewServer(cfg *Config) http.Handler {
	mux := http.NewServeMux()
	addRoutes(mux, cfg)
	handler := middleware.LoggingMiddleware(mux)
	return handler
}

func addRoutes(mux *http.ServeMux, cfg *Config) {
	// check what files are available in the working directory that the user can build upon
	// or choose to start a new one
	mux.Handle("GET /api/sessions", http.NotFoundHandler())

	// begin new sessions - specify type, params, etc.
	mux.Handle("POST /api/sessions", http.NotFoundHandler())
	// update session
	mux.Handle("PUT /api/sessions", http.NotFoundHandler())

	// request content from model
	mux.Handle("GET /api/sessions/{id}/content", http.NotFoundHandler())

}
