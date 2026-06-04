import type { MonthlySales } from "../types";

export interface GrowthResult {
  thresholdRevenue: number;
  growthAmount: number;
  growthPercent: number;
  commissionableRevenue: number;
  reward: number;
  isAboveThreshold: boolean;
}

export function calculateGrowth(month: MonthlySales): GrowthResult {
  const thresholdRevenue = month.previousYearRevenue * 1.25;
  const growthAmount = month.currentRevenue - month.previousYearRevenue;
  const growthPercent =
    month.previousYearRevenue === 0
      ? 0
      : (growthAmount / month.previousYearRevenue) * 100;
  const commissionableRevenue = Math.max(0, month.currentRevenue - thresholdRevenue);

  return {
    thresholdRevenue,
    growthAmount,
    growthPercent,
    commissionableRevenue,
    reward: commissionableRevenue * 0.15,
    isAboveThreshold: commissionableRevenue > 0
  };
}

export function summarizeSales(months: MonthlySales[]) {
  const latest = months[months.length - 1];
  const latestGrowth = calculateGrowth(latest);
  const nonSeasonalMonths = months.filter((month) => !month.isSeasonalPeak);
  const seasonalMonths = months.filter((month) => month.isSeasonalPeak);

  return {
    latest,
    latestGrowth,
    nonSeasonalAverage:
      nonSeasonalMonths.reduce((sum, month) => sum + month.currentRevenue, 0) /
      nonSeasonalMonths.length,
    seasonalAverage:
      seasonalMonths.reduce((sum, month) => sum + month.currentRevenue, 0) /
      Math.max(1, seasonalMonths.length)
  };
}

export function selectSalesMonth(months: MonthlySales[], monthName: string): MonthlySales {
  return months.find((month) => month.month === monthName) ?? months[months.length - 1];
}

export function formatMoney(value: number): string {
  return `GBP ${Math.round(value).toLocaleString("en-GB")}`;
}
