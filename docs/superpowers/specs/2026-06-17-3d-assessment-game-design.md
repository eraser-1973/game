# 3D Assessment Game Design

## Goal

Build a browser-based 3D playable prototype for a cooperative, game-based job behavior tendency assessment. The demo is aimed at college students, new graduates, and internship candidates. It is not a hiring or elimination tool.

## Source Requirements

The design follows the provided document's recommendation: a multiplayer-style AI city crisis management game that observes behavior across six workplace dimensions.

The six dimensions are:

- Leadership and influence
- Cooperation tendency
- Creative innovation
- Analytical decision-making
- Stress adaptation
- Execution and goal orientation

The result should show:

- A 0-100 radar-style score view for the six dimensions
- A dominant profile based on the two highest dimensions
- Behavior evidence explaining the profile
- Job direction suggestions
- Development advice

## Game Fantasy

The player controls an original dark fairytale-style girl with blue hair and a yellow raincoat in a future city crisis command zone. Her mood references brave, curious, eerie fairytale adventure energy, but all visuals are original and do not use official character assets.

The city AI has failed across transport, medical, energy, public opinion, and supply systems. The player acts as the field coordinator of a temporary crisis team. AI teammates simulate a multiplayer cooperation context by offering partial information, advice, and conflicting priorities.

## Core Loop

The player moves through a 3D command space, approaches interaction stations, presses interact, makes crisis decisions, and advances through five assessment stages.

1. Information fragments: investigate terminals and identify the true problem.
2. Resource allocation: distribute limited resources across crisis systems.
3. Creative solution: choose or combine an alternate recovery strategy.
4. Sudden crisis: adapt after a rule change or resource reduction.
5. Final briefing: submit the recovery plan and view assessment feedback.

## First Playable Scope

The first version must include:

- Vite + TypeScript + Three.js app
- Fullscreen 3D scene
- Third-person follow camera
- WASD and arrow-key movement
- Original low-poly player character
- Five interactable stations, one per assessment stage
- Compact HUD with objective, status, and contextual prompt
- AI teammate messages in DOM UI
- Six-dimension scoring model
- Final result panel with scores, dominant profile, evidence, job suggestions, and development advice

The first version will not include:

- Real multiplayer networking
- Imported copyrighted character assets
- Complex physics
- Account login, data persistence, or HR screening decisions

## Architecture

Game rules live in TypeScript simulation modules. Three.js scene objects only render the current state. DOM UI presents the HUD, stage prompts, and results.

Main module groups:

- `src/game/content`: static assessment stages, options, profiles, and evidence text
- `src/game/simulation`: scoring, progression, and state transitions
- `src/game/input`: keyboard state
- `src/render`: Three.js scene, player mesh, stations, camera, and loop
- `src/ui`: DOM HUD and result rendering

## Scoring

Each stage option contributes weighted deltas to one or more dimensions. Scores are normalized to 0-100 with a neutral starting value. Negative indicators are clamped so results remain readable.

Dominant profile is generated from the two highest dimensions. If no exact pair exists, the highest dimension produces a fallback profile. Result wording avoids absolute personality cutoffs and frames scores as observed tendencies in this demo.

## Verification

Automated tests cover the scoring and profile-generation logic. Build verification confirms TypeScript and Vite compile. Browser smoke verification checks that the canvas renders nonblank pixels and that the page loads without blocking errors.
