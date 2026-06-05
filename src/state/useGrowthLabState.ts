import { useCallback, useEffect, useMemo, useState } from "react";
import { experiments, monthlySales, planMonths } from "../data/demoData";
import type {
  Experiment,
  ExperimentDecision,
  GrowthLabState,
  MonthlySales,
  PlanMonth,
  WeeklyAction,
  WeeklyActionStatus
} from "../types";

const STORAGE_KEY = "growth-lab-state-v2";

export const demoState: GrowthLabState = {
  monthlySales,
  planMonths,
  experiments,
  experimentDecisions: [],
  weeklyActions: []
};

function isGrowthLabState(value: unknown): value is GrowthLabState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<GrowthLabState>;

  return (
    Array.isArray(candidate.monthlySales) &&
    Array.isArray(candidate.planMonths) &&
    Array.isArray(candidate.experiments)
  );
}

function normalizeGrowthLabState(value: GrowthLabState): GrowthLabState {
  return {
    monthlySales: value.monthlySales,
    planMonths: value.planMonths,
    experiments: value.experiments,
    experimentDecisions: Array.isArray(value.experimentDecisions)
      ? value.experimentDecisions
      : [],
    weeklyActions: Array.isArray(value.weeklyActions) ? value.weeklyActions : []
  };
}

function loadInitialState(): GrowthLabState {
  if (typeof window === "undefined") {
    return demoState;
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return demoState;
  }

  try {
    const parsed = JSON.parse(saved) as unknown;
    return isGrowthLabState(parsed) ? normalizeGrowthLabState(parsed) : demoState;
  } catch {
    return demoState;
  }
}

function createExperimentId(): string {
  return `exp-${Date.now().toString(36)}`;
}

export function useGrowthLabState() {
  const [state, setState] = useState<GrowthLabState>(loadInitialState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const upsertExperiment = useCallback((experiment: Experiment) => {
    setState((current) => {
      const exists = current.experiments.some((item) => item.id === experiment.id);
      const nextExperiment = experiment.id
        ? experiment
        : { ...experiment, id: createExperimentId() };

      return {
        ...current,
        experiments: exists
          ? current.experiments.map((item) =>
              item.id === nextExperiment.id ? nextExperiment : item
            )
          : [...current.experiments, nextExperiment]
      };
    });
  }, []);

  const updatePlanMonth = useCallback((phase: string, updates: Partial<PlanMonth>) => {
    setState((current) => ({
      ...current,
      planMonths: current.planMonths.map((month) =>
        month.phase === phase ? { ...month, ...updates } : month
      )
    }));
  }, []);

  const replaceMonthlySales = useCallback((sales: MonthlySales[]) => {
    setState((current) => ({ ...current, monthlySales: sales }));
  }, []);

  const setWeeklyActionStatus = useCallback(
    (action: WeeklyAction, status: WeeklyActionStatus) => {
      setState((current) => {
        const nextAction = { ...action, status };
        const exists = current.weeklyActions.some((item) => item.id === action.id);

        return {
          ...current,
          weeklyActions: exists
            ? current.weeklyActions.map((item) =>
                item.id === action.id ? nextAction : item
              )
            : [...current.weeklyActions, nextAction]
        };
      });
    },
    []
  );

  const recordExperimentDecision = useCallback((decision: ExperimentDecision) => {
    setState((current) => ({
      ...current,
      experimentDecisions: [
        decision,
        ...current.experimentDecisions.filter((item) => item.id !== decision.id)
      ]
    }));
  }, []);

  const resetToDemo = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setState(demoState);
  }, []);

  return useMemo(
    () => ({
      state,
      upsertExperiment,
      updatePlanMonth,
      replaceMonthlySales,
      recordExperimentDecision,
      setWeeklyActionStatus,
      resetToDemo
    }),
    [
      replaceMonthlySales,
      recordExperimentDecision,
      resetToDemo,
      setWeeklyActionStatus,
      state,
      updatePlanMonth,
      upsertExperiment
    ]
  );
}
