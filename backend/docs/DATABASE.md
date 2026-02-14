# Database Documentation

## Overview
LumiAI uses **PostgreSQL** as the primary relational database, managed via **Prisma ORM**.
The schema is defined in `prisma/schema.prisma`.

## Schema Design

### Core Models
- **User**: Authentication and profile data. Supports RBAC via `role` enum (USER, ADMIN).
- **Product**: E-commerce catalog items. Categorized by `Category`, `Tone`, and `SkinType`.
- **Order**: Transactional records linking Users and Products via `OrderItem`.
- **SkinAnalysis**: AI analysis results linked to Users.

### Key Relationships
- `User` has many `Order`s and `SkinAnalysis` records.
- `Order` has many `OrderItem`s.
- `OrderItem` references a `Product`.

### Soft Deletes
The `User` and `Product` models user the `isActive` boolean flag for soft deletion.
- `isActive: true` -> Visible/Active
- `isActive: false` -> Soft Deleted

## Migration Workflow

We use Prisma Migrate for schema changes.

1. **Make Changes**: Edit `prisma/schema.prisma`.
2. **Generate Migration**:
   ```bash
   npm run prisma:migrate
   # Prompts for migration name, e.g., "add_user_phone"
   ```
3. **Apply to Production**:
   ```bash
   npm run prisma:migrate:prod
   ```

## Management Scripts

We provide several utility scripts in `package.json` for database management.

### Backup & Restore
**Note**: Requires `pg_dump` and `psql` to be installed and available in your system PATH.

- **Backup**:
  ```bash
  npm run db:backup
  # Creates a timestamped .sql file in ./backups/
  ```

- **Restore**:
  ```bash
  npm run db:restore
  # Restores from the LATEST .sql file in ./backups/
  # WARNING: Overwrites existing data!
  ```

### Reset
- **Reset (Dev Only)**:
  ```bash
  npm run db:reset
  # Drops the database, re-runs migrations, and runs seeds.
  ```

### Soft Delete Management
- **Purge Inactive Records**:
  ```bash
  npx ts-node scripts/cleanup-db.ts purge
  ```
- **Restore Inactive Records**:
  ```bash
  npx ts-node scripts/cleanup-db.ts restore
  ```

## Seeding
The database is seeded with initial data for development using:
```bash
npm run prisma:seed
```
This populates the DB with:
- Admin User
- Sample Products (Skincare, Makeup)
- Sample Categories

## Troubleshooting
- **Connection Errors**: Check `DATABASE_URL` in `.env`.
- **Migration Locks**: If a migration fails, you may need to resolve the migration state manually in the `_prisma_migrations` table or reset the DB.
