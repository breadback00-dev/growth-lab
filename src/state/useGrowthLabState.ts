import { useCallback, useEffect, useMemo, useState } from "react";
import { experiments, monthlySales, planMonths } from "../data/demoData";
import type { Experiment, GrowthLabState, MonthlySales, PlanMonth } from "../types";

const STORAGE_KEY = "growth-lab-state-v2";

export const demoState: GrowthLabState = {
  monthlySales,
  planMonths,
  experiments
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
    return isGrowthLabState(parsed) ? parsed : demoState;
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
      resetToDemo
    }),
    [replaceMonthlySales, resetToDemo, state, updatePlanMonth, upsertExperiment]
  );
}
