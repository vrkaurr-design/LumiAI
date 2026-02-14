# QA Checklist

## Functional
- [ ] User can sign up and login
- [ ] User can browse products with filters
- [ ] User can upload selfie and get analysis
- [ ] User can add items to cart and checkout
- [ ] Admin can view dashboard stats
- [ ] Admin can update order status

## Non-Functional
- [ ] Response time < 500ms for p95
- [ ] Error messages are user-friendly (no stack traces)
- [ ] Logs are structured (Winston)

## Deployment
- [ ] Docker image builds successfully
- [ ] Database migrations pass
- [ ] Environment variables validated
- [ ] SSL enabled (Load Balancer level)
