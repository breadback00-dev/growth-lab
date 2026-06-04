import type { MonthlySales } from "../types";

export interface ParseSalesResult {
  rows: MonthlySales[];
  errors: string[];
}

const requiredColumns = ["month", "previousYearRevenue", "currentRevenue", "isSeasonalPeak"];

function parseBoolean(value: string): boolean | undefined {
  const normalized = value.trim().toLowerCase();

  if (["true", "yes", "1", "seasonal"].includes(normalized)) {
    return true;
  }

  if (["false", "no", "0", "regular", ""].includes(normalized)) {
    return false;
  }

  return undefined;
}

export function parseSalesCsv(csv: string): ParseSalesResult {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return { rows: [], errors: ["Add a header row and at least one sales row."] };
  }

  const headers = lines[0].split(",").map((header) => header.trim());
  const errors: string[] = [];

  for (const column of requiredColumns) {
    if (!headers.includes(column)) {
      errors.push(`Missing required column: ${column}`);
    }
  }

  if (errors.length > 0) {
    return { rows: [], errors };
  }

  const rows = lines.slice(1).flatMap((line, index) => {
    const values = line.split(",").map((value) => value.trim());
    const record = Object.fromEntries(headers.map((header, headerIndex) => [header, values[headerIndex] ?? ""]));
    const previousYearRevenue = Number(record.previousYearRevenue);
    const currentRevenue = Number(record.currentRevenue);
    const isSeasonalPeak = parseBoolean(record.isSeasonalPeak);

    if (!record.month) {
      errors.push(`Row ${index + 2}: month is required.`);
    }

    if (!Number.isFinite(previousYearRevenue)) {
      errors.push(`Row ${index + 2}: previousYearRevenue must be numeric.`);
    }

    if (!Number.isFinite(currentRevenue)) {
      errors.push(`Row ${index + 2}: currentRevenue must be numeric.`);
    }

    if (isSeasonalPeak === undefined) {
      errors.push(`Row ${index + 2}: isSeasonalPeak must be true or false.`);
    }

    if (isSeasonalPeak === undefined || errors.some((error) => error.startsWith(`Row ${index + 2}:`))) {
      return [];
    }

    return [
      {
        month: record.month,
        monthIndex: index + 1,
        previousYearRevenue,
        currentRevenue,
        isSeasonalPeak
      }
    ];
  });

  return { rows, errors };
}
