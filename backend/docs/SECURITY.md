# Security Documentation

## Authentication & Authorization
- **JWT**: We use JSON Web Tokens for stateless authentication. Tokens expire in 7 days (dev) or shorter in prod.
- **RBAC**: Role-Based Access Control is enforced using `@Roles` decorator and `RolesGuard`.
- **Password Hashing**: Passwords are hashed using `bcrypt` with salt rounds = 10.

## Validation
- **Dto Validation**: All inputs are validated using `class-validator` DTOs with `whitelist: true` to strip unknown properties.
- **Sanitization**: A global `SanitizePipe` strips potentially malicious HTML tags (XSS) from all string inputs using `xss` library.
- **Custom Validators**:
    - `IsStrongPassword`: Enforces complexity (8+ chars, upper, lower, number, special).
    - `IsIndianPhone`: Validates Indian phone number formats.
    - `IsValidSku`: Enforces SKU format.

## Rate Limiting
- **Global Limit**: 100 requests per minute per IP.
- **Specific Limits**:
    - Skin Analysis: 5 requests per hour (via custom `RateLimitGuard`).
    - Login/Auth: Protected by global limit currently (can be tightened with specific Throttle guards).

## Security Headers
- **Helmet**: We use `helmet()` middleware to set secure HTTP headers (HSTS, X-Frame-Options, etc.).
- **CORS**: Cross-Origin Resource Sharing is restricted to the frontend URL defined in `FRONTEND_URL`.

## Reporting Vulnerabilities
If you discover a security vulnerability, please report it via email to security@lumiai.com.
