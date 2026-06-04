import type { PlanMonth } from "../types";

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
