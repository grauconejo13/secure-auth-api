# Build Log

A short chronological record of meaningful project changes.

## 2026-09-11 — Repository foundation

- Created the public `secure-auth-api` repository.
- Defined the product boundary: public reusable source code, private per-app deployment data.
- Added initial README and project documentation.

## 2026-09-11 — Core authentication

- Added the TypeScript + Express scaffold, health route, environment validation, security headers, CORS, and tests.
- Added user registration, bcrypt password hashing, login, JWT access tokens, opaque refresh sessions, and auth rate limiting.
- Added refresh-token rotation, token-family replay revocation, and logout.

## 2026-09-11 — Authorization layer

- Added Bearer-token verification with fixed HS256 algorithm, issuer, audience, subject, and role validation.
- Added typed authentication context to Express requests.
- Added `GET /api/v1/users/me` and admin-only `GET /api/v1/admin/users`.
- Added tests for missing tokens, valid signed tokens, and role-based denial.
- Verified a clean install, TypeScript typecheck, 18 tests, and production build locally.

## Next implementation milestones

1. Add database-backed happy-path tests.
2. Add Swagger documentation.
3. Add a shared rate-limit store before multi-instance deployment.
4. Add password-reset flow and security review.
