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

Password requirements: 12–72 characters, at most 72 UTF-8 bytes, mixed case, number, symbol, and no email name.

### `POST /auth/login`

Verifies credentials, returns a 15-minute access token, and sets a 30-day HttpOnly `refresh_token` cookie. The raw refresh token is never returned in JSON and only its SHA-256 hash is stored in MongoDB.

### `POST /auth/refresh`

Reads the `refresh_token` HttpOnly cookie, consumes it, creates a replacement refresh token in the same session family, and returns a new access token.

**Request body:** none.

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

The response replaces the existing `refresh_token` cookie.

If an already-consumed refresh token is presented, the API revokes every unexpired session in that token family and requires a new sign-in.

### `POST /auth/logout`

Revokes the current refresh-session record when a refresh cookie is present, clears the cookie, and returns **`204 No Content`**.

**Expected errors**

| Status | Code | Meaning |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Request data fails validation |
| `401` | `INVALID_CREDENTIALS` | Email or password is incorrect |
| `401` | `INVALID_REFRESH_TOKEN` | Refresh token is invalid, expired, or missing |
| `401` | `REFRESH_TOKEN_REUSED` | Previously consumed token detected; family revoked |
| `409` | `EMAIL_UNAVAILABLE` | An account cannot be created with those details |
| `429` | `TOO_MANY_AUTH_ATTEMPTS` | Authentication attempt limit reached |
| `503` | `SERVICE_UNAVAILABLE` | Required service configuration is unavailable |

## Planned endpoints

| Method | Path | Status |
|---|---|---|
| GET | `/users/me` | Planned |
| POST | `/auth/forgot-password` | Planned |
| POST | `/auth/reset-password` | Planned |
