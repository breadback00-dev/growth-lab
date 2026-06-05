import { describe, expect, it } from "vitest";
import {
  buildCheckpointScorecards,
  classifyCheckpoint,
  getBudgetPosture,
  getCheckpointMonths
} from "../src/domain/planning";
import { campaigns, experiments, monthlySales, planMonths } from "../src/data/demoData";

describe("planning helpers", () => {
  it("marks month 1 as organic and audit", () => {
    expect(getBudgetPosture(planMonths[0])).toBe("Organic and audit");
  });

  it("detects checkpoint months", () => {
    const checkpoints = getCheckpointMonths(planMonths);

    expect(checkpoints.map((month) => month.phase)).toEqual(["Month 3", "Month 6"]);
  });

  it("builds scorecards for checkpoint months with channel evidence", () => {
    const scorecards = buildCheckpointScorecards({
      months: planMonths,
      campaigns,
      experiments,
      sales: monthlySales
    });

    expect(scorecards).toHaveLength(2);
    expect(scorecards.map((scorecard) => scorecard.phase)).toEqual(["Month 3", "Month 6"]);
    expect(scorecards[0].paidExperiments).toBe(2);
    expect(scorecards[0].organicExperiments).toBe(2);
    expect(scorecards[0].paidSpend).toBe(470);
    expect(scorecards[0].organicSpend).toBe(0);
  });

  it("summarizes sales threshold progress and deterministic checkpoint decision", () => {
    const [scorecard] = buildCheckpointScorecards({
      months: planMonths,
      campaigns,
      experiments,
      sales: monthlySales
    });

    expect(Math.round(scorecard.thresholdProgressPercent)).toBe(92);
    expect(scorecard.currentRevenue).toBe(7100);
    expect(scorecard.thresholdRevenue).toBe(7750);
    expect(scorecard.decisionCounts).toEqual({
      launch: 1,
      scale: 1,
      iterate: 1,
      stop: 1
    });
    expect(scorecard.recommendation).toBe("iterate");
    expect(scorecard.summary).toContain("3-month review");
    expect(scorecard.summary).toContain("paid tests: 2");
  });

  it("classifies weak evidence as pause and strong evidence as scale", () => {
    expect(
      classifyCheckpoint({
        decisionCounts: { launch: 0, scale: 0, iterate: 1, stop: 2 },
        thresholdProgressPercent: 88
      })
    ).toBe("pause");
    expect(
      classifyCheckpoint({
        decisionCounts: { launch: 0, scale: 2, iterate: 1, stop: 0 },
        thresholdProgressPercent: 104
      })
    ).toBe("scale");
  });
});
