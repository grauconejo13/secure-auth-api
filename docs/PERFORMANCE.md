# Performance and Security Notes

## Current controls

- Validate registration and login requests before database work.
- Normalize emails before lookup and storage.
- Enforce a unique email index in MongoDB.
- Hash passwords with bcrypt at 12 rounds; never return or log the password hash.
- Return generic invalid-credential and duplicate-registration responses.
- Issue 15-minute signed JWT access tokens.
- Store only SHA-256 hashes of opaque refresh tokens.
- Send refresh tokens as HttpOnly, SameSite=Strict cookies.
- Limit auth requests to 10 attempts per 15-minute window.
- Keep database-backed routes unavailable when MongoDB or JWT configuration is unavailable.
- Limit JSON request bodies to 16 KB.
- Use Helmet and credentialed, explicitly configured CORS.

## Next controls

- Add refresh-token rotation, replay detection, and logout revocation.
- Add protected-route and role middleware.
- Use a shared rate-limit store before multi-instance deployment.
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
- [x] Authentication rate limit added for a single instance
- [x] Access tokens are short-lived
- [x] Refresh tokens are hashed at rest and not returned in JSON
- [x] CORS configured to the intended client origin
- [ ] Shared rate-limit store configured for multi-instance hosting
- [ ] HTTPS enforced by the hosting platform
- [ ] Dependencies scanned and updated
- [ ] Authorization tests cover cross-user access attempts
- [ ] A recovery/revocation plan exists for compromised secrets
