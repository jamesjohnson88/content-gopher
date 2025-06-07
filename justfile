# Set PowerShell as the shell with COMPOSE_BAKE and DOCKER_BUILDKIT enabled
set shell := ["powershell", "-Command", "$env:COMPOSE_BAKE='false'; $env:DOCKER_BUILDKIT='1';"]

# Default Defaults to listing options when no args are provided
default:
    @just --list

# Start API service in development mode (frontend should be run locally)
dev:
    @echo "Starting API service in development mode..."
    @docker compose -f docker-compose.yml -f docker-compose.dev.yml -p content-gopher-dev up -d

# Start all services in production mode
prod:
    @echo "Starting all services in production mode..."
    @docker compose -f docker-compose.yml -f docker-compose.prod.yml -p content-gopher-prod --profile prod up -d

# Stop all services
down:
    @echo "Stopping all services..."
    @docker compose down

# Clean Docker cache and unused resources
clean:
    @echo "Cleaning Docker cache and unused resources..."
    @docker system prune -f

# Clean Docker cache, unused resources, and volumes
clean-all:
    @echo "Cleaning Docker cache, unused resources, and volumes..."
    @docker system prune -f --volumes

# Nuke Docker (complete cleanup)
nuke: 
    @echo "Performing complete Docker cleanup..."
    @docker compose down -v --rmi all
    @docker builder prune -f
    @docker system prune -f --volumes --all