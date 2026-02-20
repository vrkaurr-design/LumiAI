# LumiAI

AI-Powered Beauty & Skincare E-commerce Platform with Virtual Try-On, Skin Analysis, and Smart Product Recommendations.

## Overview

LumiAI is a full-stack application combining a **Next.js frontend** for virtual beauty experiences and a **NestJS backend** with AI-powered skin analysis, product recommendations, and e-commerce functionality.

## Features

**Frontend**
- Virtual try-on and AI skin analysis flows
- Product catalog with filtering/search and product cards
- Shopping cart with persisted items, quantity controls, and totals
- User authentication (sign-in/sign-up)
- Tailwind-based UI with animated backgrounds

**Backend**
- JWT-based authentication with role-based access control (RBAC)
- PostgreSQL database with Prisma ORM
- Redis caching for performance
- AI-powered skin analysis (tone and type detection)
- Product catalog with advanced filtering
- Order management and payment processing (Stripe integration ready)
- File upload and storage management
- Comprehensive API documentation (Swagger/OpenAPI)

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **State**: Zustand (cart) + React Context (UI)
- **Storage**: sessionStorage (auth/analysis) + localStorage (cart)

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Auth**: JWT with Passport
- **File Processing**: Sharp, Canvas
- **Docs**: Swagger/OpenAPI

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**: >= 18.17.0
- **npm**: >= 9.0.0 (comes with Node.js)
- **PostgreSQL**: >= 15 (if running backend locally)
- **Redis**: >= 7 (if running backend locally)

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:3000

### Backend

Option 1: Docker (recommended)
```bash
cd backend
cp .env.example .env  # Edit with your settings
docker-compose up -d
docker-compose exec app npm run prisma:migrate
docker-compose exec app npm run prisma:seed
```

```bash
# 5. In a new terminal, start the frontend
cd frontend
npm install
npm run dev

# Frontend is now running at http://localhost:3000
```

### Option 2: Local Development

#### Backend Setup

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create and configure environment file
cp .env.example .env
# Edit .env with your database credentials

# 3. Start PostgreSQL and Redis (using Docker)
docker-compose up -d postgres redis

# OR start them locally if you have them installed

# 4. Generate Prisma client
npm run prisma:generate

# 5. Run database migrations
npm run prisma:migrate

# 6. Seed the database with sample data
npm run prisma:seed

# 7. Start the backend server
npm run start:dev

# Backend API: http://localhost:3000/api/v1
# Swagger docs: http://localhost:3000/api/docs
```

#### Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# Frontend: http://localhost:3000 (or next available port)
```

## Storage Configuration

The backend stores uploaded files (product images, skin analysis photos) in:
```
N:\antigravity data
```

This directory will be created automatically when the backend starts. You can configure a different location by setting the `UPLOAD_DIR` environment variable in the backend `.env` file.

## Environment Variables

### Backend (.env)

```bash
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:4000
UPLOAD_DIR=N:/antigravity data

# Database
DATABASE_URL=postgresql://lumiai:password@localhost:5432/lumiai?schema=public

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=super-secret-key-change-this
JWT_EXPIRATION=7d

# AWS (Optional - uses local storage if not configured)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=lumiai-assets

# Payment (Stripe - Mock for development)
STRIPE_SECRET_KEY=sk_test_mock
STRIPE_WEBHOOK_SECRET=whsec_mock
```

## Project Structure

```
LumiAI/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── modules/        # Feature modules (Auth, Users, Products, Orders, etc.)
│   │   ├── common/         # Shared guards, interceptors, pipes, services
│   │   ├── config/         # Configuration files
│   │   └── main.ts         # Application entry point
│   ├── prisma/             # Database schema and migrations
│   ├── test/               # Unit and E2E tests
│   └── docker-compose.yml  # Docker services configuration
│
└── frontend/               # Next.js frontend
    ├── src/
    │   ├── app/           # App Router pages
    │   ├── components/    # React components
    │   └── store/         # Zustand state management
    └── public/            # Static assets
```

## Available Scripts

### Backend

```bash
npm run start:dev          # Start backend in development mode
npm run build              # Build for production
npm run start:prod         # Start production server
npm run test               # Run unit tests
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Generate coverage report
npm run lint               # Lint code
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:seed        # Seed database with sample data
npm run prisma:studio      # Open Prisma Studio (database GUI)
```

### Frontend

```bash
npm run dev                # Start frontend in development mode
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Lint code
```

## API Documentation

When the backend is running, access the interactive Swagger documentation at:
```
http://localhost:3000/api/docs
```

The API documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Try-it-out functionality

## Testing

### Backend Tests

```bash
cd backend

# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:cov

# Load testing with Artillery
npx artillery run test/load/products.yml
```

## Database Management

```bash
cd backend

# Open Prisma Studio (visual database editor)
npm run prisma:studio

# Create a new migration
npm run prisma:migrate

# Reset database (warning: deletes all data)
npm run db:reset

# Backup database
npm run db:backup

# Restore database
npm run db:restore
```

## Troubleshooting

### Backend won't start
- Ensure PostgreSQL and Redis are running
- Check database credentials in `.env`
- Run `npm run prisma:generate` to regenerate Prisma client
- Check that port 3000 is not already in use

### Database connection errors
- Verify `DATABASE_URL` in `.env` is correct
- Ensure PostgreSQL is running (`docker-compose ps` or check local service)
- Check firewall settings

### Frontend can't connect to backend
- Verify backend is running on http://localhost:3000/api/v1
- Check CORS settings in backend `main.ts`
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL

### File upload errors
- Verify the storage directory exists: `N:\antigravity data`
- Check file permissions on the storage directory
- Ensure `UPLOAD_DIR` in `.env` is correctly configured

### npm install failures
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Ensure you're using Node.js >= 18.17.0

## Production Deployment

For production deployment instructions, see:
- [Backend Deployment Guide](backend/docs/DEPLOYMENT.md)
- Backend includes Docker support with `Dockerfile` and `docker-compose.yml`

## License

Proprietary – for internal/demo use.

## Support

For issues, questions, or contributions, please refer to the project documentation in the `backend/docs` directory.
