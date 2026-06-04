# Tool And Skill Router

Use this file to decide what kind of help the project needs. The default is normal Codex execution. Escalate only when a tool, skill, plugin, or workflow reduces risk, saves time, or improves quality.

Before routing to a plugin, skill, browser, GitHub, or side-agent capability, confirm it is available in the current environment. If unavailable, use the closest fallback or state the limitation.

## Default Path: Normal Codex

Use normal Codex when:

- The task is light or clearly scoped.
- The relevant files are local.
- No external research is needed.
- Existing project patterns are obvious.
- The change can be verified with focused tests or inspection.

Examples:

- small bug fix
- copy update
- focused test
- local refactor
- simple CLI/UI change

## Compound Engineering

Use Compound Engineering when the task benefits from flexible structure.

| Need | Use |
| --- | --- |
| Generate and compare possible directions | `ce-ideate` |
| Clarify product/feature shape | `ce-brainstorm` |
| Turn clear goal into implementation plan | `ce-plan` |
| Execute planned coding work | `ce-work` |
| Debug bug/error/test failure | `ce-debug` |
| Review changes before shipping | `ce-code-review` |
| Simplify recently changed code | `ce-simplify-code` |
| Capture reusable learning | `ce-compound` |
| Check plugin freshness | `ce-update` |

Do not use Compound Engineering by habit. Use it when the task would otherwise become vague, risky, or hard to review.

## Idea / Requirements Shaping

Route idea-shaped work before planning or coding:

| Task Shape | Route |
| --- | --- |
| Many possible directions, "what should we build/improve/change?" | Ideate |
| One vague direction, unclear users/scope/success criteria | Brainstorm |
| Clear goal but implementation path unclear | Plan |
| Clear local task | Execute |

Use `ce-ideate` when:

- the user asks for ideas, options, improvements, or surprising directions
- there are many possible paths
- the goal is to compare directions before choosing one

Use `ce-brainstorm` when:

- one direction exists but the product shape is unclear
- user flows, scope, non-goals, success criteria, or acceptance examples need definition
- planning would otherwise invent requirements

Skip both when:

- the user already gave clear requirements
- the task is a bug fix
- the change is local and obvious
- the user explicitly wants execution

## Sequential Execution

Execute one step at a time.

- Do not batch unrelated work.
- Do not start the next implementation step until the current step is complete or deliberately paused.
- For plans, execute the next unfinished step, verify it, then continue.
- If the next step changes scope, risk, dependency choice, or product behavior, pause and ask.
- Use parallelism only for read-only research or explicitly approved multi-agent work.

## Superpowers

Use `obra/superpowers`, if installed, as strict mode.

Good fit:

- TDD-first work
- systematic debugging
- high-stakes feature work
- disciplined refactors
- complex change sets where habits matter

Poor fit:

- tiny edits
- simple documentation updates
- quick explanations
- tasks where the overhead is larger than the risk

Reason: Superpowers is valuable because it enforces strong working discipline. That same strength makes it too heavy as an always-on default.

## Skills

Use skills when a repeatable workflow has a dedicated instruction bundle.

Good skill triggers:

- frontend design work
- code review
- debugging
- PR/CI work
- image generation
- OpenAI API/model guidance
- Notion/GitHub workflows
- plugin or skill creation

Rule: if a skill exactly matches the task and adds value beyond normal Codex execution, read and follow it. For Light tasks, use a skill only if the user names it or it materially changes safety, quality, or verification. If multiple useful skills apply, use the smallest set that covers the job.

Host or system-required skill rules still take precedence.

## GitHub

Use GitHub tools when the task involves:

- repositories
- issues
- pull requests
- CI checks
- review comments
- branches/releases
- finding examples from maintained repos

Use GitHub research before adopting a new library or plugin when maintenance/activity matters.

## Browser

Use Browser tools when:

- testing localhost or a web app
- verifying UI behavior
- capturing screenshots
- checking responsive layout
- confirming user-visible frontend changes

For frontend work, browser verification is usually part of done.

## Web Research

Research current sources when facts may have changed or when the recommendation could cost time/money.

Research before:

- choosing libraries or frameworks
- adopting plugins or GitHub projects
- using new APIs or AI models
- making security/compliance claims
- changing deployment/platform assumptions
- recommending paid tools or infrastructure

Source order:

1. Official docs.
2. Primary GitHub repo.
3. Releases/changelog/issues/discussions.
4. Secondary articles as supporting context.

## External Context Chooser

| Need | Use |
| --- | --- |
| Local repo, PR, issue, CI, branch, release | GitHub tools |
| One current official-doc lookup | Main agent researches directly |
| Multiple competing tools/libraries/plugins/repos | Research Scout |
| Maintenance/activity check for a GitHub project | GitHub research or Research Scout |
| Current API behavior for installed dependency | Check local version, then official docs/changelog |
| UI behavior or localhost verification | Browser tools |

## Local Scripts

Use scripts for mechanical work that does not need AI judgment:

- formatting generated files
- extracting text
- moving/copying template folders
- collecting static metadata
- running repeatable audits

If a step is repeated and mechanical, make or reuse a script instead of asking the model to do it manually every time.

## Side Agents

Use side agents sparingly. See `docs/06-delegation-router.md`.

Default:

- main agent only
- optional Research Scout for current external research or tool discovery
- ask before using more than one side agent

## ICM

Use ICM only when all three are true:

- The workflow is sequential.
- The same pipeline will run repeatedly with different input.
- Human review gates between stages would improve quality.

Good fit:

- research-to-report pipeline
- content production pipeline
- proposal/tender workflow
- repeated client-deliverable workflow
- coding feature pipeline where requirements, design, implementation, test, and docs need separate human review
- repeated feature-delivery pipeline with explicit human review gates across multiple runs

Poor fit:

- one-off coding tasks
- real-time multi-agent loops
- high-concurrency systems
- hidden automated branching
- tiny changes

ICM should provide observability and stage discipline, not folder complexity for its own sake.

## Foundation Tools To Prefer

Useful baseline for future coding work:

- Git
- ripgrep (`rg`)
- GitHub CLI (`gh`) for GitHub-backed work
- Node.js and `pnpm` for JS/TS projects
- Python and `uv` for Python or scripting-heavy projects
- Codex plugins/capabilities only when available and useful: Compound Engineering, GitHub, Browser
- Optional strict-mode plugin: Superpowers

Install only what you will actually use. Track project-specific setup in the project README or setup docs.

## Routing Examples

| Task | Route |
| --- | --- |
| Fix a typo | Normal Codex, no tools |
| Add a small local function | Normal Codex, focused test |
| Change user-visible UI | Normal Codex plus Browser verification |
| Debug failing CI on GitHub | GitHub tools plus focused debug |
| Choose a new auth/library/tool | Research Scout or direct official-doc/GitHub research |
| Explore what to build next | Ideate |
| Clarify a vague feature | Brainstorm |
| Unclear product feature | Compound brainstorm or plan |
| Repeated research-to-report process | Consider ICM |
| Strict TDD/refactor session | Superpowers if installed and wanted |
