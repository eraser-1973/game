import type { AssessmentStage, StageOption } from "../game/content/assessment";
import { dimensionLabels } from "../game/content/assessment";
import type { AssessmentResult, DimensionKey } from "../game/simulation/scoring";
import type { GameState } from "../game/simulation/state";

type HudOptions = {
  root: HTMLElement;
  stages: AssessmentStage[];
  onChoose: (optionId: string) => void;
  onReset: () => void;
};

export type Hud = {
  update: (state: GameState) => void;
  setNearestStation: (stationIndex: number | null) => void;
  openStage: (stageIndex: number) => void;
  showResults: (result: AssessmentResult) => void;
};

export function createHud({ root, stages, onChoose, onReset }: HudOptions): Hud {
  root.innerHTML = `
    <canvas-hidden-label>AI 城市危机测评原型</canvas-hidden-label>
    <section class="hud-chip objective" aria-live="polite"></section>
    <section class="hud-chip status"></section>
    <section class="interaction-prompt"></section>
    <section class="teammate-feed"></section>
    <dialog class="choice-dialog"></dialog>
    <section class="result-panel" hidden></section>
  `;

  const objective = mustQuery<HTMLElement>(root, ".objective");
  const status = mustQuery<HTMLElement>(root, ".status");
  const prompt = mustQuery<HTMLElement>(root, ".interaction-prompt");
  const feed = mustQuery<HTMLElement>(root, ".teammate-feed");
  const dialog = mustQuery<HTMLDialogElement>(root, ".choice-dialog");
  const resultPanel = mustQuery<HTMLElement>(root, ".result-panel");

  let currentState: GameState = {
    currentStageIndex: 0,
    selections: {},
    completed: false,
  };

  const renderState = () => {
    const stage = stages[currentState.currentStageIndex];
    objective.innerHTML = `
      <span>${stage?.title ?? "测评完成"}</span>
      <strong>${stage?.objective ?? "查看六维反馈"}</strong>
    `;
    status.innerHTML = `
      <span>${Object.keys(currentState.selections).length}/${stages.length}</span>
      <strong>${currentState.completed ? "反馈已生成" : "危机处理中"}</strong>
    `;
  };

  renderState();

  return {
    update: (state: GameState) => {
      currentState = state;
      renderState();
      if (!state.completed) {
        resultPanel.hidden = true;
      }
    },
    setNearestStation: (stationIndex: number | null) => {
      if (currentState.completed) {
        prompt.textContent = "测评已完成";
        return;
      }
      const stage = stationIndex === null ? null : stages[stationIndex];
      prompt.textContent = stage ? `按 E / 空格进入：${stage.stationLabel}` : "靠近发光站点";
    },
    openStage: (stageIndex: number) => {
      const stage = stages[stageIndex];
      if (!stage || currentState.completed) return;
      renderChoiceDialog(dialog, stage, feed, onChoose);
      dialog.showModal();
    },
    showResults: (result: AssessmentResult) => {
      dialog.close();
      resultPanel.hidden = false;
      resultPanel.innerHTML = renderResults(result);
      const resetButton = mustQuery<HTMLButtonElement>(resultPanel, ".reset-run");
      resetButton.addEventListener("click", onReset);
    },
  };
}

function renderChoiceDialog(
  dialog: HTMLDialogElement,
  stage: AssessmentStage,
  feed: HTMLElement,
  onChoose: (optionId: string) => void,
) {
  dialog.innerHTML = `
    <form method="dialog" class="choice-surface">
      <header>
        <span>${stage.stationLabel}</span>
        <h2>${stage.title}</h2>
        <p>${stage.prompt}</p>
      </header>
      <div class="choice-list">
        ${stage.options.map(renderOptionButton).join("")}
      </div>
      <button class="quiet-button" value="cancel">稍后处理</button>
    </form>
  `;

  for (const button of Array.from(dialog.querySelectorAll<HTMLButtonElement>("[data-option-id]"))) {
    button.addEventListener("click", () => {
      const optionId = button.dataset.optionId;
      const option = stage.options.find((candidate) => candidate.id === optionId);
      if (!optionId || !option) return;
      feed.innerHTML = `<strong>AI 队友</strong><span>${option.teammate}</span>`;
      dialog.close();
      onChoose(optionId);
    });
  }
}

function renderOptionButton(option: StageOption) {
  return `
    <button type="button" class="choice-button" data-option-id="${option.id}">
      <strong>${option.label}</strong>
      <span>${option.description}</span>
    </button>
  `;
}

function renderResults(result: AssessmentResult) {
  const scoreRows = Object.entries(result.scores)
    .map(([dimension, score]) => renderScoreRow(dimension as DimensionKey, score))
    .join("");
  const evidence = result.evidence.map((item) => `<li>${item}</li>`).join("");
  const jobs = result.profile.jobDirections.map((item) => `<li>${item}</li>`).join("");

  return `
    <div class="result-header">
      <span>六维行为倾向反馈</span>
      <h2>${result.profile.title}</h2>
      <p>${result.profile.summary}</p>
    </div>
    <div class="result-grid">
      <div class="score-board">${scoreRows}</div>
      <div class="result-copy">
        <h3>行为证据</h3>
        <ul>${evidence}</ul>
        <h3>岗位方向建议</h3>
        <ul>${jobs}</ul>
        <h3>发展建议</h3>
        <p>${result.profile.developmentAdvice}</p>
        <button class="reset-run" type="button">重新测评</button>
      </div>
    </div>
  `;
}

function renderScoreRow(dimension: DimensionKey, score: number) {
  return `
    <div class="score-row">
      <span>${dimensionLabels[dimension]}</span>
      <meter min="0" max="100" value="${score}"></meter>
      <strong>${score}</strong>
    </div>
  `;
}

function mustQuery<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing UI element: ${selector}`);
  }
  return element;
}
