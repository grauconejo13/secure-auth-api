# Secure Auth API

A portfolio-ready authentication and authorization API template for modern web applications.

This project demonstrates secure account flows without exposing real users, credentials, or production infrastructure. It is designed as a reusable backend foundation—not a shared identity database for every application.

## Current foundation

- TypeScript + Express API structure
- MongoDB user model with a unique normalized-email index
- `POST /api/v1/auth/register`, `/login`, `/refresh`, and `/logout`
- Strong password validation and bcrypt hashing at 12 rounds
- Short-lived JWT access tokens (15 minutes)
- Opaque, hashed, revocable refresh-session records (30 days)
- Refresh-token rotation with token-family replay detection
- HttpOnly refresh-token cookie scoped to `/api/v1/auth`
- Bearer-token verification with fixed issuer, audience, algorithm, and required role claim
- Protected `GET /api/v1/users/me` route
- Admin-only `GET /api/v1/admin/users` route
- `user`, `staff`, and `admin` role middleware
- 10-attempt / 15-minute authentication rate limit
- Security defaults with Helmet, credentialed CORS, small JSON payload limits, and no framework fingerprint
- 18 passing tests, including token and role middleware coverage

Database-backed authentication requires both `MONGODB_URI` and `JWT_ACCESS_SECRET`. Without them, the API starts for health checks but returns `503 Service Unavailable` for database-backed auth routes.

## Quick start

```bash
git clone https://github.com/grauconejo13/secure-auth-api.git
cd secure-auth-api
npm ci
cp .env.example .env
npm run dev
```

Then open `http://localhost:3000/api/v1/health`.

Set `MONGODB_URI` and a private 32+ character `JWT_ACCESS_SECRET` in your uncommitted `.env` file before testing authentication.

Run checks with:

```bash
npm run typecheck
npm test
npm run build
```

## Token handling

- Send the access token in an `Authorization: Bearer <token>` request header.
- Keep the access token in application memory, not browser local storage.
- The refresh token is never returned in JSON; it is sent as an HttpOnly cookie.
- Each refresh consumes the old token and replaces it. Reusing an older token revokes its entire session family.
- Logout revokes the current refresh session and clears the cookie.
- Role changes take effect after a new access token is issued; access tokens last 15 minutes.

## Project boundary

This repository is public source code and documentation only.

- Real API keys, database URLs, token secrets, and passwords stay in local or deployment environment variables.
- Commit only `.env.example`, never a real `.env`.
- Each production app should use its own deployment configuration, database, and accounts.

## Current API surface

| Area | Endpoints |
|---|---|
| Authentication | `POST /auth/register`, `/login`, `/refresh`, `/logout` implemented |
| User profile | `GET /users/me` implemented |
| Administration | `GET /admin/users?limit=20` implemented for `admin` |
| Account recovery | `POST /auth/forgot-password`, `POST /auth/reset-password` planned |
| System | `GET /health` implemented |

## Repository documentation

- [API contract](docs/API_CONTRACT.md)
- [Build log](docs/BUILD_LOG.md)
- [Decisions](docs/DECISIONS.md)
- [Token usage](docs/TOKEN_USAGE.md)
- [Performance and security notes](docs/PERFORMANCE.md)

## Status

Authentication and authorization foundation complete. Next: database-backed happy-path tests, Swagger, and deployment hardening.

## License

To be selected before the first public implementation release.
