import { describe, expect, it } from "vitest";
import { getBudgetPosture, getCheckpointMonths } from "../src/domain/planning";
import { planMonths } from "../src/data/demoData";

describe("planning helpers", () => {
  it("marks month 1 as organic and audit", () => {
    expect(getBudgetPosture(planMonths[0])).toBe("Organic and audit");
  });

  it("detects checkpoint months", () => {
    const checkpoints = getCheckpointMonths(planMonths);

    expect(checkpoints.map((month) => month.phase)).toEqual(["Month 3", "Month 6"]);
  });
});
