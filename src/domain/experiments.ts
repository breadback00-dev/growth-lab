import type { Experiment, NextAction } from "../types";

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
