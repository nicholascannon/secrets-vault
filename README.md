# secrets-vault

A vault for your dot files.

![App Demo](./demo.gif)

## Table of Contents

- [Structure](#structure)
- [Prerequisites](#prerequisites)
- [Development](#development)
  - [Other Commands](#other-commands)
  - [Database Commands](#database-commands)
- [Docker](#docker)
  - [Database](#database)
- [Deployment](#deployment)
  - [Fly.io](#flyio)
  - [CI/CD Pipelines](#cicd-pipelines)
- [Server Features](#server-features)
  - [Architecture](#architecture)
  - [Middleware](#middleware)
  - [Authentication](#authentication)
  - [Health Checks](#health-checks)
  - [Production Features](#production-features)
- [Configuration](#configuration)
  - [Server Environment Variables](#server-environment-variables)
- [Tech Stack](#tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Shared](#shared)
  - [Tooling](#tooling)

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
├── migrations.Dockerfile  # Database migrations container
├── fly.toml          # Fly.io deployment configuration
├── run.sh            # Docker startup script
└── stop.sh           # Docker shutdown script
```

## Prerequisites

- Node.js >= 24.11.0 (see `.nvmrc`)
- npm
- Docker & Docker Compose (for containerized deployment)
- PostgreSQL (for local development, or use Docker Compose)

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
npm run test:ui  # Open Vitest UI (workspace-specific)

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

### Database Commands

```bash
# Generate Prisma client
npm run server db:generate

# Create and run migrations (development)
npm run server db:migrate

# Deploy migrations (production)
npm run server db:deploy
```

## Docker

Build and run with Docker Compose:

```bash
./run.sh
# or
docker compose up --build
```

This starts:
- **PostgreSQL database** on port 5432
- **Database migrations** (runs automatically before app starts)
- **Application** on port 8000

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
5. Runs database migrations
6. Serves the production build on port 8000

The production build serves both the API and frontend from the same server.

### Database

The project uses PostgreSQL with Prisma ORM. The Docker Compose setup includes:
- PostgreSQL 17.6 (Alpine)
- Automatic migration execution before the app starts
- Health checks to ensure database is ready

For local development, you can either:
- Use Docker Compose (recommended): `docker compose up db`
- Run PostgreSQL locally and set `DATABASE_URL` in your `.env` file

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

- **PR Pipeline**: Validates code on pull requests
  - Lints code
  - Builds all packages
  - Runs tests
  - Validates Prisma schema
  - Checks for migration drift
  - Builds Docker image
  - Validates Fly.io configuration

- **Deploy Pipeline**: Automatically deploys to Fly.io on `main` branch pushes (can also be triggered manually)
  - Builds Docker images (app + migrations)
  - Runs database migrations
  - Deploys to Fly.io
  - Creates and pushes git tags

- **Rollback Pipeline**: Manual workflow to rollback to a previous deployment
  - Requires confirmation input
  - Can rollback to specific release or previous release

**Required GitHub secrets:**
- `FLY_API_TOKEN` (required)
- `DATABASE_URL` (required for migrations)
- `CLERK_PUBLISHABLE_KEY` (required)
- `CLERK_SECRET_KEY` (required)
- `SENTRY_DSN` (optional)

**Required GitHub variables:**
- `ENABLE_CI` (must be set to `'true'` to enable workflows)

## Server Features

### Architecture

The server follows a clean architecture pattern:
- **Controllers**: Handle HTTP concerns only, no business logic
- **Services**: Contain all business logic for the domain
- **Repositories**: Data access layer with interface-based design

### Middleware

- **Request ID**: Unique ID for each request for tracing
- **Sentry Context**: Adds request context to Sentry errors
- **Request Timeout**: Configurable timeout (default: 30s)
- **Logging**: Winston-based request/response logging
- **Error Handling**: Generic error handler with structured responses
- **Zod Validation**: Automatic validation error handling
- **Rate Limiting**: IP-based rate limiting with Cloudflare IP support
- **CORS**: Configurable CORS origins
- **Helmet**: Security headers (configured for Clerk)
- **Sentry**: Error tracking and monitoring
- **Clerk Authentication**: Middleware for protected routes

### Authentication

The server uses [Clerk](https://clerk.com) for authentication:
- Protected routes use `requiresAuth` middleware
- Sets `req.userId` on authenticated requests
- Frontend uses `@clerk/clerk-react` for authentication UI

### Health Checks

- **Liveness**: `GET /api/v1/health` - Always returns 200 if app is running
- **Readiness**: `GET /api/v1/health/ready` - Returns 200 if dependencies (database) are healthy, 503 otherwise

### Production Features

- Frontend is served from the Express server in production
- Structured error responses with request IDs
- Graceful shutdown handling
- Request lifecycle management
- Database connection pooling via Prisma

## Configuration

### Server Environment Variables

The server can be configured via environment variables. Create `.env` files in the respective package directories:

**`packages/server/.env`:**
```bash
# Environment (development | production | test)
NODE_ENV=development

# Release version (for Sentry tracking)
RELEASE=1.0.0

# Server port (default: 8000)
PORT=8000

# Database connection
DATABASE_URL=postgresql://user:password@localhost:5432/secrets-vault

# CORS allowed hosts (comma-separated)
CORS_HOSTS=http://localhost:5173,http://localhost:3000

# Rate limiting (optional)
RATE_LIMIT_WINDOW_MS=60000    # Time window in ms (default: 60000)
RATE_LIMIT_MAX=100            # Max requests per window (default: 100)

# Request timeout in ms (default: 30000, set to 0 to disable)
REQUEST_TIMEOUT=30000

# Clerk Authentication (required)
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Sentry configuration (optional)
SENTRY_DSN=your-sentry-dsn
SENTRY_ENVIRONMENT=local|staging|production
SENTRY_SAMPLE_RATE=1.0
```

**`packages/frontend/.env`:**
```bash
# Clerk Authentication (required)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

See `.env.example` files in each package for reference.

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **React Router 7** for routing
- **TanStack Query** for data fetching
- **Clerk** for authentication
- **Tailwind CSS 4** for styling
- **Radix UI** for accessible components
- **Vitest** + Testing Library for testing

### Backend
- **Express 5** with TypeScript
- **Prisma** ORM with PostgreSQL
- **Clerk** for authentication (`@clerk/express`)
- **Winston** for logging
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Sentry** for error tracking
- **Zod** for schema validation
- **Vitest** + Supertest for testing

### Shared
- **Zod** for schema validation
- Shared TypeScript types and API response formats

### Tooling
- **Biome** for linting and formatting
- **npm workspaces** for monorepo management
- **Husky** + lint-staged for git hooks
- **concurrently** for running multiple dev servers
- **TypeScript** with ESM modules
- **Vitest** with UI support for testing
