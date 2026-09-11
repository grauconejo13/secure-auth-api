# Performance and Security Notes

## Baseline goals

- Validate requests before database work.
- Return consistent, minimal error messages.
- Hash passwords with a modern adaptive password-hashing algorithm.
- Apply rate limits to sign-in, registration, and password-reset endpoints.
- Avoid user-enumeration responses in login and recovery flows.
- Use pagination for administrative user lists.
- Add a `GET /health` endpoint for deployment monitoring.

## Measurements to add during implementation

| Area | Measurement |
|---|---|
| Authentication latency | p50 and p95 response time for register, login, and refresh |
| Reliability | error rate by endpoint |
| Database | query time and index usage for email and user ID lookups |
| Security controls | rate-limit events, invalid-token events, and blocked requests |
| Test health | unit, integration, and authorization-coverage results |

## Security review gate before deployment

- [ ] Environment variables validated at startup
- [ ] Passwords never returned or logged
- [ ] Tokens and reset links redacted from logs
- [ ] CORS configured to the intended client origin
- [ ] HTTPS enforced by the hosting platform
- [ ] Dependencies scanned and updated
- [ ] Authorization tests cover cross-user access attempts
- [ ] A recovery/revocation plan exists for compromised secrets
