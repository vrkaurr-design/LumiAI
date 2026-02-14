# Maintenance Guide

## Daily Tasks
- Check application logs for error spikes (`500` status codes).
- Verify database backups are running (see `scripts/backup-db.ts`).

## Monthly Tasks
- **Update Dependencies**: `npm update`. Run tests afterwards.
- **Rotate Secrets**: Update `JWT_SECRET` and deployment credentials.
- **Review Access**: Audit Admin users.

## Backup & Restore
See [DATABASE.md](./DATABASE.md) for detailed scripts.

```bash
# Backup
npm run db:backup

# Restore
npm run db:restore
```

## Monitoring
- **Health Check**: `GET /api/v1/health`
- **Database**: Monitor connection pool usage (default limit: 20).
- **Redis**: Monitor memory usage.
