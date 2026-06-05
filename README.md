# Growth Lab

Growth Lab is a planned portfolio-grade web app for turning a small arts retail brand's messy online growth problem into an operating system: campaign planning, experiment tracking, year-over-year sales analysis, audience strategy, creative reuse, and weekly action recommendations.

The source inspiration is the PRSC/Stokes Croft China research note at `../../01_research/Online Marketer Needed - PRSC Job Post.txt`. This project is not a job application tool. It is the product that would help someone do the work well.

## Start Here

Use the project-specific prompt first:

```text
prompts/07-execute-growth-lab.md
```

That prompt tells Codex to read the brief and plan, then execute one implementation unit at a time.

For generic work inside this folder, use:

```text
prompts/00-start-here.md
```

## Key Docs

```text
docs/00-project-brief.md
docs/plans/2026-06-04-001-feat-growth-lab-command-center-plan.md
docs/03-decision-log.md
docs/04-architecture.md
```

## Current Build Posture

This project should start as a demo-first local web app with realistic mocked data. Real integrations can be added later for commerce, analytics, ads, social, and email platforms after the core workflows are strong.

## Live App

```text
https://breadback00-dev.github.io/growth-lab/
```

## Commands

```powershell
npm install
npm run dev
npm test
npm run build
npm run preview
```

## Local App

The Vite dev server prints the local URL when `npm run dev` starts. The default is usually:

```text
http://localhost:5173
```

## Preview Deployment

GitHub Pages is configured through `.github/workflows/pages.yml`. The repository is public, Pages is enabled, and pushes to `main` build, test, and deploy the app.

```text
https://breadback00-dev.github.io/growth-lab/
```
