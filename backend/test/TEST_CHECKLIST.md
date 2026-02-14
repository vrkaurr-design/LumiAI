# Test Checklist

## Unit Tests
- [ ] Auth Service
- [ ] Products Service
- [ ] Orders Service
- [ ] Analysis Service (RGB Logic)

## Integration Tests
- [ ] Auth Flow (Signup -> Login -> Token)
- [ ] Product Browsing (Filter & Search)
- [ ] Order Creation (Stock validation)

## E2E Tests
- [ ] Full Checkout Flow
- [ ] Admin Dashboard Access

## Load Testing
- [ ] 50 concurrent users browsing products
- [ ] 10 concurrent users creating orders

## Security Audit
- [ ] SQL Injection prevention (Prisma handles this)
- [ ] XSS prevention (Helmet + SanitizePipe)
- [ ] Auth Bypass attempts (Guards checked)
- [ ] Rate Limiting active
