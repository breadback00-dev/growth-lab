# Simplify Prompt

Use this after a feature works but feels heavier than it should.

```text
Simplify the recently changed code while preserving behavior.

Use ce-simplify-code if available. Otherwise:
- Read the changed files and tests.
- Identify complexity that is not earning its keep.
- Prefer existing project patterns.
- Remove speculative abstraction.
- Keep behavior unchanged.
- Run relevant tests.
- Explain what became simpler and what stayed intentionally complex.

Scope:
<describe files or feature here>
```

