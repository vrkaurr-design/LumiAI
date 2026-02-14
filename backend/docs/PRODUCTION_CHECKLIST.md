# Production Readiness Checklist

## Security
- [ ] `NODE_ENV` set to `production`
- [ ] Strong `JWT_SECRET` generated and rotated
- [ ] Database passwords secured and not default
- [ ] Rate limiting enabled and tuned
- [ ] Helmet headers enabled
- [ ] CORS restricted to specific frontend domains

## Infrastructure
- [ ] Postgres backed up (WAL archiving / periodic dumps)
- [ ] Redis configured with persistence if needed for non-cache data
- [ ] SSL/TLS enabled (Reverse Proxy / Load Balancer level)

## Monitoring & Logging
- [ ] Application logs aggregated (ELK, CloudWatch, etc.)
- [ ] Error tracking enabled (Sentry, etc.)
- [ ] Health check endpoints monitored by external pinger
- [ ] Performance metrics tracking (Response time, Throughput)

## Database
- [ ] Migrations applied (`npm run prisma:migrate:prod`)
- [ ] Indexes validated for common queries
- [ ] Connection pool size configured appropriately

## Reliability
- [ ] Docker container restart policy set to `always`
- [ ] CI/CD pipeline passing all tests
