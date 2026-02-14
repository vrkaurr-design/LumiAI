# Developer Onboarding

## Getting Started

1. **Clone Repo**
   ```bash
   git clone git@github.com:limonnono/LumiAI.git
   cd backend
   ```

2. **Environment**
   - Install Node.js v18+
   - Install Docker Desktop
   - copy `.env.example` to `.env`

3. **Run**
   ```bash
   npm install
   docker-compose up -d
   npm run prisma:migrate
   npm run start:dev
   ```

## Workflow
- **Branching**: Use feature branches `feature/my-feature`.
- **Commits**: Use conventional commits (e.g. `feat: add product search`).
- **Tests**: Write unit tests for all new services.
- **Linting**: Run `npm run lint` before pushing.

## Coding Standards
- Use **DTOs** for all input/output.
- Use **Services** for business logic, **Controllers** for routing only.
- Use **Prisma** for all DB queries (avoid raw SQL).
- Use **Swagger** decorators on all public endpoints.
