import { describe, expect, it } from "vitest";
import {
  buildAudienceCreativeMatrix,
  buildBudgetAllocationScenarios,
  classifyExperiment,
  createExperimentDecision,
  getExperimentDecisions,
  getPairingState,
  groupExperimentsByAction,
  isPaidExperiment,
  scoreBudgetCandidate
} from "../src/domain/experiments";
import { audiences, creativeAssets, experiments } from "../src/data/demoData";

describe("classifyExperiment", () => {
  it("classifies planned experiments as launch", () => {
    const planned = experiments.find((experiment) => experiment.status === "planned");

    expect(planned).toBeDefined();
    expect(classifyExperiment(planned!)).toBe("launch");
  });

  it("classifies high-confidence winners as scale", () => {
    const winner = experiments.find((experiment) => experiment.id === "exp-local-caption");

    expect(winner).toBeDefined();
    expect(classifyExperiment(winner!)).toBe("scale");
  });

  it("classifies poor complete experiments as stop", () => {
    const weak = experiments.find((experiment) => experiment.id === "exp-design-carousel");

    expect(weak).toBeDefined();
    expect(classifyExperiment(weak!)).toBe("stop");
  });
});

describe("groupExperimentsByAction", () => {
  it("groups experiments into launch, scale, iterate, and stop decisions", () => {
    const groups = groupExperimentsByAction(experiments);

    expect(groups.launch).toHaveLength(1);
    expect(groups.scale).toHaveLength(1);
    expect(groups.iterate).toHaveLength(1);
    expect(groups.stop).toHaveLength(1);
  });

  it("detects paid tests by channel or spend", () => {
    const paid = experiments.find((experiment) => experiment.id === "exp-gift-bundle");
    const organic = experiments.find((experiment) => experiment.id === "exp-local-caption");

    expect(paid).toBeDefined();
    expect(organic).toBeDefined();
    expect(isPaidExperiment(paid!)).toBe(true);
    expect(isPaidExperiment(organic!)).toBe(false);
  });
});

describe("audience creative performance matrix", () => {
  it("derives pairing states from linked experiment evidence", () => {
    const matrix = buildAudienceCreativeMatrix({ audiences, creativeAssets, experiments });
    const localRow = matrix.find((row) => row.audience.id === "aud-local");
    const giftRow = matrix.find((row) => row.audience.id === "aud-gift");
    const touristRow = matrix.find((row) => row.audience.id === "aud-tourist");

    expect(localRow).toBeDefined();
    expect(giftRow).toBeDefined();
    expect(touristRow).toBeDefined();
    expect(
      localRow!.pairings.find((pairing) => pairing.creativeAssetId === "asset-maker-caption")
        ?.state
    ).toBe("winning");
    expect(
      giftRow!.pairings.find((pairing) => pairing.creativeAssetId === "asset-gift-bundle")
        ?.state
    ).toBe("needsIteration");
    expect(
      touristRow!.pairings.find((pairing) => pairing.creativeAssetId === "asset-gift-guide")
        ?.state
    ).toBe("planned");
  });

  it("keeps untested pairings visible without treating them as failures", () => {
    const matrix = buildAudienceCreativeMatrix({ audiences, creativeAssets, experiments });
    const collectorRow = matrix.find((row) => row.audience.id === "aud-collector");
    const untestedPairing = collectorRow!.pairings.find(
      (pairing) => pairing.creativeAssetId === "asset-gift-bundle"
    );

    expect(getPairingState([])).toBe("untested");
    expect(untestedPairing?.state).toBe("untested");
    expect(untestedPairing?.summary).toBe("No linked experiment yet.");
    expect(untestedPairing?.nextStep).toContain("learning gap");
  });
});

