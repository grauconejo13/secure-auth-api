# Decisions

## Public template, private deployments

**Decision:** Keep this repository public, but run each real application with separate deployment settings, databases, and user accounts.

**Why:** The code is useful portfolio evidence and reusable infrastructure. Mixing unrelated products into one user database would create unnecessary privacy and security risk.

## API-first backend

**Decision:** Build this as a documented REST API before attaching it to a specific frontend.

**Why:** It can support future React, Android, or serverless clients and keeps the authentication layer independently testable.

## Role-based authorization

**Decision:** Start with `user`, `admin`, and `staff` roles.

**Why:** It demonstrates more realistic authorization than a login-only demo while staying small enough to document and test well.

## Password handling

**Decision:** Enforce a 12-character, mixed-character password policy and hash passwords with bcrypt at 12 rounds.

**Why:** Passwords must never be stored in plaintext. The 72-byte check prevents bcrypt’s input-length limit from silently weakening a longer password.

## Duplicate email response

**Decision:** Return a generic `EMAIL_UNAVAILABLE` response for duplicate registration attempts.

**Why:** It does not confirm the existing account’s specific state or reveal any user details.

## Access tokens and refresh sessions

**Decision:** Issue a 15-minute HS256 JWT access token and store a separate opaque 30-day refresh token only as a SHA-256 hash in MongoDB.

**Why:** The JWT is small and short-lived for API authorization. The opaque session is individually revocable and its raw value is not retained by the server.

## Refresh-token rotation and replay response

**Decision:** Each refresh token is single-use. Its session record is marked consumed before a replacement is created; presenting a consumed token revokes the entire token family.

**Why:** A copied previous refresh token cannot silently continue a session after rotation. Revoking the family forces a fresh login after detected replay.

## Refresh-token transport

**Decision:** Send the refresh token in an HttpOnly, SameSite=Strict cookie scoped to `/api/v1/auth`; return the access token in the login/refresh JSON response.

**Why:** Browser JavaScript cannot read the refresh token. The client can keep the access token in memory and attach it explicitly to API calls.

## Rate-limiting scope

**Decision:** Apply a 10-attempt, 15-minute rate limit to authentication endpoints.

**Why:** It slows basic credential-stuffing attempts. The in-memory store is acceptable for this single-instance starter; production with multiple instances needs a shared external store.

## Secrets never enter Git

**Decision:** Use environment variables and commit only `.env.example`.

**Why:** Token secrets, database URLs, email credentials, and third-party keys must stay outside source control.
