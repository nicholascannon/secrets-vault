# secrets-vault

A full-stack TypeScript monorepo with React frontend and Express backend, production-ready with error tracking, health checks, and deployment configurations.

## Structure

```
secrets-vault/
├── packages/
│   ├── frontend/     # React + Vite application
│   ├── server/       # Express API server
│   └── shared/       # Shared types and schemas (Zod)
├── .github/
│   └── workflows/    # GitHub Actions CI/CD pipelines
├── docker-compose.yml
├── Dockerfile
├── fly.toml          # Fly.io deployment configuration
├── run.sh            # Docker startup script
└── stop.sh           # Docker shutdown script
```

## Prerequisites

- Node.js >= 24.11.0
- npm
- Docker & Docker Compose (for containerized deployment)

## Development

Install dependencies:

```bash
npm install
```

Run both frontend and server in development mode:

```bash
npm run dev
```

This starts:
- **Server**: `http://localhost:8000` (Express API)
- **Frontend**: `http://localhost:5173` (Vite dev server)

### Other Commands

```bash
# Build all packages
npm run build

# Run tests
npm run test

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Run workspace-specific commands
npm run frontend <command>
npm run server <command>
npm run shared <command>
```

## Docker

Build and run with Docker Compose:

```bash
./run.sh
# or
docker compose up --build
```

Stop containers:

```bash
./stop.sh
# or
docker compose down
```

The Docker build:
1. Installs dependencies
2. Lints code
3. Builds all packages
4. Runs tests
5. Serves the production build on port 8000

The production build serves both the API and frontend from the same server.

## Deployment

### Fly.io

The project includes a `fly.toml` configuration for Fly.io deployment:

```bash
fly deploy
```

The Fly.io configuration:
- Uses blue-green deployment strategy
- Auto-rollback on failures
- Health checks via `/api/v1/health`
- Runs on port 8080 internally
- Forces HTTPS

### CI/CD Pipelines

GitHub Actions workflows are configured for:

- **PR Pipeline**: Validates code (lint, build, test) on pull requests
- **Deploy Pipeline**: Automatically deploys to Fly.io on `main` branch pushes (can also be triggered manually)
- **Rollback Pipeline**: Manual workflow to rollback to a previous deployment

Required GitHub secrets: `FLY_API_TOKEN` (required), `SENTRY_DSN` (optional)

## Server Features

### Middleware

- **Request ID**: Unique ID for each request for tracing
- **Sentry Context**: Adds request context to Sentry errors
- **Request Timeout**: Configurable timeout (default: 30s)
- **Logging**: Winston-based request/response logging
- **Error Handling**: Generic error handler with structured responses
- **Zod Validation**: Automatic validation error handling
- **Rate Limiting**: IP-based rate limiting with Cloudflare IP support
- **CORS**: Configurable CORS origins
- **Helmet**: Security headers
- **Sentry**: Error tracking and monitoring

### Health Checks

- **Liveness**: `GET /api/v1/health` - Always returns 200 if app is running
- **Readiness**: `GET /api/v1/health/ready` - Returns 200 if dependencies are healthy, 503 otherwise

### Production Features

- Frontend is served from the Express server in production
- Structured error responses with request IDs
- Graceful shutdown handling
- Request lifecycle management

## Server Configuration

The server can be configured via environment variables:

```bash
# Environment (development | production | test)
NODE_ENV=development

# Release version (for Sentry tracking)
RELEASE=1.0.0

# Server port (default: 8000)
PORT=8000

# CORS allowed hosts (comma-separated)
CORS_HOSTS=http://localhost:5173,http://localhost:3000

# Rate limiting (optional)
RATE_LIMIT_WINDOW_MS=60000    # Time window in ms (default: 60000)
RATE_LIMIT_MAX=100            # Max requests per window (default: 100)

# Request timeout in ms (default: 30000, set to 0 to disable)
REQUEST_TIMEOUT=30000

# Sentry configuration (optional)
SENTRY_DSN=your-sentry-dsn
SENTRY_ENVIRONMENT=local|staging|production
SENTRY_SAMPLE_RATE=1.0
```

Create a `.env` file in the root directory or set these variables in your environment.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Vitest, Testing Library
- **Backend**: Express 5, TypeScript, Winston (logging), Helmet, CORS, Sentry
- **Shared**: Zod for schema validation
- **Tooling**: Biome (linting/formatting), npm workspaces, concurrently
- **Testing**: Vitest with UI support

