# Deployment Guide

## Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local dev)

## Quick Start (Local Development)
The easiest way to run the entire stack is using Docker Compose.

1. **Clone & Setup**:
   ```bash
   git clone <repo>
   cd backend
   cp .env.example .env
   ```

2. **Start Infrastructure**:
   ```bash
   docker-compose up -d postgres redis
   ```

3. **Initialize Database**:
   ```bash
   # Wait for Postgres to be ready
   npm run prisma:migrate
   npm run prisma:seed
   ```

4. **Run App (Local)**:
   ```bash
   npm run start:dev
   ```
   **OR Run App (Docker)**:
   ```bash
   docker-compose up --build
   ```

## Production Deployment

### Environment Setup
1. Copy `.env.example` to `.env.production`.
2. Generate a strong `JWT_SECRET`: `openssl rand -base64 32`.
3. Set `NODE_ENV=production`.

### Building
```bash
docker build -t lumiai-backend:latest .
```

### Running
```bash
docker run -d \
  -p 3000:3000 \
  --env-file .env.production \
  --name lumiai-backend \
  lumiai-backend:latest
```

## Health Checks
- `GET /health` - Application health
- `GET /health/db` - Database connectivity
