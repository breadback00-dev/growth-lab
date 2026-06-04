# Operating Loop

This project uses a right-sized work loop. Start simple and add structure only when it prevents mistakes.

Execute one step at a time. Finish or deliberately pause the current step before starting the next one.

## 1. Classify

- **Light:** local, obvious, low-risk.
- **Standard:** normal feature, bug, refactor, or integration.
- **Deep:** ambiguous, architectural, cross-cutting, risky, or product-shaping.

After scanning relevant files, revise the classification if new risk appears. Auth, schema, production data, external APIs, deployment, or multi-file coupling upgrades the task to at least Standard.

## 2. Choose The Work Mode

| Mode | Use When | Output |
| --- | --- | --- |
| Direct | Clear light task | Code/docs change plus verification |
| Ideate | Many possible directions | Ranked options |
| Brainstorm | One vague direction | Requirements/scope |
| Planned | Standard task with several steps | Short checklist or plan |
| Deep | High ambiguity/risk | Options, tradeoffs, plan, staged execution |
| Strict | TDD/debug/refactor discipline matters | Superpowers or equivalent strict workflow |
| ICM | Sequential repeatable workflow with review gates | Stage folders and stage contracts |

## 3. Scan

Read only the context needed for the current task:

- `AGENTS.md`
- `docs/00-project-brief.md`
- `docs/02-tool-router.md`
- relevant source files
- relevant tests
- current official docs or GitHub repos when external facts may be stale

Avoid loading everything just because it exists.

## 4. Ask Or Act

Ask one question only if the answer changes the direction, safety, architecture, or product behavior.

Otherwise act.

## 5. Implement

- Use existing patterns.
- Keep the diff scoped.
- Complete one implementation step before starting the next.
- Add tests when behavior changes.
- Prefer root-cause fixes over broad rewrites.
- Use scripts for mechanical repeated work.

## 6. Verify

Run the smallest useful check first:

- focused test
- repro
- typecheck/lint/build
- browser/manual check
- review of risky areas

Escalate to broader checks when the change has wider risk.

## 7. Review And Learn

Before finishing:

- review the diff for unrelated changes
- check edge cases and failure states
- note remaining risk
- capture durable learning only when it will help future work

If the same correction appears repeatedly, improve the source instruction, template, helper, or test.

## ICM Trigger

Create an ICM-style staged workflow only when the work is:

- sequential
- repeated across runs
- improved by human review gates

Use `templates/icm-stage-contract.md` if you create stages. Do not create stage folders for one-off work or a single complex feature.
