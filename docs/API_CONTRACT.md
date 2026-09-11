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

## Authentication

### `POST /auth/register`

Creates a user account when MongoDB is connected. This endpoint does **not** issue access tokens yet.

**Request body**

```json
{
  "email": "vanessa@example.com",
  "password": "Tranquility!2026",
  "displayName": "Vanessa"
}
```

Password requirements:

- 12–72 characters and no more than 72 UTF-8 bytes
- at least one lowercase letter, uppercase letter, number, and symbol
- must not contain the email name

**Success response — `201 Created`**

```json
{
  "data": {
    "id": "mongodb-user-id",
    "email": "vanessa@example.com",
    "displayName": "Vanessa",
    "role": "user",
    "createdAt": "2026-09-11T12:00:00.000Z"
  }
}
```

The response never includes the password hash.

**Expected errors**

| Status | Code | Meaning |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Request data fails validation |
| `409` | `EMAIL_UNAVAILABLE` | An account cannot be created with those details |
| `503` | `SERVICE_UNAVAILABLE` | MongoDB is not connected |

## Planned endpoints

| Method | Path | Status |
|---|---|---|
| POST | `/auth/login` | Planned |
| POST | `/auth/refresh` | Planned |
| POST | `/auth/logout` | Planned |
| POST | `/auth/forgot-password` | Planned |
| POST | `/auth/reset-password` | Planned |
