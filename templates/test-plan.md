# Test Plan

## Scope

Growth Lab demo app: domain logic, dashboard rendering, responsive layout, and browser review.

## Test Commands

```text
npm test
npm run build
```

## Cases

| Case | Type | Expected Result | Status |
| --- | --- | --- | --- |
| Growth threshold math | Unit | 25 percent threshold and 15 percent reward are calculated correctly | Not run |
| Experiment decisions | Unit | Tests classify launch, scale, iterate, and stop correctly | Not run |
| Planning checkpoints | Unit | Month 1 is organic/audit and checkpoint months are detected | Not run |
| Recommendations | Unit | Weekly suggestions are deterministic and grounded in demo data | Not run |
| Dashboard browser review | Manual/browser | First screen renders dashboard-first navigation with no console errors | Not run |
| Responsive review | Manual/browser | Mobile and desktop layouts have no obvious text overlap | Not run |

## Unverified Areas

- Real commerce, analytics, ads, social, email, and AI integrations are intentionally deferred.
