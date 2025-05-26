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
)

//go:embed .version
var version string

const (
	componentNameMain = "main"
)

func main() {
	println("Content Gopher: version", version)
	if err := run(); err != nil {
		_, _ = fmt.Fprintf(os.Stderr, "%s\n", err)
		os.Exit(1)
	}
	println("Content Gopher shutting down...")
}

func run() error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	logOpts := &slog.HandlerOptions{
		AddSource: true,
	}
	logger := slog.New(slog.NewJSONHandler(os.Stderr, logOpts))
	slog.SetDefault(logger)

	cfg, err := config.LoadConfig(ctx)
	if err != nil {
		return fmt.Errorf("failed to load config: %w", err)
	}

	s := NewServer(cfg)
	httpServer := &http.Server{
		Addr:    net.JoinHostPort(cfg.Host, cfg.Port),
		Handler: s,
	}

	serverCtx, serverCancel := context.WithCancel(ctx)
	defer serverCancel()

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		slog.Info("server",
			slog.Bool("started", true),
			slog.String("version", version),
			slog.String("addr", httpServer.Addr),
			slog.String("component", componentNameMain),
		)
		if lsErr := httpServer.ListenAndServe(); lsErr != nil && !errors.Is(lsErr, http.ErrServerClosed) {
			slog.Error("server_error",
				slog.String("err", lsErr.Error()),
				slog.String("component", componentNameMain),
			)
			serverCancel()
		}
	}()

	<-serverCtx.Done()

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()

	if sdErr := httpServer.Shutdown(shutdownCtx); sdErr != nil {
		slog.Error("shutdown_error",
			slog.String("err", sdErr.Error()),
			slog.String("component", componentNameMain),
		)
	}

	wg.Wait()
	return nil
}
