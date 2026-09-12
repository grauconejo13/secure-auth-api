# Performance and Security Notes

## Current controls

- Validate registration and login requests before database work.
- Normalize emails before lookup and storage.
- Enforce a unique email index in MongoDB.
- Hash passwords with bcrypt at 12 rounds; never return or log the password hash.
- Return generic invalid-credential and duplicate-registration responses.
- Issue and verify 15-minute signed JWT access tokens with fixed algorithm, issuer, audience, subject, and role claims.
- Enforce role checks after access-token verification.
- Store only SHA-256 hashes of opaque refresh tokens.
- Rotate refresh tokens and revoke a full token family when an already-consumed token is used.
- Send refresh tokens as HttpOnly, SameSite=Strict cookies.
- Logout revokes the current refresh session and clears the cookie.
- Limit auth requests to 10 attempts per 15-minute window.
- Limit admin user listings to 50 records.
- Keep database-backed routes unavailable when MongoDB or JWT configuration is unavailable.
- Use Helmet and credentialed, explicitly configured CORS.
- Exercise the full authentication happy path against a disposable MongoDB instance when a test runtime permits it.\n- Keep OpenAPI documentation available as a test-covered live contract.

## Next controls

- Use a shared rate-limit store before multi-instance deployment.
- Add password-reset tokens that are hashed at rest.
- Add structured logging with sensitive-field redaction.
- Add pagination/cursor navigation before exposing large admin user lists.

## Security review gate before deployment

- [x] Environment variables validated at startup
- [x] Passwords never returned or logged
- [x] Authentication rate limit added for a single instance
- [x] Access-token verification and role middleware added
- [x] Refresh tokens are hashed at rest and not returned in JSON
- [x] Refresh-token rotation and family revocation added
- [x] CORS configured to the intended client origin
- [x] Database-backed happy-path scenario implemented\n- [x] OpenAPI contract and Swagger UI served from the API
- [ ] Integration command verified in a MongoDB-permitted CI runner
- [ ] Shared rate-limit store configured for multi-instance hosting
- [ ] HTTPS enforced by the hosting platform
- [ ] Dependencies scanned and updated
