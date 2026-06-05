import { describe, expect, it } from "vitest";
import {
  calculateGrowth,
  calculateScenarioThresholdImpact,
  selectSalesMonth,
  summarizeSales
} from "../src/domain/growth";
import { monthlySales } from "../src/data/demoData";

describe("calculateGrowth", () => {
  it("calculates the 25 percent threshold and 15 percent reward above threshold", () => {
    const result = calculateGrowth({
      month: "Example",
      monthIndex: 1,
      previousYearRevenue: 2000,
      currentRevenue: 3000,
      isSeasonalPeak: false
    });

    expect(result.thresholdRevenue).toBe(2500);
    expect(result.commissionableRevenue).toBe(500);
    expect(result.reward).toBe(75);
    expect(result.isAboveThreshold).toBe(true);
  });

  it("does not create commissionable revenue below the threshold", () => {
    const result = calculateGrowth({
      month: "Example",
      monthIndex: 1,
      previousYearRevenue: 1000,
      currentRevenue: 1190,
      isSeasonalPeak: false
    });

    expect(result.thresholdRevenue).toBe(1250);
    expect(result.commissionableRevenue).toBe(0);
    expect(result.reward).toBe(0);
    expect(result.isAboveThreshold).toBe(false);
  });
});

describe("summarizeSales", () => {
  it("keeps December visible as a seasonal outlier", () => {
    const summary = summarizeSales(monthlySales);

    expect(summary.seasonalAverage).toBeGreaterThan(summary.nonSeasonalAverage * 3);
  });
});

describe("selectSalesMonth", () => {
  it("returns the requested month when present", () => {
    expect(selectSalesMonth(monthlySales, "December").isSeasonalPeak).toBe(true);
  });

  it("falls back to the latest month when the requested month is absent", () => {
    expect(selectSalesMonth(monthlySales, "Nope").month).toBe("December");
  });
});

describe("calculateScenarioThresholdImpact", () => {
  it("estimates how proxy contribution changes threshold progress and upside", () => {
    const impact = calculateScenarioThresholdImpact(
      {
        month: "Example",
        monthIndex: 1,
        previousYearRevenue: 1000,
        currentRevenue: 1190,
        isSeasonalPeak: false
      },
      {
        id: "evidence",
        name: "Evidence-led scale",
        summary: "Proxy scenario",
        budget: 100,
        estimatedContribution: 100,
        allocations: []
      }
    );

    expect(impact.thresholdRevenue).toBe(1250);
    expect(impact.currentGapToThreshold).toBe(60);
    expect(impact.projectedGapToThreshold).toBe(0);
    expect(impact.projectedRevenue).toBe(1290);
    expect(impact.thresholdProgressDelta).toBe(8);
    expect(impact.estimatedCommissionableRevenue).toBe(40);
    expect(impact.estimatedReward).toBe(6);
  });
});
