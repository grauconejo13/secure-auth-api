# Secure Auth API

A portfolio-ready authentication and authorization API template for modern web applications.

This project demonstrates secure account flows without exposing real users, credentials, or production infrastructure. It is designed as a reusable backend foundation—not a shared identity database for every application.

## Current foundation

- TypeScript + Express API structure
- MongoDB user model with a unique normalized-email index
- `POST /api/v1/auth/register` registration endpoint
- `POST /api/v1/auth/login` login endpoint
- Strong password validation and bcrypt hashing at 12 rounds
- Short-lived JWT access tokens (15 minutes)
- Opaque, hashed, revocable refresh-session records (30 days)
- HttpOnly refresh-token cookie scoped to `/api/v1/auth`
- 10-attempt / 15-minute authentication rate limit
- Security defaults with Helmet, credentialed CORS, small JSON payload limits, and no framework fingerprint
- Strict environment-variable validation
- Versioned API routing and standardized error responses
- `GET /api/v1/health` endpoint
- Validation, route-boundary, and rate-limit tests
- Graceful server shutdown and safe `.env.example` handling

Database-backed authentication requires both `MONGODB_URI` and `JWT_ACCESS_SECRET`. Without them, the API starts for health checks but returns `503 Service Unavailable` for login or registration as appropriate.

## Intended stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Database:** MongoDB + Mongoose
- **Authentication:** bcrypt, JOSE/JWT, opaque refresh sessions
- **Documentation:** OpenAPI / Swagger
- **Testing:** Vitest + Supertest

## Quick start

```bash
git clone https://github.com/grauconejo13/secure-auth-api.git
cd secure-auth-api
npm ci
cp .env.example .env
npm run dev
```

Then open `http://localhost:3000/api/v1/health`.

Set `MONGODB_URI` and a private 32+ character `JWT_ACCESS_SECRET` in your uncommitted `.env` file before testing login.

Run checks with:

```bash
npm run typecheck
npm test
npm run build
```

## Token handling

- Send the returned access token only in an `Authorization: Bearer <token>` request header.
- Keep the access token in application memory, not browser local storage.
- The refresh token is never returned in JSON; it is sent as an HttpOnly cookie.
- Refresh and logout endpoints are the next auth slice; do not call this production-ready until they and a shared rate-limit store are added.

## Project boundary

This repository is public source code and documentation only.

- Real API keys, database URLs, token secrets, and passwords stay in local or deployment environment variables.
- Commit only `.env.example`, never a real `.env`.
- Each production app should use its own deployment configuration, database, and accounts.

## Current API surface

| Area | Endpoints |
|---|---|
| Authentication | `POST /auth/register`, `POST /auth/login` implemented; refresh and logout planned |
| Account recovery | `POST /auth/forgot-password`, `POST /auth/reset-password` planned |
| User profile | `GET /users/me`, `PATCH /users/me` planned |
| Administration | `GET /admin/users`, `PATCH /admin/users/:id/role` planned |
| System | `GET /health` implemented |

## Repository documentation

- [API contract](docs/API_CONTRACT.md)
- [Build log](docs/BUILD_LOG.md)
- [Decisions](docs/DECISIONS.md)
- [Token usage](docs/TOKEN_USAGE.md)
- [Performance and security notes](docs/PERFORMANCE.md)

## Status

Login and token/session foundation complete. Next: refresh, logout, and protected-route middleware.

## License

To be selected before the first public implementation release.
