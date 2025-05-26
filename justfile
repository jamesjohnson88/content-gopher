# Set PowerShell as the shell with COMPOSE_BAKE enabled
set shell := ["powershell", "-Command", "$env:COMPOSE_BAKE='false';"]

# Default Defaults to listing options when no args are provided
default:
    @just --list

# Start the API using Docker Compose
api-up:
    @echo "Starting API container..."
    @docker compose up -d api

# Start the API using Docker Compose and COMPOSE_BAKE=true
api-bake:
    @echo "Starting API container..."
    @$env:COMPOSE_BAKE='true'; docker compose up -d api

# Stop the API container
api-down:
    @echo "Stopping API container..."
    @docker compose down api -v

# Nuke Docker
nuke: 
    docker-compose down -v --rmi all
    docker builder prune -f

# Hidden alias' (won't show in --list)
[private]
up: api-up

[private]
bake: api-bake

[private]
down: api-down