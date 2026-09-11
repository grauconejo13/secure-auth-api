# API Contract

Base path: `/api/v1`

## Health

### `GET /health`

Returns a lightweight liveness response for local development and deployment monitoring.

**Success response — `200 OK`**

```json
{
  "status": "ok",
  "service": "secure-auth-api",
  "timestamp": "2026-09-11T12:00:00.000Z",
  "uptimeSeconds": 42
}
```

## Planned endpoints

Authentication endpoints will be added only after the user model, password policy, token rotation, validation, rate limiting, and tests are designed together.

| Method | Path | Status |
|---|---|---|
| POST | `/auth/register` | Planned |
| POST | `/auth/login` | Planned |
| POST | `/auth/refresh` | Planned |
| POST | `/auth/logout` | Planned |
| POST | `/auth/forgot-password` | Planned |
| POST | `/auth/reset-password` | Planned |
