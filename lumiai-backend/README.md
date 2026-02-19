# LumiAI Backend API

## Quick Start

```bash
npm install
npx prisma generate
npm run start:dev
```

## Database

```bash
npx prisma migrate dev
npx prisma db seed
npx prisma studio
```

## Docs

- API Docs: http://localhost:3000/api/docs

## Docker

```bash
cp .env.example .env
docker compose up --build
```

## Environment

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/lumiai?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Scripts

```bash
npm run start         # development
npm run start:dev     # watch mode
npm run start:prod    # production build
npm run test          # unit tests
npm run test:e2e      # e2e tests
```
