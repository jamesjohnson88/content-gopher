FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies (removed --frozen-lockfile to be more flexible)
RUN pnpm install

# Copy source code
COPY . .

# Build the application with environment variables
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN pnpm build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"] 