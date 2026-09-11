# Token Usage

This file tracks two different things clearly: application authentication tokens and AI-assisted build usage.

## Authentication-token policy

- Access tokens should be short-lived.
- Refresh tokens should be revocable and stored with appropriate protection.
- Never log raw bearer tokens, passwords, password-reset tokens, or token secrets.
- Never commit signing secrets or real environment files.
- Token expiration, rotation, and revocation behavior must be covered by tests before deployment.

## AI-assisted development log

| Date | Work assisted | Output | Review performed |
|---|---|---|---|
| 2026-09-11 | Repository documentation and project scope | README and initial docs | Checked boundaries: no real credentials, shared user data, or production claims |

Future entries should record the task, what was generated or changed, and the human verification completed—not sensitive prompts, secrets, or user data.
