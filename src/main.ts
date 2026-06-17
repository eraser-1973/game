import { assessmentStages } from "./game/content/assessment";
import { calculateAssessmentResult } from "./game/simulation/scoring";
import { createInitialGameState, resetGameState, selectStageOption } from "./game/simulation/state";
import { createGame } from "./render/createGame";
import { createHud } from "./ui/hud";
import "./ui/styles.css";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
  throw new Error("Missing app root");
}

let state = createInitialGameState(assessmentStages);
let nearestStation: number | null = null;

const hud = createHud({
  root: app,
  stages: assessmentStages,
  onChoose: (optionId) => {
    state = selectStageOption(state, assessmentStages, optionId);
    syncState();
    if (state.completed) {
      hud.showResults(calculateAssessmentResult(assessmentStages, state.selections));
    }
  },
  onReset: () => {
    state = resetGameState(state);
    syncState();
  },
});

const game = createGame(
  app,
  assessmentStages,
  (stationIndex) => {
    nearestStation = stationIndex;
    hud.setNearestStation(stationIndex);
  },
  (stationIndex) => {
    if (stationIndex === state.currentStageIndex && !state.completed) {
      hud.openStage(stationIndex);
    }
  },
);

function syncState() {
  hud.update(state);
  hud.setNearestStation(nearestStation);
  game.setCurrentStage(state.currentStageIndex, state.completed);
}

syncState();
