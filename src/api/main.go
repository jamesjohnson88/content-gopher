package main

import (
	"context"
	_ "embed"
	"errors"
	"fmt"
	"github.com/joho/godotenv"
	"log/slog"
	"net"
	"net/http"
	"os"
	"sync"
	"time"
)

//go:embed .version
var version string

type Config struct {
	Host         string `env:"HOST,required"`
	Port         string `env:"PORT,required"`
	GeminiApiKey string `env:"GEMINI_API_KEY,required"`
	GeminiModel  string `env:"GEMINI_MODEL,required"`
}

func main() {
	println("Content Gopher: version", version)
	if err := run(); err != nil {
		_, _ = fmt.Fprintf(os.Stderr, "%s\n", err)
		os.Exit(1)
	}
	println("Content Gopher shutting down...")
}

func run() error {
	ctx := context.Background()

	logOpts := &slog.HandlerOptions{
		AddSource: true,
	}
	logger := slog.New(slog.NewJSONHandler(os.Stderr, logOpts))
	slog.SetDefault(logger)

	err := godotenv.Load()
	if err != nil {
		slog.Error("env_load_error",
			slog.String("err", err.Error()),
		)
	}

	// todo - may want a cache depending on IO performance

	config := Config{
		Host:         os.Getenv("HOST"),
		Port:         os.Getenv("PORT"),
		GeminiApiKey: os.Getenv("GEMINI_API_KEY"),
		GeminiModel:  os.Getenv("GEMINI_MODEL"),
	}

	// reg in client?
	//geminiClient, err := genai.NewClient(ctx, option.WithAPIKey(config.GeminiApiKey))
	//if err != nil {
	//	log.Fatal(err)
	//}
	//defer geminiClient.Close()
	//genModel := geminiClient.GenerativeModel(config.GeminiModel)
	s := NewServer(&config)
	httpServer := &http.Server{
		Addr:    net.JoinHostPort(config.Host, config.Port),
		Handler: s,
	}

	go func() {
		slog.Info("server",
			slog.Bool("started", true),
			slog.String("version", version),
			slog.String("addr", httpServer.Addr),
		)
		if lsErr := httpServer.ListenAndServe(); lsErr != nil && !errors.Is(lsErr, http.ErrServerClosed) {
			slog.Error("server_error",
				slog.String("err", lsErr.Error()),
			)
		}
	}()

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		<-ctx.Done()
		shutdownCtx := context.Background()
		shutdownCtx, cancel := context.WithTimeout(shutdownCtx, 10*time.Second)
		defer cancel()
		if sdErr := httpServer.Shutdown(shutdownCtx); sdErr != nil {
			slog.ErrorContext(
				shutdownCtx,
				"shutdown_error",
				slog.String("err", sdErr.Error()),
			)
		}
	}()

	wg.Wait() // ensure all goroutines complete before exiting
	return nil
}
