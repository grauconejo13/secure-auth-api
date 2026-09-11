# API Contract

Base path: `/api/v1`

## Authentication

Authentication endpoints are limited to 10 attempts per 15-minute window per process/IP in the current starter configuration.

### `POST /auth/register`

Creates a user account when MongoDB is connected. Passwords are validated and stored only as bcrypt hashes.

### `POST /auth/login`

Verifies credentials, returns a 15-minute access token, and sets a 30-day HttpOnly `refresh_token` cookie.

### `POST /auth/refresh`

Consumes the `refresh_token` cookie, rotates it, and returns a new access token. Reusing a consumed refresh token revokes that full session family.

### `POST /auth/logout`

Revokes the current refresh session, clears the cookie, and returns **`204 No Content`**.

## Protected routes

All routes below require:

```http
Authorization: Bearer <access-token>
```

The server verifies the token signature, issuer, audience, HS256 algorithm, subject, and role claim.

### `GET /users/me`

Returns the authenticated user’s current profile from MongoDB.

**Success response — `200 OK`**

```json
{
  "data": {
    "id": "mongodb-user-id",
    "email": "vanessa@example.com",
    "displayName": "Vanessa",
    "role": "user",
    "createdAt": "2026-09-11T12:00:00.000Z",
    "updatedAt": "2026-09-11T12:00:00.000Z"
  }
}
```

### `GET /admin/users?limit=20`

Requires the `admin` role. Returns up to 50 recent users and never includes password hashes or refresh-token data.

**Success response — `200 OK`**

```json
{
  "data": [
    {
      "id": "mongodb-user-id",
      "email": "vanessa@example.com",
      "displayName": "Vanessa",
      "role": "user",
      "createdAt": "2026-09-11T12:00:00.000Z"
    }
  ],
  "meta": { "limit": 20 }
}
```

**Expected errors**

| Status | Code | Meaning |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Request data fails validation |
| `401` | `UNAUTHORIZED` | Missing, malformed, expired, or invalid access token |
| `401` | `INVALID_CREDENTIALS` | Email or password is incorrect |
| `401` | `INVALID_REFRESH_TOKEN` | Refresh token is invalid, expired, or missing |
| `401` | `REFRESH_TOKEN_REUSED` | Previously consumed token detected; family revoked |
| `403` | `FORBIDDEN` | Valid token lacks the required role |
| `409` | `EMAIL_UNAVAILABLE` | An account cannot be created with those details |
| `429` | `TOO_MANY_AUTH_ATTEMPTS` | Authentication attempt limit reached |
| `503` | `SERVICE_UNAVAILABLE` | Required service configuration is unavailable |
