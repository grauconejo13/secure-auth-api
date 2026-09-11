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

## Short-lived access tokens with refresh flow

**Decision:** Add a short-lived access token plus a protected refresh-token/session mechanism after login is designed.

**Why:** It is safer and more realistic than a long-lived browser token. Exact storage and revocation details will be finalized before implementation.

## Secrets never enter Git

**Decision:** Use environment variables and commit only `.env.example`.

**Why:** Token secrets, database URLs, email credentials, and third-party keys must stay outside source control.
