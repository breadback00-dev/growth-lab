# Debug Prompt

Use this for failing tests, errors, crashes, stack traces, broken workflows, or suspected regressions.

```text
Debug this systematically.

Use ce-debug if available. Otherwise follow this process:
- Reproduce or inspect the failure.
- Identify the expected behavior.
- Trace the failing path from symptom to root cause.
- Read relevant code before editing.
- Make the smallest fix that addresses the root cause.
- Add or update a regression test when practical.
- Run the focused test first, then broader checks if risk warrants it.
- Explain the root cause, fix, and verification.

Failure details:
<paste logs, stack trace, symptoms, or repro steps here>
```

