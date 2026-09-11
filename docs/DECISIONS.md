# Decisions

## Public template, private deployments

**Decision:** Keep this repository public, but run each real application with separate deployment settings, databases, and user accounts.

**Why:** The code is useful portfolio evidence and reusable infrastructure. Mixing unrelated products into one user database would create unnecessary privacy and security risk.

## API-first backend

**Decision:** Build this as a documented REST API before attaching it to a specific frontend.

**Why:** It can support future React, Android, or serverless clients and keeps the authentication layer independently testable.

## Role-based authorization

**Decision:** Start with `user`, `admin`, and `staff` roles. Require valid access tokens before any role check and expose an admin-only user-list route as a documented example.

**Why:** Authentication and authorization are different gates. A signed-in user should not automatically receive staff or admin access.

## Access-token verification

**Decision:** Verify the JWT signature and also require the configured HS256 algorithm, issuer, audience, subject, and role claim.

**Why:** Checking only whether a token decodes is not sufficient. Explicit claim and algorithm validation narrows what the API accepts.

## Password handling

**Decision:** Enforce a 12-character, mixed-character password policy and hash passwords with bcrypt at 12 rounds.

**Why:** Passwords must never be stored in plaintext. The 72-byte check prevents bcrypt’s input-length limit from silently weakening a longer password.

## Access tokens and refresh sessions

**Decision:** Issue a 15-minute HS256 JWT access token and store a separate opaque 30-day refresh token only as a SHA-256 hash in MongoDB.

**Why:** The JWT is small and short-lived for API authorization. The opaque session is individually revocable and its raw value is not retained by the server.

## Refresh-token rotation and replay response

**Decision:** Each refresh token is single-use. Its session record is marked consumed before a replacement is created; presenting a consumed token revokes the entire token family.

**Why:** A copied previous refresh token cannot silently continue a session after rotation. Revoking the family forces a fresh login after detected replay.

## Secrets never enter Git

**Decision:** Use environment variables and commit only `.env.example`.

**Why:** Token secrets, database URLs, email credentials, and third-party keys must stay outside source control.
