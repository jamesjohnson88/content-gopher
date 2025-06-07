# Content Gopher

Content Gopher is a service that processes and manages content using the Gemini AI model. The service consists of a backend API running in a Docker container and a modern frontend built with SolidJS.

## Prerequisites

- Docker and Docker Compose
- Just command runner (optional, for using the provided commands)
- Gemini API key
- Node.js (for frontend development)

## Project Structure

```
.
├── src/
│   ├── api/           # Backend API service code
│   └── app/           # Frontend application
│       └── content-gopher/  # SolidJS frontend
├── docker-compose.yml # Docker Compose configuration
├── justfile          # Just commands for common tasks
└── .gitignore        # Git ignore rules
```

## Environment Setup

1. Create a `.env` file in the `src/api` directory with the following variables:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## Running the Service

### Development Environment

The development environment runs the API service only, with the frontend running locally for development.

#### Using Just Commands (Recommended)

```bash
just dev
```

This will:
- Start the API service on port 7272
- Mount the development output directory at `~/Desktop/gopher-output-dev`
- Run the service with the development configuration

### Production Environment

The production environment runs both the API and frontend services in Docker containers.

#### Using Just Commands (Recommended)

```bash
just prod
```

This will:
- Start the API service on port 7070
- Start the frontend service on port 3000
- Mount the production output directory at `~/Desktop/gopher-output-prod`
- Run the services with the production configuration

### Running Both Environments

You can run both development and production environments simultaneously:

```bash
just dev   # Starts development environment
just prod  # Starts production environment
```

Each environment will:
- Use its own isolated Docker network
- Have its own output directory
- Run on different ports
- Not interfere with each other

### Stopping Services

To stop all services:
```bash
just down
```

### Frontend Development

For frontend development, you can run the frontend locally:

1. Navigate to the frontend directory:
   ```bash
   cd src/app/content-gopher
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Build for production:
   ```bash
   npm run build
   # or
   pnpm build
   ```

## Frontend Technologies

- SolidJS - A declarative, efficient, and flexible JavaScript library for building user interfaces
- TailwindCSS - A utility-first CSS framework
- Vite - Next Generation Frontend Tooling
- TypeScript - For type-safe development

## Configuration

### Backend Configuration

The service is configured through environment variables:

- `SERVICE_NAME`: Name of the service (default: content-gopher)
- `ENVIRONMENT`: Environment setting (default: development)
- `HOST`: Host address (default: 0.0.0.0)
- `PORT`: Port number (default: 7272)
- `DEFAULT_OUTPUT_DIRECTORY`: Directory for output files (default: /gopher-output)
- `GEMINI_MODEL`: Gemini model to use (default: gemini-2.5-flash-preview-05-20)

## Output Directory

The service uses different output directories for development and production:
- Development: `~/Desktop/gopher-output-dev`
- Production: `~/Desktop/gopher-output-prod`

Make sure these directories exist on your system.

## API Endpoints

- Development API: `http://localhost:7272`
- Production API: `http://localhost:7070`
- Production Frontend: `http://localhost:3000`

## Development

### Frontend Development

The frontend uses modern development tools and practices:

- TypeScript for type safety
- TailwindCSS for styling
- Vite for fast development and building
- SolidJS for reactive UI components

To start developing the frontend:

1. Make sure you have Node.js installed
2. Install dependencies using npm or pnpm
3. Run the development server with `npm run dev` or `pnpm dev`
4. The frontend will be available at `http://localhost:5173` by default