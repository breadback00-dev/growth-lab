import { describe, expect, it } from "vitest";
import {
  audiences,
  campaigns,
  creativeAssets,
  experiments,
  monthlySales
} from "../src/data/demoData";
import { generateWeeklyRecommendations } from "../src/domain/recommendations";
import { generateCopyVariants } from "../src/services/copyAssistant";

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

describe("generateCopyVariants", () => {
  it("changes output based on audience, asset, and requested output type", () => {
    const giftVariants = generateCopyVariants({
      audience: audiences[1],
      asset: creativeAssets[1],
      brand: {
        name: "Stokes Croft China",
        mission: "Fine bone china with a Bristol community pulse.",
        followers: 13200,
        physicalVsOnlineSalesRatio: 3,
        monthlyPaidBudget: 300,
        tone: ["local", "crafted"],
        constraints: []
      },
      outputType: "bundleIdea"
    });

    expect(giftVariants).toHaveLength(3);
    expect(giftVariants[0].text.toLowerCase()).toContain("gift");
    expect(giftVariants[0].rationale).toContain(audiences[1].name);
    expect(giftVariants[0].rationale).toContain(creativeAssets[1].title);
  });
});
