# Troubleshooting Guide

## Common Issues

### 1. Application won't start
- **Error**: `PrismaClientInitializationError` / `Connection refused`
  - **Cause**: Database is not running or credentials in `.env` are wrong.
  - **Solution**: Run `docker-compose up -d postgres`. Check `.env` matches docker-compose settings.

- **Error**: `Redis connection failed`
  - **Solution**: Run `docker-compose up -d redis`.

### 2. "Module not found" / Types missing
- **Error**: `Cannot find module '@prisma/client'`
- **Cause**: Prisma client not generated.
- **Solution**: Run `npm run prisma:generate`.

### 3. API returns 404 for everything
- **Cause**: Global prefix mismatch.
- **Solution**: Check if you are including `/api/v1` in your requests.

### 4. File Uploads fail
- **Error**: `MulterError` / `File too large`
- **Solution**: Check upload limits in `AppModule` or `UploadController`. Default is optimized for images < 5MB.

## Debugging

To run the application with debug logs:
```bash
npm run start:debug
```
Attach Chrome DevTools or VS Code debugger to port 9229.

## Logs
- **Application Logs**: `logs/combined.log` (if configured) or Container stdout.
- **Error Logs**: `logs/error.log`.
