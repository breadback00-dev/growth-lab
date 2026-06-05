import type {
  Campaign,
  CheckpointRecommendation,
  CheckpointScorecard,
  Experiment,
  MonthlySales,
  NextAction,
  PlanMonth
} from "../types";
import { classifyExperiment, isPaidExperiment } from "./experiments";
import { calculateGrowth, formatMoney } from "./growth";

export function getBudgetPosture(month: PlanMonth): string {
  if (month.budget === 0) {
    return "Organic and audit";
  }

  if (month.checkpoint) {
    return "Paid tests plus checkpoint";
  }

  return "Paid tests active";
}

export function getCheckpointMonths(months: PlanMonth[]): PlanMonth[] {
  return months.filter((month) => Boolean(month.checkpoint));
}

function createEmptyDecisionCounts(): Record<NextAction, number> {
  return { launch: 0, scale: 0, iterate: 0, stop: 0 };
}

export function classifyCheckpoint(input: {
  decisionCounts: Record<NextAction, number>;
  thresholdProgressPercent: number;
}): CheckpointRecommendation {
  const { decisionCounts, thresholdProgressPercent } = input;

  if (decisionCounts.stop > decisionCounts.scale || thresholdProgressPercent < 90) {
    return "pause";
  }

  if (decisionCounts.scale > 0 && thresholdProgressPercent >= 100) {
    return "scale";
  }

  return "iterate";
}

export function buildCheckpointSummary(scorecard: Omit<CheckpointScorecard, "summary">): string {
  const recommendationCopy: Record<CheckpointRecommendation, string> = {
    scale: "scale the strongest winner while keeping one comparison test active",
    iterate: "continue the programme, but tighten the weak tests before adding spend",
    pause: "pause new spend and fix the evidence base before scaling"
  };

  return `${scorecard.checkpoint}: ${scorecard.salesMonth} revenue is ${Math.round(
    scorecard.thresholdProgressPercent
  )}% of the 25 percent growth threshold. Organic tests: ${
    scorecard.organicExperiments
  }; paid tests: ${scorecard.paidExperiments}; paid spend: ${formatMoney(
    scorecard.paidSpend
  )}. Recommendation: ${recommendationCopy[scorecard.recommendation]}.`;
}

export function buildCheckpointScorecards(input: {
  months: PlanMonth[];
  campaigns: Campaign[];
  experiments: Experiment[];
  sales: MonthlySales[];
}): CheckpointScorecard[] {
  const latestSales = input.sales[input.sales.length - 1];
  const growth = calculateGrowth(latestSales);
  const thresholdProgressPercent =
    growth.thresholdRevenue === 0
      ? 0
      : (latestSales.currentRevenue / growth.thresholdRevenue) * 100;
  const decisionCounts = input.experiments.reduce<Record<NextAction, number>>(
    (counts, experiment) => {
      counts[classifyExperiment(experiment)] += 1;
      return counts;
    },
    createEmptyDecisionCounts()
  );
  const plannedPaidBudget = input.campaigns
    .filter((campaign) => campaign.channels.includes("paid"))
    .reduce((sum, campaign) => sum + campaign.budget, 0);
  const plannedOrganicBudget = input.campaigns
    .filter((campaign) => !campaign.channels.includes("paid"))
    .reduce((sum, campaign) => sum + campaign.budget, 0);
  const recordedPaidSpend = input.experiments
    .filter(isPaidExperiment)
    .reduce((sum, experiment) => sum + experiment.spend, 0);
  const recordedOrganicSpend = input.experiments
    .filter((experiment) => !isPaidExperiment(experiment))
    .reduce((sum, experiment) => sum + experiment.spend, 0);
  const paidSpend = plannedPaidBudget + recordedPaidSpend;
  const organicSpend = plannedOrganicBudget + recordedOrganicSpend;
  const paidExperiments = input.experiments.filter(isPaidExperiment).length;
  const organicExperiments = input.experiments.length - paidExperiments;
  const recommendation = classifyCheckpoint({ decisionCounts, thresholdProgressPercent });
  const checkpointMonths = getCheckpointMonths(input.months);

  return checkpointMonths.map((month) => {
    const scorecardWithoutSummary: Omit<CheckpointScorecard, "summary"> = {
      phase: month.phase,
      checkpoint: month.checkpoint ?? month.phase,
      salesMonth: latestSales.month,
      thresholdProgressPercent,
      currentRevenue: latestSales.currentRevenue,
      thresholdRevenue: growth.thresholdRevenue,
      organicSpend,
      paidSpend,
      organicExperiments,
      paidExperiments,
      decisionCounts,
      recommendation
    };

    return {
      ...scorecardWithoutSummary,
      summary: buildCheckpointSummary(scorecardWithoutSummary)
    };
  });
}
