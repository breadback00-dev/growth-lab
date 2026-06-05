import type {
  BudgetCandidateScore,
  BudgetScenario,
  BudgetScenarioStrategy,
  Experiment,
  ExperimentDecision,
  NextAction
} from "../types";

export function progressToTarget(experiment: Experiment): number {
  if (experiment.targetValue === 0) {
    return 0;
  }

  return experiment.metricValue / experiment.targetValue;
}

export function classifyExperiment(experiment: Experiment): NextAction {
  if (experiment.status === "planned") {
    return "launch";
  }

  const progress = progressToTarget(experiment);

  if (progress >= 1.15 && experiment.confidence === "high") {
    return "scale";
  }

  if (progress < 0.55 && experiment.status === "complete") {
    return "stop";
  }

  return "iterate";
}

export function groupExperimentsByAction(experiments: Experiment[]) {
  return experiments.reduce<Record<NextAction, Experiment[]>>(
    (groups, experiment) => {
      groups[classifyExperiment(experiment)].push(experiment);
      return groups;
    },
    { launch: [], scale: [], iterate: [], stop: [] }
  );
}

export function isPaidExperiment(experiment: Experiment): boolean {
  return experiment.channel === "paid" || experiment.spend > 0;
}

export function createExperimentDecision(input: {
  experiment: Experiment;
  reasoning: string;
  nextExperimentIdea: string;
  decidedAt?: string;
}): ExperimentDecision {
  const decidedAt = input.decidedAt ?? new Date().toISOString();

  return {
    id: `decision-${input.experiment.id}-${decidedAt}`,
    experimentId: input.experiment.id,
    decision: classifyExperiment(input.experiment),
    decidedAt,
    reasoning: input.reasoning.trim(),
    nextExperimentIdea: input.nextExperimentIdea.trim()
  };
}

export function getExperimentDecisions(
  experimentId: string,
  decisions: ExperimentDecision[]
): ExperimentDecision[] {
  return decisions
    .filter((decision) => decision.experimentId === experimentId)
    .sort((left, right) => right.decidedAt.localeCompare(left.decidedAt));
}

const confidenceWeight: Record<Experiment["confidence"], number> = {
  low: 0.55,
  medium: 0.9,
  high: 1.25
};

const decisionWeight: Record<NextAction, number> = {
  launch: 0.7,
  scale: 1.35,
  iterate: 0.95,
  stop: 0
};

const channelWeight: Record<Experiment["channel"], number> = {
  organic: 0.72,
  paid: 1.1,
  email: 0.9,
  retail: 0.58
};

export function scoreBudgetCandidate(experiment: Experiment): BudgetCandidateScore {
  const decision = classifyExperiment(experiment);
  const progress = Math.min(progressToTarget(experiment), 1.4);
  const baseScore =
    progress *
    confidenceWeight[experiment.confidence] *
    decisionWeight[decision] *
    channelWeight[experiment.channel];
  const paidReadiness = isPaidExperiment(experiment) || decision === "scale" ? 1 : 0.72;
  const score = Math.round(baseScore * paidReadiness * 100) / 100;

  return {
    experimentId: experiment.id,
    decision,
    score,
    rationale:
      decision === "stop"
        ? "Stopped or weak evidence; keep paid budget out."
        : `${experiment.confidence} confidence, ${Math.round(progress * 100)}% to target, ${experiment.channel} signal`
  };
}

function allocateByScores(
  candidates: BudgetCandidateScore[],
  budget: number,
  strategy: BudgetScenarioStrategy
) {
  const activeCandidates = candidates.filter((candidate) => candidate.score > 0);
  const adjustedCandidates = activeCandidates.map((candidate) => ({
    ...candidate,
    adjustedScore:
      strategy === "learning" && (candidate.decision === "launch" || candidate.decision === "iterate")
        ? candidate.score * 1.25
        : candidate.score
  }));
  const totalScore = adjustedCandidates.reduce((sum, candidate) => sum + candidate.adjustedScore, 0);

  if (totalScore === 0 || budget <= 0) {
    return candidates.map((candidate) => ({
      amount: 0,
      candidate,
      estimatedContribution: 0
    }));
  }

  const rawAllocations = adjustedCandidates.map((candidate) => ({
    candidate,
    rawAmount: (budget * candidate.adjustedScore) / totalScore
  }));
  const roundedAllocations = rawAllocations.map((allocation) => ({
    candidate: allocation.candidate,
    amount: Math.floor(allocation.rawAmount / 10) * 10
  }));
  const roundingDelta =
    budget - roundedAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);
  const topAllocation = roundedAllocations.reduce((top, allocation) =>
    allocation.candidate.adjustedScore > top.candidate.adjustedScore ? allocation : top
  );
  topAllocation.amount += roundingDelta;

  return candidates.map((candidate) => {
    const allocation = roundedAllocations.find(
      (match) => match.candidate.experimentId === candidate.experimentId
    );
    const amount = allocation?.amount ?? 0;
    const contributionMultiplier = 0.55 + Math.min(candidate.score, 1.8);

    return {
      amount,
      candidate,
      estimatedContribution: Math.round(amount * contributionMultiplier)
    };
  });
}

export function buildBudgetAllocationScenarios(
  experiments: Experiment[],
  budget: number
): BudgetScenario[] {
  const candidates = experiments
    .map(scoreBudgetCandidate)
    .sort((left, right) => right.score - left.score);
  const scenarioSeeds: Array<{
    id: BudgetScenarioStrategy;
    name: string;
    summary: string;
    budget: number;
    allocations: ReturnType<typeof allocateByScores>;
  }> = [
    {
      id: "evidence",
      name: "Evidence-led scale",
      summary: "Weights spend toward the strongest confident signal and avoids stopped tests.",
      budget,
      allocations: allocateByScores(candidates, budget, "evidence")
    },
    {
      id: "learning",
      name: "Learning split",
      summary: "Keeps the winner funded while reserving more room for launch and iterate signals.",
      budget,
      allocations: allocateByScores(candidates, budget, "learning")
    }
  ];

  return scenarioSeeds.map((scenario) => ({
    ...scenario,
    estimatedContribution: scenario.allocations.reduce(
      (sum, allocation) => sum + allocation.estimatedContribution,
      0
    ),
    allocations: scenario.allocations.map((allocation) => ({
      experimentId: allocation.candidate.experimentId,
      amount: allocation.amount,
      score: allocation.candidate.score,
      estimatedContribution: allocation.estimatedContribution,
      rationale: allocation.candidate.rationale
    }))
  }));
}
