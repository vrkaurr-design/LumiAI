# LumiAI Backend API

AI-Powered Beauty & Skincare E-commerce Platform Backend

## Features
- **JWT Authentication**: Secure user management with role-based access control (RBAC)
- **Product Catalog**: Advanced filtering and search with Redis caching
- **AI Skin Analysis**: Image processing to detect skin tone and type using Canvas and Sharp
- **Order Management**: Cart processing, stock validation, and order history
- **Payment Processing**: Stripe integration ready (mock mode for development)
- **Admin Dashboard**: Analytics, inventory, and order management
- **File Storage**: Local storage with automatic directory management  
- **API Documentation**: Interactive Swagger/OpenAPI documentation

## Tech Stack
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL (Prisma ORM)
- **Caching**: Redis
- **Authentication**: JWT with Passport
- **File Processing**: Sharp, Canvas
- **Docs**: Swagger / OpenAPI
- **Testing**: Jest, Supertest, Artillery
- **Container**: Docker

## Quick Start

### Prerequisites
- Docker & Docker Compose (recommended)
- Node.js 18+ (for local dev)
- PostgreSQL 15+ (if not using Docker)
- Redis 7+ (if not using Docker)

### Run with Docker (Recommended)
```bash
# 1. Create environment file
cp .env.example .env

# 2. Start all services (PostgreSQL, Redis, and Backend)
docker-compose up -d

# 3. Run migrations & seed data
docker-compose exec app npm run prisma:migrate
docker-compose exec app npm run prisma:seed

# API is running at http://localhost:3000/api/v1
# Swagger docs at http://localhost:3000/api/docs
```

### Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your configuration

# 3. Start PostgreSQL & Redis (using Docker)
docker-compose up -d postgres redis

# 4. Generate Prisma client
npm run prisma:generate

# 5. Run migrations
npm run prisma:migrate

# 6. Seed database with sample data
npm run prisma:seed

# 7. Start server
npm run start:dev

# API: http://localhost:3000/api/v1
# Swagger: http://localhost:3000/api/docs
```

## Storage Configuration

Uploaded files (product images, skin analysis photos) are stored in:
```
N:\antigravity data
```

The directory structure is automatically created:
```
N:\antigravity data/
├── products/      # Product images
├── analysis/      # Skin analysis photos
└── images/        # General uploads
```

You can configure the storage location by setting the `UPLOAD_DIR` environment variable in `.env`:
```env
UPLOAD_DIR=N:/antigravity data
```

**Note**: In production, configure AWS S3 credentials to use cloud storage instead. The system automatically switches to S3 when `NODE_ENV=production`.

## Environment Variables

See [`.env.example`](file:///N:/github-repos/limonnono/LumiAI/backend/.env.example) for all available options.

**Key variables:**
- `PORT`: Server port (default: 3000)
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_HOST` / `REDIS_PORT`: Redis configuration
- `JWT_SECRET`: Secret key for JWT tokens (change in production!)
- `UPLOAD_DIR`: Local file storage path (default: `N:/antigravity data`)
- `AWS_*`: AWS S3 credentials (optional, for production)

## Available Scripts

```bash
# Development
npm run start:dev          # Start in watch mode
npm run start:debug        # Start with debugging

# Production
npm run build              # Build production bundle
npm run start:prod         # Start production server

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:seed        # Seed database
npm run prisma:studio      # Open Prisma Studio (GUI)
npm run db:reset           # Reset database (deletes all data)
npm run db:backup          # Backup database
npm run db:restore         # Restore database

# Testing
npm run test               # Unit tests
npm run test:watch         # Unit tests in watch mode
npm run test:e2e           # E2E tests
npm run test:cov           # Coverage report
npx artillery run test/load/products.yml  # Load testing

# Code Quality
npm run lint               # Lint and fix
npm run format             # Format code
```

## API Documentation

When the server is running, access interactive API documentation at:
```
http://localhost:3000/api/docs
```

The Swagger UI provides:
- Complete API endpoint reference
- Request/response schemas
- Authentication (JWT Bearer token)
- Try-it-out functionality for testing

### API Endpoints

- **Authentication**: `/api/v1/auth/*` - Sign up, login, token refresh
- **Users**: `/api/v1/users/*` - User management
- **Products**: `/api/v1/products/*` - Product catalog, filtering, search
- **Orders**: `/api/v1/orders/*` - Order creation and management
- **Cart**: `/api/v1/cart/*` - Shopping cart operations
- **Analysis**: `/api/v1/analysis/*` - AI skin analysis
- **Upload**: `/api/v1/upload/*` - File upload endpoints
- **Admin**: `/api/v1/admin/*` - Admin dashboard and analytics
- **Payment**: `/api/v1/payment/*` - Payment processing

## Project Structure
```
src/
├── modules/          # Feature modules
│   ├── auth/        # Authentication (JWT, guards)
│   ├── users/       # User management
│   ├── products/    # Product catalog
│   ├── orders/      # Order management
│   ├── cart/        # Shopping cart
│   ├── analysis/    # AI skin analysis
│   ├── upload/      # File uploads
│   ├── admin/       # Admin dashboard
│   └── payment/     # Payment processing
├── common/          # Shared utilities
│   ├── guards/      # Auth guards
│   ├── interceptors/# Request/response interceptors
│   ├── pipes/       # Validation pipes
│   └── services/    # Storage, caching services
├── config/          # Configuration
└── main.ts          # Application entry point

prisma/
├── schema.prisma    # Database schema
└── seed.ts          # Database seed data

test/
├── *.spec.ts        # Unit tests
└── *.e2e-spec.ts    # E2E tests
```

## Testing

```bash
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
# Open Prisma Studio (visual database editor)
npm run prisma:studio

# Create a new migration
npm run prisma:migrate

# Reset database (warning: deletes all data)
npm run db:reset

# View database schema
cat prisma/schema.prisma
```

## Troubleshooting

### Database connection errors
- Ensure PostgreSQL is running
- Verify `DATABASE_URL` in `.env`
- Check PostgreSQL credentials and port (default: 5432)

### Redis connection errors
- Ensure Redis is running
- Verify `REDIS_HOST` and `REDIS_PORT` in `.env`
- Default Redis port is 6379

### File upload errors
- Ensure `UPLOAD_DIR` path exists and is writable
- Default: `N:\antigravity data`
- The directory is created automatically if it doesn't exist

### Port already in use
- Change `PORT` in `.env` (default: 3000)
- Or find and stop the process using: `netstat -ano | findstr :3000`

### Prisma client errors
- Regenerate Prisma client: `npm run prisma:generate`
- Run migrations: `npm run prisma:migrate`

## Documentation

- [API Documentation (Swagger)](http://localhost:3000/api/docs)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Integration Guide](docs/INTEGRATION_GUIDE.md)
- [Database Schema](docs/DATABASE.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

## License
MIT
