import { describe, expect, it } from "vitest";
import {
  classifyExperiment,
  createExperimentDecision,
  getExperimentDecisions,
  groupExperimentsByAction,
  isPaidExperiment
} from "../src/domain/experiments";
import { experiments } from "../src/data/demoData";

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
