# Simple vs Complex Checklist

## Prefer Simple

- One file or one local behavior.
- No shared state.
- No security, billing, auth, or data migration concerns.
- Existing pattern is obvious.
- Future extension is speculative.
- Duplication is small and clearer than abstraction.

## Prefer More System

- Shared behavior across multiple workflows.
- Multiple user roles, states, or failure modes.
- Needs auditability, observability, retries, queues, or migrations.
- Security, privacy, permissions, billing, or data integrity matters.
- The simple version would obviously be rewritten soon.
- The project already has a matching abstraction.

## Decision

Choose the lightest approach that is safe. Name what complexity is buying.

