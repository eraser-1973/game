import { describe, expect, it } from "vitest";
import { assessmentStages, dimensionLabels } from "../content/assessment";
import { calculateAssessmentResult, getTopDimensions } from "./scoring";

describe("assessment scoring", () => {
  it("turns selected crisis decisions into clamped six-dimension scores", () => {
    const selections = {
      "info-fragments": "share-evidence",
      "resource-allocation": "balanced-triage",
      "creative-solution": "adaptive-network",
      "sudden-crisis": "replan-calmly",
      "final-briefing": "evidence-briefing",
    };

    const result = calculateAssessmentResult(assessmentStages, selections);

    expect(Object.keys(result.scores)).toEqual(Object.keys(dimensionLabels));
    expect(result.scores.cooperation).toBeGreaterThan(result.scores.stress);
    expect(result.scores.innovation).toBeGreaterThan(50);
    expect(Math.min(...Object.values(result.scores))).toBeGreaterThanOrEqual(0);
    expect(Math.max(...Object.values(result.scores))).toBeLessThanOrEqual(100);
  });

  it("selects a known dominant profile from the top two dimensions", () => {
    const selections = {
      "info-fragments": "map-patterns",
      "resource-allocation": "delegate-plan",
      "creative-solution": "adaptive-network",
      "sudden-crisis": "replan-calmly",
      "final-briefing": "evidence-briefing",
    };

    const result = calculateAssessmentResult(assessmentStages, selections);

    expect(getTopDimensions(result.scores, 2)).toEqual(["analysis", "execution"]);
    expect(result.profile.title).toBe("稳定解决型");
    expect(result.profile.jobDirections).toContain("数据分析");
    expect(result.evidence.length).toBeGreaterThanOrEqual(3);
  });

  it("ignores unknown stage choices without producing NaN", () => {
    const result = calculateAssessmentResult(assessmentStages, {
      "info-fragments": "missing-choice",
    });

    expect(Object.values(result.scores).every(Number.isFinite)).toBe(true);
    expect(result.profile.title.length).toBeGreaterThan(0);
  });
});
