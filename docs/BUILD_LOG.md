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

## 2026-09-12 — Database-backed happy path

- Added a disposable MongoDB integration test covering registration, login, authenticated profile access, refresh rotation, replay-family revocation, logout, and post-logout denial.
- Kept the test opt-in as `npm run test:integration` so fast checks do not require a spawned database.
- The managed build environment blocks a MongoDB process from opening its temporary data files (`Operation not permitted`), so the integration command must run on normal local development or CI infrastructure.

## 2026-09-12 — OpenAPI documentation

- Added a live Swagger UI at `/api/v1/docs/` and a machine-readable OpenAPI 3.0.3 document at `/api/v1/openapi.json`.
- Documented every implemented endpoint, request constraint, Bearer-token requirement, refresh-cookie behavior, and expected error category.
- Added route-level coverage for the specification and interactive page.

## Next implementation milestones

1. Add Swagger documentation.
2. Add a shared rate-limit store before multi-instance deployment.
3. Add password-reset flow and security review.
