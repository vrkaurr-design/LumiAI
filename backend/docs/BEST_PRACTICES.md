# API Best Practices

## Error Handling
- Throw `HttpException` (or subclasses like `NotFoundException`) instead of generic Errors.
- Use `mock-throw` in tests to simulate errors.

## Validation
- Use `class-validator` decorators on DTOs.
- Always use `whitelist: true` in ValidationPipe to strip illegal fields.

## Caching
- Cache public, read-heavy data (Product Listings).
- Invalidate cache on write (Create/Update Product).
- Use "Stale-While-Revalidate" pattern on frontend to mask latency.

## Security
- Never log sensitive data (passwords, tokens).
- Use `@Public()` decorator sparingly.
- Validate file uploads (Mime type, Size) before processing.
