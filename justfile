# Set PowerShell as the shell with COMPOSE_BAKE enabled
set shell := ["powershell", "-Command", "$env:COMPOSE_BAKE='true';"]

# Default recipe to run when just is called without arguments
default:
    @just --list

# Start the API using Docker Compose
api-up:
    @echo "Starting API container..."
    @docker compose up -d api

# Stop the API container
api-down:
    @echo "Stopping API container..."
    @docker compose down api