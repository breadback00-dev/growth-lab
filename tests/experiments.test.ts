import { describe, expect, it } from "vitest";
import {
  classifyExperiment,
  groupExperimentsByAction,
  isPaidExperiment
} from "../src/domain/experiments";
import { experiments } from "../src/data/demoData";

describe("classifyExperiment", () => {
  it("classifies planned experiments as launch", () => {
    const planned = experiments.find((experiment) => experiment.status === "planned");

    expect(planned).toBeDefined();
    expect(classifyExperiment(planned!)).toBe("launch");
  });

  it("classifies high-confidence winners as scale", () => {
    const winner = experiments.find((experiment) => experiment.id === "exp-local-caption");

    expect(winner).toBeDefined();
    expect(classifyExperiment(winner!)).toBe("scale");
  });

  it("classifies poor complete experiments as stop", () => {
    const weak = experiments.find((experiment) => experiment.id === "exp-design-carousel");

    expect(weak).toBeDefined();
    expect(classifyExperiment(weak!)).toBe("stop");
  });
});

describe("groupExperimentsByAction", () => {
  it("groups experiments into launch, scale, iterate, and stop decisions", () => {
    const groups = groupExperimentsByAction(experiments);

    expect(groups.launch).toHaveLength(1);
    expect(groups.scale).toHaveLength(1);
    expect(groups.iterate).toHaveLength(1);
    expect(groups.stop).toHaveLength(1);
  });

  it("detects paid tests by channel or spend", () => {
    const paid = experiments.find((experiment) => experiment.id === "exp-gift-bundle");
    const organic = experiments.find((experiment) => experiment.id === "exp-local-caption");

    expect(paid).toBeDefined();
    expect(organic).toBeDefined();
    expect(isPaidExperiment(paid!)).toBe(true);
    expect(isPaidExperiment(organic!)).toBe(false);
  });
});
