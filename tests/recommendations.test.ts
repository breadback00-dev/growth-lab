import { describe, expect, it } from "vitest";
import {
  audiences,
  campaigns,
  creativeAssets,
  experiments,
  monthlySales
} from "../src/data/demoData";
import { generateWeeklyRecommendations } from "../src/domain/recommendations";

describe("generateWeeklyRecommendations", () => {
  it("creates stable recommendations from the same inputs", () => {
    const input = { sales: monthlySales, experiments, campaigns, audiences, creativeAssets };

    expect(generateWeeklyRecommendations(input)).toEqual(generateWeeklyRecommendations(input));
  });

  it("grounds recommendations in the brand operating data", () => {
    const recommendations = generateWeeklyRecommendations({
      sales: monthlySales,
      experiments,
      campaigns,
      audiences,
      creativeAssets
    });

    expect(recommendations.length).toBeGreaterThanOrEqual(4);
    expect(recommendations.some((item) => item.linkedExperimentId)).toBe(true);
    expect(recommendations.some((item) => item.title.toLowerCase().includes("gift"))).toBe(true);
  });
});
