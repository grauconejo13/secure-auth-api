# Performance and Security Notes

## Current controls

- Validate registration requests before database work.
- Normalize emails before lookup and storage.
- Enforce a unique email index in MongoDB.
- Hash passwords with bcrypt at 12 rounds; never return or log the password hash.
- Return a generic duplicate-registration response.
- Keep database-backed routes unavailable when MongoDB is disconnected.
- Limit JSON request bodies to 16 KB.
- Use Helmet and explicitly configured CORS.

## Next controls

- Apply rate limits to registration, sign-in, and password-reset endpoints.
- Add short-lived access tokens and revocable refresh-token sessions.
- Add password-reset tokens that are hashed at rest.
- Add structured logging with sensitive-field redaction.
- Add database-backed integration tests.

## Measurements to add during implementation

| Area | Measurement |
|---|---|
| Authentication latency | p50 and p95 response time for register, login, and refresh |
| Reliability | error rate by endpoint |
| Database | query time and index usage for email and user ID lookups |
| Security controls | rate-limit events, invalid-token events, and blocked requests |
| Test health | unit, integration, and authorization-coverage results |

## Security review gate before deployment

- [x] Environment variables validated at startup
- [x] Passwords never returned or logged
- [ ] Tokens and reset links redacted from logs
- [x] CORS configured to the intended client origin
- [ ] HTTPS enforced by the hosting platform
- [ ] Dependencies scanned and updated
- [ ] Authorization tests cover cross-user access attempts
- [ ] A recovery/revocation plan exists for compromised secrets
