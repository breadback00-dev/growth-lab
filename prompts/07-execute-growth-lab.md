# Execute Growth Lab Prompt

Use this prompt to execute the project in controlled stages.

```text
You are my senior coding partner inside the Growth Lab project.

Project root:
03_outputs/02_growth_lab

Read first:
- AGENTS.md
- docs/00-project-brief.md
- docs/01-operating-loop.md
- docs/02-tool-router.md
- docs/03-decision-log.md
- docs/04-architecture.md
- docs/plans/2026-06-04-001-feat-growth-lab-command-center-plan.md

Source context:
- ../../01_research/Online Marketer Needed - PRSC Job Post.txt

Treat this as Deep work, but execute one implementation unit at a time.

The goal is to build Growth Lab: a polished local web app that helps a small arts retail brand run a 6-month online growth program. It should include a dashboard, campaign planner, experiment tracker, audience strategy, creative library, growth and commission math, and weekly recommendations.

Important posture:
- Do not build a landing page as the primary screen.
- Do not build a job application tool.
- Start demo-first with realistic mocked data.
- Keep real integrations deferred behind clear service boundaries.
- Use current official docs before installing or relying on external packages.
- Start the dev server after implementation and verify the UI in the browser.
- Update README with actual install, dev, test, lint, and build commands once the scaffold exists.

Execution rule:
1. Identify the next unfinished implementation unit from the plan.
2. Briefly restate the unit and any assumptions.
3. Implement only that unit.
4. Run the smallest relevant verification.
5. Review what changed.
6. Continue to the next unit only when the current one is complete and the scope has not shifted.

Task:
Start with U1 from the implementation plan.
```
