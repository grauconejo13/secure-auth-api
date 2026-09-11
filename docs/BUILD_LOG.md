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
- Added graceful shutdown handling and initial API-contract documentation.
- Verified a clean install, TypeScript typecheck, health-route test, and production build locally.

## 2026-09-11 — Registration foundation

- Added MongoDB connection lifecycle support and a typed user model.
- Added a normalized, unique email index and `user`, `staff`, and `admin` roles.
- Added `POST /api/v1/auth/register`.
- Added strong input validation, bcrypt hashing at 12 rounds, and generic duplicate-email handling.
- Added validation and route-boundary tests, including the no-database `503` behavior.

## 2026-09-11 — Login and token/session foundation

- Added `POST /api/v1/auth/login` with generic invalid-credential handling.
- Added 15-minute HS256 JWT access-token issuance using JOSE.
- Added opaque 30-day refresh sessions stored as SHA-256 hashes in MongoDB.
- Added HttpOnly, SameSite=Strict refresh-token cookies scoped to auth routes.
- Added a 10-attempt, 15-minute auth rate limiter and test coverage for its `429` response.
- Added login validation and route-boundary tests.
- Updated the dependency lockfile.
- Verified a clean install, TypeScript typecheck, 11 tests, and production build locally.

## Next implementation milestones

1. Implement refresh-token rotation and logout revocation.
2. Add protected-route and role middleware.
3. Add a shared rate-limit store before multi-instance deployment.
4. Add Swagger documentation and database-backed integration tests.
5. Add password-reset flow and security review.