describe("experiment decision learning log", () => {
  it("creates a dated decision entry from the current experiment classification", () => {
    const winner = experiments.find((experiment) => experiment.id === "exp-local-caption");

    expect(winner).toBeDefined();
    const decision = createExperimentDecision({
      experiment: winner!,
      reasoning: "  Strongest signal and clear audience fit.  ",
      nextExperimentIdea: "  Try the same angle as an email subject.  ",
      decidedAt: "2026-06-05T12:00:00.000Z"
    });

    expect(decision).toEqual({
      id: "decision-exp-local-caption-2026-06-05T12:00:00.000Z",
      experimentId: "exp-local-caption",
      decision: "scale",
      decidedAt: "2026-06-05T12:00:00.000Z",
      reasoning: "Strongest signal and clear audience fit.",
      nextExperimentIdea: "Try the same angle as an email subject."
    });
  });

  it("returns learning history for one experiment newest first", () => {
    const decisions = [
      {
        id: "decision-old",
        experimentId: "exp-local-caption",
        decision: "iterate" as const,
        decidedAt: "2026-06-04T12:00:00.000Z",
        reasoning: "Older note",
        nextExperimentIdea: "Older idea"
      },
      {
        id: "decision-other",
        experimentId: "exp-gift-bundle",
        decision: "iterate" as const,
        decidedAt: "2026-06-06T12:00:00.000Z",
        reasoning: "Other experiment",
        nextExperimentIdea: "Other idea"
      },
      {
        id: "decision-new",
        experimentId: "exp-local-caption",
        decision: "scale" as const,
        decidedAt: "2026-06-05T12:00:00.000Z",
        reasoning: "Newer note",
        nextExperimentIdea: "Newer idea"
      }
    ];

    const history = getExperimentDecisions("exp-local-caption", decisions);

    expect(history.map((decision) => decision.id)).toEqual([
      "decision-new",
      "decision-old"
    ]);
  });
});

describe("budget allocation scoring", () => {
  it("prioritizes confident winners over weak stopped experiments", () => {
    const winner = experiments.find((experiment) => experiment.id === "exp-local-caption");
    const weak = experiments.find((experiment) => experiment.id === "exp-design-carousel");

    expect(winner).toBeDefined();
    expect(weak).toBeDefined();
    expect(scoreBudgetCandidate(winner!).score).toBeGreaterThan(scoreBudgetCandidate(weak!).score);
    expect(scoreBudgetCandidate(weak!).score).toBe(0);
  });

  it("builds comparable scenarios that allocate the full monthly budget", () => {
    const scenarios = buildBudgetAllocationScenarios(experiments, 300);
    const evidence = scenarios.find((scenario) => scenario.id === "evidence");
    const learning = scenarios.find((scenario) => scenario.id === "learning");

    expect(scenarios).toHaveLength(2);
    expect(evidence).toBeDefined();
    expect(learning).toBeDefined();
    expect(evidence!.allocations.reduce((sum, allocation) => sum + allocation.amount, 0)).toBe(300);
    expect(learning!.allocations.reduce((sum, allocation) => sum + allocation.amount, 0)).toBe(300);
    expect(evidence!.allocations.find((allocation) => allocation.experimentId === "exp-design-carousel")?.amount).toBe(0);
    expect(evidence!.allocations.find((allocation) => allocation.experimentId === "exp-local-caption")?.amount).toBeGreaterThan(
      evidence!.allocations.find((allocation) => allocation.experimentId === "exp-gift-bundle")?.amount ?? 0
    );
    expect(learning!.allocations.find((allocation) => allocation.experimentId === "exp-gift-bundle")?.amount).toBeGreaterThan(
      evidence!.allocations.find((allocation) => allocation.experimentId === "exp-gift-bundle")?.amount ?? 0
    );
  });

  it("keeps rounded allocations non-negative for small scenario budgets", () => {
    const [scenario] = buildBudgetAllocationScenarios(experiments, 25);

    expect(scenario.allocations.reduce((sum, allocation) => sum + allocation.amount, 0)).toBe(25);
    expect(scenario.allocations.every((allocation) => allocation.amount >= 0)).toBe(true);
  });
});
