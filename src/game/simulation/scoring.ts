import { profileDefinitions, type AssessmentStage, type StageOption } from "../content/assessment";

export type DimensionKey =
  | "leadership"
  | "cooperation"
  | "innovation"
  | "analysis"
  | "stress"
  | "execution";

export type DimensionScores = Record<DimensionKey, number>;

export type ProfileDefinition = {
  dimensions: [DimensionKey, DimensionKey];
  title: string;
  summary: string;
  jobDirections: string[];
  developmentAdvice: string;
};

export type AssessmentResult = {
  scores: DimensionScores;
  profile: ProfileDefinition;
  evidence: string[];
  selectedOptions: StageOption[];
};

const dimensionOrder: DimensionKey[] = [
  "leadership",
  "cooperation",
  "innovation",
  "analysis",
  "stress",
  "execution",
];

const neutralScores = (): DimensionScores => ({
  leadership: 50,
  cooperation: 50,
  innovation: 50,
  analysis: 50,
  stress: 50,
  execution: 50,
});

export function calculateAssessmentResult(
  stages: AssessmentStage[],
  selections: Record<string, string>,
): AssessmentResult {
  const scores = neutralScores();
  const selectedOptions: StageOption[] = [];

  for (const stage of stages) {
    const selectedId = selections[stage.id];
    const option = stage.options.find((candidate) => candidate.id === selectedId);
    if (!option) {
      continue;
    }

    selectedOptions.push(option);
    for (const [dimension, delta] of Object.entries(option.scoreDeltas) as [DimensionKey, number][]) {
      scores[dimension] = clampScore(scores[dimension] + delta);
    }
  }

  return {
    scores,
    selectedOptions,
    evidence: selectedOptions.map((option) => option.evidence),
    profile: pickProfile(scores),
  };
}

export function getTopDimensions(scores: DimensionScores, count: number): DimensionKey[] {
  return [...dimensionOrder]
    .sort((left, right) => {
      const delta = scores[right] - scores[left];
      return delta === 0 ? dimensionOrder.indexOf(left) - dimensionOrder.indexOf(right) : delta;
    })
    .slice(0, count);
}

export function pickProfile(scores: DimensionScores): ProfileDefinition {
  const topPair = getTopDimensions(scores, 2);
  const pairProfile = profileDefinitions.find((profile) => samePair(profile.dimensions, topPair));

  if (pairProfile) {
    return pairProfile;
  }

  const [top] = topPair;
  return (
    profileDefinitions.find((profile) => profile.dimensions.includes(top)) ?? profileDefinitions[0]
  );
}

function samePair(definedPair: [DimensionKey, DimensionKey], actualPair: DimensionKey[]): boolean {
  return definedPair.every((dimension) => actualPair.includes(dimension));
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}
