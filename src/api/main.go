package main

import (
	"context"
	_ "embed"
	"errors"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/jamesjohnson88/content-gopher/internal/config"
	"github.com/joho/godotenv"
)

//go:embed .version
var version string

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

	cfg := config.GetConfig()

	s := NewServer(cfg)
	httpServer := &http.Server{
		Addr:    net.JoinHostPort(cfg.Host, cfg.Port),
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
