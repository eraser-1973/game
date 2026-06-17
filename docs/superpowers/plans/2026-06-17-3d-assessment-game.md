# 3D Assessment Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a playable browser 3D assessment prototype with movement, five crisis stages, six-dimension scoring, and a final feedback panel.

**Architecture:** Keep assessment rules in testable simulation modules and keep Three.js as a render adapter. Use DOM overlays for HUD, prompts, choices, AI teammate messages, and final results.

**Tech Stack:** Vite, TypeScript, Three.js, Vitest, Playwright for browser smoke checks.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `.gitignore`

- [ ] Add Vite, TypeScript, Three.js, Vitest, and Playwright scripts.
- [ ] Install dependencies with `npm.cmd install`.
- [ ] Confirm `npm.cmd test -- --run` starts Vitest, even before feature tests exist.

### Task 2: Assessment Scoring With TDD

**Files:**
- Create: `src/game/content/assessment.ts`
- Create: `src/game/simulation/scoring.ts`
- Create: `src/game/simulation/scoring.test.ts`

- [ ] Write tests that expect stage choices to produce clamped 0-100 scores.
- [ ] Run `npm.cmd test -- --run src/game/simulation/scoring.test.ts` and verify the tests fail because implementation is missing.
- [ ] Implement score accumulation, score sorting, dominant-pair profile selection, and fallback profile selection.
- [ ] Run the same test and verify it passes.

### Task 3: Game Progression With TDD

**Files:**
- Create: `src/game/simulation/state.ts`
- Create: `src/game/simulation/state.test.ts`

- [ ] Write tests for stage advancement, completion, and answer recording.
- [ ] Run the state tests and verify they fail before implementation.
- [ ] Implement a small immutable reducer for stage selection and reset.
- [ ] Run all tests and verify they pass.

### Task 4: Three.js Playable Scene

**Files:**
- Create: `src/main.ts`
- Create: `src/render/createGame.ts`
- Create: `src/render/player.ts`
- Create: `src/render/world.ts`
- Create: `src/render/camera.ts`
- Create: `src/game/input/keyboard.ts`

- [ ] Create a fullscreen renderer, scene, lights, city floor, station markers, and low-poly original player character.
- [ ] Add keyboard movement and third-person follow camera.
- [ ] Detect nearest station and expose interaction callbacks to the UI layer.
- [ ] Handle resize and WebGL context loss.

### Task 5: HUD, Choices, and Results

**Files:**
- Create: `src/ui/hud.ts`
- Create: `src/ui/styles.css`
- Modify: `src/main.ts`

- [ ] Add top-left objective chip, top-right score status, bottom interaction prompt, and stage choice modal.
- [ ] Add AI teammate messages for each stage.
- [ ] Add final results panel with six scores, dominant profile, behavior evidence, job directions, and development advice.
- [ ] Keep the center of the playfield clear during movement.

### Task 6: Verification

**Files:**
- Create: `tests/browser-smoke.mjs`

- [ ] Run `npm.cmd test -- --run` and verify all unit tests pass.
- [ ] Run `npm.cmd run build` and verify Vite builds.
- [ ] Start a local dev server.
- [ ] Run the browser smoke script and verify the canvas is nonblank.
