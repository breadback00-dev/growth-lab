import type {
  AudienceSegment,
  Campaign,
  CreativeAsset,
  Experiment,
  MonthlySales,
  Recommendation,
  WeeklyAction,
  WeeklyActionStatus
} from "../types";
import { calculateGrowth } from "./growth";
import { classifyExperiment } from "./experiments";

const priorityRank: Record<Recommendation["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2
};

const statusRank: Record<WeeklyActionStatus, number> = {
  todo: 0,
  snoozed: 1,
  done: 2
};

export function generateWeeklyRecommendations(input: {
  sales: MonthlySales[];
  experiments: Experiment[];
  campaigns: Campaign[];
  audiences: AudienceSegment[];
  creativeAssets: CreativeAsset[];
}): Recommendation[] {
  const latestSales = input.sales[input.sales.length - 1];
  const latestGrowth = calculateGrowth(latestSales);
  const scaleCandidate = input.experiments.find(
    (experiment) => classifyExperiment(experiment) === "scale"
  );
  const stalledExperiment = input.experiments.find(
    (experiment) => classifyExperiment(experiment) === "iterate"
  );
  const giftAudience = input.audiences.find((audience) =>
    audience.name.toLowerCase().includes("gift")
  );
  const bundleAsset = input.creativeAssets.find((asset) => asset.format === "bundle");
  const activeCampaign = input.campaigns.find((campaign) => campaign.status === "active");

  return [
    {
      id: "rec-threshold",
      priority: latestGrowth.isAboveThreshold ? "medium" : "high",
      title: latestGrowth.isAboveThreshold
        ? "Protect the month above threshold"
        : "Move the current month over the threshold",
      rationale: latestGrowth.isAboveThreshold
        ? `${latestSales.month} is above the 25 percent line; keep spend aimed at repeatable channels.`
        : `${latestSales.month} is below the 25 percent line; prioritize the fastest test with existing creative.`,
      nextStep: "Review the top active experiment and decide whether to scale spend this week.",
      linkedCampaignId: activeCampaign?.id
    },
    {
      id: "rec-scale",
      priority: scaleCandidate ? "high" : "medium",
      title: scaleCandidate ? `Scale: ${scaleCandidate.title}` : "Find one test worth scaling",
      rationale: scaleCandidate
        ? `${scaleCandidate.title} is beating target with high confidence.`
        : "No high-confidence winner exists yet, so the week needs a sharper comparison test.",
      nextStep: scaleCandidate
        ? "Move a larger share of the monthly paid budget to this test."
        : "Launch one paid and one organic variant against the same audience.",
      linkedExperimentId: scaleCandidate?.id
    },
    {
      id: "rec-copy",
      priority: "medium",
      title: giftAudience && bundleAsset ? "Turn gift buyers into a bundle test" : "Create one grounded copy set",
      rationale:
        giftAudience && bundleAsset
          ? `${giftAudience.name} has a clear motivation, and ${bundleAsset.title} already gives the offer shape.`
          : "The creative library has enough brand context for a non-generic copy test.",
      nextStep: "Generate three caption variants and one email subject line from the same audience angle."
    },
    {
      id: "rec-iterate",
      priority: stalledExperiment ? "medium" : "low",
      title: stalledExperiment ? `Fix or stop: ${stalledExperiment.title}` : "Keep the board tidy",
      rationale: stalledExperiment
        ? `${stalledExperiment.title} needs a decision before it consumes more attention.`
        : "No urgent stalled tests are visible this week.",
      nextStep: stalledExperiment
        ? "Change the audience or creative variable, then rerun for one week."
        : "Archive completed tests after their learning has been captured.",
      linkedExperimentId: stalledExperiment?.id
    }
  ];
}

export function createWeeklyActionFromRecommendation(
  recommendation: Recommendation,
  savedAction?: WeeklyAction
): WeeklyAction {
  return {
    id: savedAction?.id ?? `action-${recommendation.id}`,
    recommendationId: recommendation.id,
    priority: recommendation.priority,
    title: recommendation.title,
    rationale: recommendation.rationale,
    nextStep: recommendation.nextStep,
    status: savedAction?.status ?? "todo",
    linkedExperimentId: recommendation.linkedExperimentId,
    linkedCampaignId: recommendation.linkedCampaignId
  };
}

export function orderWeeklyActions(actions: WeeklyAction[]): WeeklyAction[] {
  return [...actions].sort((left, right) => {
    const statusDifference = statusRank[left.status] - statusRank[right.status];

    if (statusDifference !== 0) {
      return statusDifference;
    }

    const priorityDifference = priorityRank[left.priority] - priorityRank[right.priority];

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return left.title.localeCompare(right.title);
  });
}

export function buildWeeklyActions(
  recommendations: Recommendation[],
  savedActions: WeeklyAction[]
): WeeklyAction[] {
  const savedByRecommendation = new Map(
    savedActions.map((action) => [action.recommendationId, action])
  );
  const liveRecommendationIds = new Set(recommendations.map((recommendation) => recommendation.id));
  const activeActions = recommendations.map((recommendation) =>
    createWeeklyActionFromRecommendation(
      recommendation,
      savedByRecommendation.get(recommendation.id)
    )
  );
  const carriedActions = savedActions.filter(
    (action) => action.status === "snoozed" && !liveRecommendationIds.has(action.recommendationId)
  );

  return orderWeeklyActions([...activeActions, ...carriedActions]);
}
