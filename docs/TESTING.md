# Testing

## Fast verification

Run the regular suite without a database:

```bash
npm run typecheck
npm test
npm run build
```

These tests cover request validation, error boundaries, token verification, role enforcement, cookie handling, and rate limiting.

## Database-backed authentication flow

Run the integration scenario with:

```bash
npm run test:integration
```

The test starts a disposable local MongoDB instance using `mongodb-memory-server`; it does not connect to `MONGODB_URI` and does not use real accounts or production data.

The scenario proves this sequence:

1. Register an account.
2. Log in and receive access and refresh credentials.
3. Read the protected user profile using the access token.
4. Rotate the refresh token.
5. Replay the old refresh token and verify that its session family is revoked.
6. Log in again, log out, and verify that the logged-out session cannot refresh.

A runtime must permit a MongoDB child process and temporary data files. If your development sandbox blocks that operation, run this command in a normal local terminal or CI runner instead.
