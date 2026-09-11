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

## Short-lived access tokens with refresh flow

**Decision:** Use a short-lived access token plus a protected refresh-token/session mechanism.

**Why:** It is safer and more realistic than a long-lived browser token. Exact storage and revocation details will be finalized during implementation.

## Secrets never enter Git

**Decision:** Use environment variables and commit only `.env.example`.

**Why:** Token secrets, database URLs, email credentials, and third-party keys must stay outside source control.
