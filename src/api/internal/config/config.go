package config

import "os"

type Config struct {
	Host                   string `env:"HOST,required"`
	Port                   string `env:"PORT,required"`
	DefaultOutputDirectory string `env:"DEFAULT_OUTPUT_DIRECTORY"`
	GeminiApiKey           string `env:"GEMINI_API_KEY,required"`
	GeminiModel            string `env:"GEMINI_MODEL,required"`
}

func GetConfig() *Config {
	return &Config{
		Host:                   os.Getenv("HOST"),
		Port:                   os.Getenv("PORT"),
		DefaultOutputDirectory: os.Getenv("DEFAULT_OUTPUT_DIRECTORY"),
		GeminiApiKey:           os.Getenv("GEMINI_API_KEY"),
		GeminiModel:            os.Getenv("GEMINI_MODEL"),
	}
}
