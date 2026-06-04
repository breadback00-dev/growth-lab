# Architecture Notes

Use this only for architecture that matters to future work.

## Current Shape

Planned first version: a frontend-first TypeScript web app with realistic local seed data, pure domain logic for growth calculations, and a service layer that can later be swapped for real integrations.

## Key Modules

- App shell and navigation: dashboard, plan, experiments, audiences, creative library, recommendations.
- Domain logic: year-over-year comparison, 25 percent growth threshold, commission calculation, experiment status, channel spend, weekly recommendation scoring.
- Demo data: brand profile, products, historical monthly sales, social channels, audiences, campaigns, experiments, content assets.
- AI/copy assistant adapter: mock or local deterministic generator first; future provider integration behind a narrow interface.
- UI components: dense dashboard panels, tables, segmented controls, status badges, forms, and action queues.

## Data Model

- `BrandProfile`: name, mission, channels, constraints, tone, budget assumptions.
- `MonthlySales`: month, previous-year revenue, current revenue, target threshold, growth delta, commissionable amount.
- `Campaign`: goal, channel mix, audience, creative assets, budget, date range, status.
- `Experiment`: hypothesis, audience, channel, creative, spend, metric, result, confidence, next action.
- `AudienceSegment`: name, motivation, proof points, message angle, recommended channels.
- `CreativeAsset`: product, image metadata, caption ideas, campaign fit, reuse notes.
- `Recommendation`: priority, rationale, linked experiment or campaign, expected effort, next step.

## External Services

- Deferred: Shopify or commerce platform for orders and products.
- Deferred: GA4 or analytics provider for traffic and conversion.
- Deferred: Meta Ads or other ad platforms for spend and campaign results.
- Deferred: Instagram/social APIs for audience and content signals.
- Deferred: email marketing provider for newsletter performance.
- Deferred: OpenAI or another AI provider for campaign generation.

## Important Flows

- Dashboard review: operator sees sales position, growth threshold, active campaigns, experiment outcomes, and weekly priorities.
- Six-month planning: operator maps audit, organic tests, paid tests, checkpoint, and scale decisions.
- Experiment loop: create hypothesis, launch test, record result, decide stop/iterate/scale.
- Creative reuse: browse product/content assets, attach them to campaigns, generate copy variants.
- Audience strategy: choose a segment, see message angle, linked products, channels, and suggested tests.

## Known Weak Spots

- Real integrations will change data freshness, error handling, permissions, and privacy requirements.
- AI recommendations can become generic unless they are grounded in brand context, experiment results, and sales math.
- Dashboard scope can sprawl; the first version should privilege repeatable operator workflows over vanity charts.
