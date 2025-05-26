package config

import (
	"context"
	"fmt"

	"github.com/caarlos0/env/v6"
)

type Config struct {
	ServiceName            string `env:"SERVICE_NAME" envDefault:"content-gopher"`
	Environment            string `env:"ENVIRONMENT" envDefault:"development"`
	Host                   string `env:"HOST,required"`
	Port                   string `env:"PORT,required"`
	DefaultOutputDirectory string `env:"DEFAULT_OUTPUT_DIRECTORY"`
	GeminiApiKey           string `env:"GEMINI_API_KEY,required"`
	GeminiModel            string `env:"GEMINI_MODEL,required"`
}

func LoadConfig(ctx context.Context) (*Config, error) {
	cfg := &Config{}
	if err := env.Parse(cfg); err != nil {
		return nil, fmt.Errorf("failed to parse env vars into valid config: %w", err)
	}
	return cfg, nil
}
