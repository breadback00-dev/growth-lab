import { describe, expect, it } from "vitest";
import {
  audiences,
  campaigns,
  creativeAssets,
  experiments,
  monthlySales
} from "../src/data/demoData";
import {
  buildWeeklyActions,
  createWeeklyActionFromRecommendation,
  generateWeeklyRecommendations
} from "../src/domain/recommendations";
import { generateCopyVariants } from "../src/services/copyAssistant";
import type { WeeklyAction } from "../src/types";

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

describe("weekly actions", () => {
  it("turns recommendations into stable todo agenda items", () => {
    const recommendation = generateWeeklyRecommendations({
      sales: monthlySales,
      experiments,
      campaigns,
      audiences,
      creativeAssets
    })[0];
    const action = createWeeklyActionFromRecommendation(recommendation);

    expect(action.id).toBe(`action-${recommendation.id}`);
    expect(action.recommendationId).toBe(recommendation.id);
    expect(action.status).toBe("todo");
    expect(action.title).toBe(recommendation.title);
    expect(action.nextStep).toBe(recommendation.nextStep);
  });

  it("orders active weekly actions by priority before snoozed and done work", () => {
    const recommendations = generateWeeklyRecommendations({
      sales: monthlySales,
      experiments,
      campaigns,
      audiences,
      creativeAssets
    });
    const savedActions: WeeklyAction[] = [
      {
        ...createWeeklyActionFromRecommendation(recommendations[0]),
        status: "done"
      },
      {
        ...createWeeklyActionFromRecommendation(recommendations[1]),
        status: "snoozed"
      }
    ];
    const actions = buildWeeklyActions(recommendations, savedActions);

    expect(actions[0].status).toBe("todo");
    expect(actions[0].priority).toBe("medium");
    expect(actions[actions.length - 2].status).toBe("snoozed");
    expect(actions[actions.length - 1].status).toBe("done");
  });

  it("preserves snoozed carry-over items when their source recommendation is no longer live", () => {
    const recommendations = generateWeeklyRecommendations({
      sales: monthlySales,
      experiments,
      campaigns,
      audiences,
      creativeAssets
    });
    const carriedAction: WeeklyAction = {
      id: "action-old",
      recommendationId: "rec-old",
      priority: "high",
      title: "Follow up old learning",
      rationale: "A carried item should stay visible until reopened or completed.",
      nextStep: "Decide whether to rerun the old test.",
      status: "snoozed"
    };
    const actions = buildWeeklyActions(recommendations, [carriedAction]);

    expect(actions).toContainEqual(carriedAction);
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
