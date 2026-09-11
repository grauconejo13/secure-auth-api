# Secure Auth API

A portfolio-ready authentication and authorization API template for modern web applications.

This project demonstrates secure account flows without exposing real users, credentials, or production infrastructure. It is designed as a reusable backend foundation—not a shared identity database for every application.

## Current foundation

- TypeScript + Express API structure
- MongoDB user model with a unique normalized-email index
- `POST /api/v1/auth/register` registration endpoint
- Strong password validation and bcrypt hashing at 12 rounds
- Security defaults with Helmet, CORS, small JSON payload limits, and no framework fingerprint
- Strict environment-variable validation
- Versioned API routing and standardized error responses
- `GET /api/v1/health` endpoint
- Registration validation and route-boundary tests
- Graceful server shutdown and safe `.env.example` handling

Registration requires a MongoDB connection. Without `MONGODB_URI`, the API starts for health checks but returns `503 Service Unavailable` for database-backed endpoints.

## Intended stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Database:** MongoDB + Mongoose
- **Authentication:** bcrypt now; JWT access and refresh tokens next
- **Documentation:** OpenAPI / Swagger
- **Testing:** Vitest + Supertest

## Quick start

```bash
git clone https://github.com/grauconejo13/secure-auth-api.git
cd secure-auth-api
npm install
cp .env.example .env
npm run dev
```

Then open `http://localhost:3000/api/v1/health`.

To enable registration locally, set `MONGODB_URI` in your uncommitted `.env` file.

Run checks with:

```bash
npm run typecheck
npm test
npm run build
```

## Project boundary

This repository is public source code and documentation only.

- Real API keys, database URLs, token secrets, and passwords stay in local or deployment environment variables.
- Commit only `.env.example`, never a real `.env`.
- Each production app should use its own deployment configuration, database, and accounts.

## Current API surface

| Area | Endpoints |
|---|---|
| Authentication | `POST /auth/register` implemented; login, refresh, and logout planned |
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

Registration foundation complete. Next: login, secure token issuance, and refresh-token/session design.

## License

To be selected before the first public implementation release.
