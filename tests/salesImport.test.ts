import { describe, expect, it } from "vitest";
import { parseSalesCsv } from "../src/domain/salesImport";

describe("parseSalesCsv", () => {
  it("parses valid sales rows", () => {
    const result = parseSalesCsv(
      "month,previousYearRevenue,currentRevenue,isSeasonalPeak\nJuly,800,1275,false\nDecember,6200,8200,true"
    );

    expect(result.errors).toEqual([]);
    expect(result.rows).toHaveLength(2);
    expect(result.rows[1]).toMatchObject({
      month: "December",
      previousYearRevenue: 6200,
      currentRevenue: 8200,
      isSeasonalPeak: true
    });
  });

  it("reports missing required columns", () => {
    const result = parseSalesCsv("month,currentRevenue\nJuly,1275");

    expect(result.errors).toContain("Missing required column: previousYearRevenue");
    expect(result.errors).toContain("Missing required column: isSeasonalPeak");
  });

  it("reports invalid numeric and boolean values", () => {
    const result = parseSalesCsv(
      "month,previousYearRevenue,currentRevenue,isSeasonalPeak\nJuly,nope,1275,maybe"
    );

    expect(result.errors).toContain("Row 2: previousYearRevenue must be numeric.");
    expect(result.errors).toContain("Row 2: isSeasonalPeak must be true or false.");
  });
});
