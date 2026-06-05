import type { Experiment, ExperimentDecision, NextAction } from "../types";

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
