# Code Review Prompt

Use this before shipping changes.

```text
Review these changes as a senior engineer.

Use ce-code-review if available. Otherwise:
- Inspect the diff.
- Prioritize bugs, regressions, missing tests, data issues, permission/auth problems, race conditions, UX failures, and maintainability risks.
- Do not focus on style unless it affects correctness or clarity.
- Report findings first, ordered by severity, with file and line references.
- If no issues are found, say that clearly and mention remaining test gaps or residual risk.

Scope:
<describe branch, files, PR, or feature here>
```

