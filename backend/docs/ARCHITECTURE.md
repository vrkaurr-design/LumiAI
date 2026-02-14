# System Architecture

## Overview
LumiAI follows a layered microservices-ready architecture using NestJS.

### Layers
1. **Controller Layer**: Handles HTTP requests, validation (DTOs), and serialization.
2. **Service Layer**: Contains business logic, orchestrates data flow.
3. **Data Access Layer**: Uses Prisma ORM to interact with PostgreSQL.
4. **Caching Layer**: Uses Redis to cache expensive read operations (e.g. Product Catalog).
5. **AI Logic Layer**: `AnalysisService` uses `sharp` for image pixel processing.

## Data Flow
**Request** -> `Helmet/CORS` -> `RateLimit` -> `AuthGuard` -> `Controller` -> `Service` -> `Repo/Cache` -> **Response**

## Scalability
- **Stateless Auth**: JWT allows horizontal scaling of API nodes.
- **Caching**: Redis offloads database reads for high-traffic endpoints.
- **Docker**: Containerization allows easy deployment to Kubernetes/ECS.
- **Async Processing**: (Planned) Move Image Analysis to a background queue (Bull/Redis).

## Security
- **Authentication**: JWT (Access Token + Refresh Token flow).
- **Authorization**: RBAC (Role Guards).
- **Data Protection**: Passwords hashed with Bcrypt.
- **Input Validation**: Global ValidationPipe with strict allow-listing.
