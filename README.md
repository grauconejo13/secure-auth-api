# Secure Auth API

A portfolio-ready authentication and authorization API template for modern web applications.

This project demonstrates secure account flows without exposing real users, credentials, or production infrastructure. It is designed as a reusable backend foundation—not a shared identity database for every application.

## Current foundation

The first scaffold is in place:

- TypeScript + Express API structure
- Security defaults with Helmet, CORS, small JSON payload limits, and no framework fingerprint
- Strict environment-variable validation
- Versioned API routing
- `GET /api/v1/health` endpoint and integration test
- Graceful server shutdown handling
- `.env.example` and a Git ignore rule that protects real environment files

Authentication endpoints are intentionally not implemented until their data model, password policy, token lifecycle, rate limiting, and test plan are ready.

## Intended stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Database:** MongoDB
- **Authentication:** JWT + bcrypt/argon2
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

## Planned API surface

| Area | Example endpoints |
|---|---|
| Authentication | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout` |
| Account recovery | `POST /auth/forgot-password`, `POST /auth/reset-password` |
| User profile | `GET /users/me`, `PATCH /users/me` |
| Administration | `GET /admin/users`, `PATCH /admin/users/:id/role` |
| System | `GET /health` |

## Repository documentation

- [API contract](docs/API_CONTRACT.md)
- [Build log](docs/BUILD_LOG.md)
- [Decisions](docs/DECISIONS.md)
- [Token usage](docs/TOKEN_USAGE.md)
- [Performance and security notes](docs/PERFORMANCE.md)

## Status

Scaffold complete. Next: define the user model and registration flow.

## License

To be selected before the first public implementation release.
