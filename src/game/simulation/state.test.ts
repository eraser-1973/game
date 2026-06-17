import { describe, expect, it } from "vitest";
import { assessmentStages } from "../content/assessment";
import { createInitialGameState, selectStageOption, resetGameState } from "./state";

describe("game state progression", () => {
  it("records a selected option and advances to the next stage", () => {
    const initial = createInitialGameState(assessmentStages);

    const next = selectStageOption(initial, assessmentStages, "share-evidence");

    expect(next.currentStageIndex).toBe(1);
    expect(next.selections["info-fragments"]).toBe("share-evidence");
    expect(next.completed).toBe(false);
  });

  it("marks the game complete after the final stage selection", () => {
    let state = createInitialGameState(assessmentStages);

    for (const stage of assessmentStages) {
      state = selectStageOption(state, assessmentStages, stage.options[0].id);
    }

    expect(state.completed).toBe(true);
    expect(state.currentStageIndex).toBe(assessmentStages.length - 1);
    expect(Object.keys(state.selections)).toHaveLength(assessmentStages.length);
  });

  it("can reset to the first stage with no selections", () => {
    const initial = createInitialGameState(assessmentStages);
    const changed = selectStageOption(initial, assessmentStages, "share-evidence");

    const reset = resetGameState(changed);

    expect(reset.currentStageIndex).toBe(0);
    expect(reset.selections).toEqual({});
    expect(reset.completed).toBe(false);
  });
});
