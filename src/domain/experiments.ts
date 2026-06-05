import type {
  AudienceCreativeMatrixRow,
  AudienceCreativePairing,
  AudienceSegment,
  BudgetCandidateScore,
  BudgetScenario,
  BudgetScenarioStrategy,
  CreativeAsset,
  Experiment,
  ExperimentDecision,
  NextAction,
  PairingState
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

const pairingStateRank: Record<PairingState, number> = {
  winning: 0,
  needsIteration: 1,
  stopped: 2,
  planned: 3,
  untested: 4
};

export const pairingStateLabels: Record<PairingState, string> = {
  winning: "Winning",
  needsIteration: "Needs iteration",
  stopped: "Stopped",
  planned: "Planned",
  untested: "Untested"
};

export function getPairingState(experiments: Experiment[]): PairingState {
  if (experiments.length === 0) {
    return "untested";
  }

  const states = experiments.map((experiment) => {
    const decision = classifyExperiment(experiment);

    if (decision === "scale") {
      return "winning";
    }

    if (decision === "iterate") {
      return "needsIteration";
    }

    if (decision === "stop") {
      return "stopped";
    }

    return "planned";
  });

  return states.sort((left, right) => pairingStateRank[left] - pairingStateRank[right])[0];
}

function getPrimaryExperiment(experiments: Experiment[], state: PairingState) {
  return experiments
    .filter((experiment) => {
      if (state === "untested") {
        return false;
      }

      return getPairingState([experiment]) === state;
    })
    .sort((left, right) => progressToTarget(right) - progressToTarget(left))[0];
}

export function describePairing(pairing: Pick<AudienceCreativePairing, "state" | "primaryExperiment">) {
  const { primaryExperiment, state } = pairing;

  if (state === "untested") {
    return {
      summary: "No linked experiment yet.",
      nextStep: "Use this as a learning gap, not a failure."
    };
  }

  if (!primaryExperiment) {
    return {
      summary: "Linked experiment needs review.",
      nextStep: "Check experiment notes before changing spend."
    };
  }

  const progress = Math.round(progressToTarget(primaryExperiment) * 100);

  if (state === "winning") {
    return {
      summary: `${primaryExperiment.title} reached ${progress}% of target.`,
      nextStep: "Reuse the pairing or test a controlled variant."
    };
  }

  if (state === "needsIteration") {
    return {
      summary: `${primaryExperiment.title} is at ${progress}% of target.`,
      nextStep: "Change one variable before running it again."
    };
  }

  if (state === "stopped") {
    return {
      summary: `${primaryExperiment.title} is weak or complete.`,
      nextStep: "Do not spend more until the angle changes."
    };
  }

  return {
    summary: `${primaryExperiment.title} is ready to launch.`,
    nextStep: "Run it before judging the pairing."
  };
}

export function buildAudienceCreativeMatrix(input: {
  audiences: AudienceSegment[];
  creativeAssets: CreativeAsset[];
  experiments: Experiment[];
}): AudienceCreativeMatrixRow[] {
  return input.audiences.map((audience) => ({
    audience,
    pairings: input.creativeAssets.map((asset) => {
      const linkedExperiments = input.experiments.filter(
        (experiment) =>
          experiment.audienceId === audience.id && experiment.creativeAssetId === asset.id
      );
      const state = getPairingState(linkedExperiments);
      const primaryExperiment = getPrimaryExperiment(linkedExperiments, state);
      const description = describePairing({ state, primaryExperiment });

      return {
        audienceId: audience.id,
        creativeAssetId: asset.id,
        state,
        experiments: linkedExperiments,
        primaryExperiment,
        summary: description.summary,
        nextStep: description.nextStep
      };
    })
  }));
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
