// ---------------------------------------------------------------------------
// Veriterra.AI — Main Scoring Function
// ---------------------------------------------------------------------------
// Pure, stateless, deterministic. Same inputs → same outputs, always.
// ---------------------------------------------------------------------------

import type { DimensionScores, ScoringInput, ScoringResult } from "./types.js";
import { scoreLabelAccuracy } from "./dimensions/label-accuracy.js";
import { scorePuritySafety } from "./dimensions/purity-safety.js";
import { scoreEvidence } from "./dimensions/evidence.js";
import { scoreFormulation } from "./dimensions/formulation.js";
import { scoreValue } from "./dimensions/value.js";
import { scoreToVerdict } from "./verdict.js";

/**
 * Dimension weights (sum = 1.0 = 100%).
 *
 * These are constants set by the methodology. Any change requires a new
 * methodology version and a new snapshot.
 */
export const DIMENSION_WEIGHTS = {
  labelAccuracy: 0.25,  // 25%
  puritySafety: 0.25,   // 25%
  evidence: 0.25,       // 25%
  formulation: 0.15,    // 15%
  value: 0.10,          // 10%
} as const;

/**
 * Compute individual dimension scores from a ScoringInput.
 */
export function computeDimensionScores(
  input: ScoringInput,
): DimensionScores {
  return {
    labelAccuracy: scoreLabelAccuracy(input.labelAccuracy),
    puritySafety: scorePuritySafety(input.puritySafety),
    evidence: scoreEvidence(input.evidence),
    formulation: scoreFormulation(input.formulation),
    value: scoreValue(input.value),
  };
}

/**
 * Compute the weighted composite score from dimension scores.
 *
 * @returns A number between 0 and 100 (inclusive).
 */
export function computeCompositeScore(
  dimensions: DimensionScores,
): number {
  const score =
    dimensions.labelAccuracy * DIMENSION_WEIGHTS.labelAccuracy +
    dimensions.puritySafety * DIMENSION_WEIGHTS.puritySafety +
    dimensions.evidence * DIMENSION_WEIGHTS.evidence +
    dimensions.formulation * DIMENSION_WEIGHTS.formulation +
    dimensions.value * DIMENSION_WEIGHTS.value;

  return Math.round(Math.min(100, Math.max(0, score)));
}

/**
 * Score a supplement. Pure and deterministic.
 *
 * @param input — All inputs needed for the five dimensions.
 * @returns A ScoringResult with composite score, dimension scores, and verdict.
 */
export function score(input: ScoringInput): ScoringResult {
  const dimensions = computeDimensionScores(input);
  const compositeScore = computeCompositeScore(dimensions);
  const verdict = scoreToVerdict(compositeScore);

  return {
    compositeScore,
    dimensions,
    verdict,
  };
}