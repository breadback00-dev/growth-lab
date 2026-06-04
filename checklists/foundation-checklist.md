# Foundation Checklist

Use this when setting up a machine or a serious new coding workspace.

Install only what the project actually needs.

## Universal Candidates

- Git
- ripgrep (`rg`)
- a working browser for UI verification when building web/UI projects

## Conditional Local Tools

- GitHub CLI (`gh`) for GitHub-backed repos, PRs, issues, CI, or releases.
- Node.js and `pnpm` for JS/TS projects.
- Python and `uv` for Python projects or scripting-heavy workflows.
- `jq` for JSON-heavy CLI workflows.
- `fd` for file-finding-heavy CLI workflows.

## Codex Plugins / Capabilities To Consider

Install or enable only when the project actually uses the workflow.

- Compound Engineering: flexible brainstorm, plan, work, debug, review, and learning workflows.
- GitHub: repos, issues, PRs, CI, review comments.
- Browser: localhost/UI testing, screenshots, frontend verification.
- Superpowers (`obra/superpowers`): optional strict mode for TDD/debug/refactor discipline.

## Research Before Installing More

Before adding a new plugin, MCP server, framework, template repo, or dependency, check:

- Is it maintained?
- Does it solve a repeated problem?
- Does it reduce risk or save meaningful time?
- Does it add ongoing complexity?
- Is there an official or primary GitHub source?
- Can this be handled by a simpler local script?

## First-Run Project Setup

Before serious work, fill enough of `docs/00-project-brief.md` to anchor the project:

- one-line description
- user/customer
- primary outcome
- non-goals
- constraints
- success criteria

Record project-specific commands in the README:

- install
- dev server
- tests
- lint
- typecheck
- build
- deploy/release

Record project-specific agent instructions in `AGENTS.md`, not in every prompt.

