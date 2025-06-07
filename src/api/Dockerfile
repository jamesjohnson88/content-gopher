FROM golang:1.24.1 AS build

WORKDIR /workspace

# Install build dependencies
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy go mod files first for better caching
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build with optimizations
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o /go/bin/app

# Use distroless for smaller image
FROM gcr.io/distroless/static-debian12
COPY --from=build /go/bin/app /app

CMD ["/app"] 