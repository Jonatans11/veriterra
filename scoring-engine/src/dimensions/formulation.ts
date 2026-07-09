// ---------------------------------------------------------------------------
// Veriterra.AI — Formulation Dimension (15%)
// ---------------------------------------------------------------------------
// Evaluates the quality of a supplement's formulation:
// - Clinical dose adequacy
// - Bioavailable form
// - Third-party certification
// ---------------------------------------------------------------------------

import type { FormulationInput } from "../types.js";

/**
 * Weights for the three formulation sub-scores.
 * Dose adequacy is most important, then bioavailability, then certification.
 */
const FORMULATION_WEIGHTS = {
  doseAdequacy: 0.50,      // 50%
  bioavailability: 0.30,   // 30%
  thirdPartyCertified: 0.20, // 20%
} as const;

/**
 * Score formulation quality on a 0–100 scale.
 *
 * Each sub-score is on a 0–1 scale (already normalised in the input).
 * The weighted sum is scaled to 0–100.
 */
export function scoreFormulation(input: FormulationInput): number {
  const score =
    input.doseAdequacyScore * FORMULATION_WEIGHTS.doseAdequacy +
    input.bioavailabilityScore * FORMULATION_WEIGHTS.bioavailability +
    input.thirdPartyCertified * FORMULATION_WEIGHTS.thirdPartyCertified;

  // Scale 0–1 → 0–100
  return Math.round(Math.min(100, Math.max(0, score * 100)));
}