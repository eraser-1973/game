import type { AssessmentStage } from "../content/assessment";

export type GameState = {
  currentStageIndex: number;
  selections: Record<string, string>;
  completed: boolean;
};

export function createInitialGameState(_stages: AssessmentStage[]): GameState {
  return {
    currentStageIndex: 0,
    selections: {},
    completed: false,
  };
}

export function selectStageOption(
  state: GameState,
  stages: AssessmentStage[],
  optionId: string,
): GameState {
  const currentStage = stages[state.currentStageIndex];
  if (!currentStage || state.completed) {
    return state;
  }

  const nextSelections = {
    ...state.selections,
    [currentStage.id]: optionId,
  };
  const finalStageIndex = stages.length - 1;
  const isFinalStage = state.currentStageIndex >= finalStageIndex;

  return {
    currentStageIndex: isFinalStage ? finalStageIndex : state.currentStageIndex + 1,
    selections: nextSelections,
    completed: isFinalStage,
  };
}

export function resetGameState(_state: GameState): GameState {
  return {
    currentStageIndex: 0,
    selections: {},
    completed: false,
  };
}
