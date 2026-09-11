# Secure Auth API

A portfolio-ready authentication and authorization API template for modern web applications.

This project demonstrates secure account flows without exposing real users, credentials, or production infrastructure. It is designed as a reusable backend foundation—not a shared identity database for every application.

## Planned capabilities

- Account registration and sign-in
- Password hashing and secure validation
- JWT access and refresh-token flow
- Role-based authorization: `user`, `admin`, and `staff`
- Protected API routes
- Password-reset workflow
- Request validation, rate limiting, and audit-friendly logs
- API documentation and automated tests

## Intended stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Database:** MongoDB
- **Authentication:** JWT + bcrypt/argon2
- **Documentation:** OpenAPI / Swagger
- **Testing:** Jest or Vitest + Supertest

The stack is a starting point and may evolve as implementation begins.

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

- [Build log](docs/BUILD_LOG.md)
- [Decisions](docs/DECISIONS.md)
- [Token usage](docs/TOKEN_USAGE.md)
- [Performance and security notes](docs/PERFORMANCE.md)

## Status

Planning and documentation phase. No production authentication service is deployed from this repository yet.

## License

To be selected before the first public implementation release.
