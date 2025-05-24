# Set PowerShell as the shell
set shell := ["powershell", "-Command"]

# Default recipe to run when just is called without arguments
default:
    @just --list

# Start development hosting
dev: 
    @echo "Starting development hosting..."
    @cd src/api; go run .