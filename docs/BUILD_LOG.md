# Build Log

A short chronological record of meaningful project changes.

## 2026-09-11 — Repository foundation

- Created the public `secure-auth-api` repository.
- Defined the product boundary: public reusable source code, private per-app deployment data.
- Added initial README and project documentation.
- Selected a provisional implementation direction: TypeScript, Express, MongoDB, JWT, and OpenAPI.

## 2026-09-11 — API scaffold

- Added a Node 20+ TypeScript + Express project foundation.
- Added strict runtime environment validation with Zod and a safe `.env.example`.
- Added Helmet, CORS configuration, request-size limits, versioned routing, and standardized error responses.
- Added `GET /api/v1/health` plus an integration test.

## 2026-09-11 — Registration and login foundation

- Added typed MongoDB user and session models.
- Added `POST /api/v1/auth/register` and `/login`.
- Added strong input validation, bcrypt hashing at 12 rounds, and generic invalid-credential handling.
- Added 15-minute HS256 JWT access tokens, opaque refresh sessions, and HttpOnly cookies.
- Added a 10-attempt, 15-minute auth rate limiter.

## 2026-09-11 — Session rotation and logout

- Added cookie parsing, `POST /api/v1/auth/refresh`, and `/logout`.
- Added single-use refresh tokens, replacement sessions, and session-family replay revocation.
- Added cookie and route-boundary tests.
- Updated the dependency lockfile.
- Verified a clean install, TypeScript typecheck, 15 tests, and production build locally.

## Next implementation milestones

1. Add protected-route and role middleware.
2. Add a shared rate-limit store before multi-instance deployment.
3. Add Swagger documentation and database-backed integration tests.
4. Add password-reset flow and security review.
