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

Authentication endpoints are limited to 10 attempts per 15-minute window per process/IP in the current starter configuration.

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

### `POST /auth/login`

Verifies the email and password, then creates a short-lived access token and an opaque refresh session.

**Request body**

```json
{
  "email": "vanessa@example.com",
  "password": "Tranquility!2026"
}
```

**Success response — `200 OK`**

```json
{
  "data": {
    "accessToken": "signed-jwt",
    "tokenType": "Bearer",
    "expiresInSeconds": 900,
    "user": {
      "id": "mongodb-user-id",
      "email": "vanessa@example.com",
      "displayName": "Vanessa",
      "role": "user"
    },
    "refreshSessionExpiresAt": "2026-10-11T12:00:00.000Z"
  }
}
```

The response also sets a 30-day, HttpOnly, SameSite=Strict `refresh_token` cookie. The raw refresh token is never returned in JSON and only its SHA-256 hash is stored in MongoDB.

**Expected errors**

| Status | Code | Meaning |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Request data fails validation |
| `401` | `INVALID_CREDENTIALS` | Email or password is incorrect |
| `409` | `EMAIL_UNAVAILABLE` | An account cannot be created with those details |
| `429` | `TOO_MANY_AUTH_ATTEMPTS` | Authentication attempt limit reached |
| `503` | `SERVICE_UNAVAILABLE` | Required service configuration is unavailable |

## Planned endpoints

| Method | Path | Status |
|---|---|---|
| POST | `/auth/refresh` | Planned |
| POST | `/auth/logout` | Planned |
| POST | `/auth/forgot-password` | Planned |
| POST | `/auth/reset-password` | Planned |
