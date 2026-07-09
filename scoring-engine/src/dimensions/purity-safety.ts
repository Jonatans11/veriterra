// ---------------------------------------------------------------------------
// Veriterra.AI — Purity & Safety Dimension (25%)
// ---------------------------------------------------------------------------
// Evaluates heavy-metal contamination against safety limits.
// Each contaminant is scored independently; the worst contaminant drives the
// dimension score.
// ---------------------------------------------------------------------------

import type { PuritySafetyInput } from "../types.js";

/**
 * Score a single contaminant reading.
 *
 * Logic:
 * - amount <= limit → 100 (safe)
 * - amount up to 2× limit → linear decline 100→50
 * - amount >= 3× limit → 0 (critical failure)
 *
 * Third-party testing adds a 10-point bonus (capped at 100).
 */
function scoreContaminant(
  amountMcg: number,
  safetyLimitMcg: number,
): number {
  if (safetyLimitMcg <= 0) return 100; // no defined limit → assume safe
  const ratio = amountMcg / safetyLimitMcg;

  if (ratio <= 1) return 100;
  if (ratio >= 3) return 0;

  // Linear decline: ratio 1→3 maps to score 100→0
  return Math.round(100 - ((ratio - 1) / 2) * 100);
}

/**
 * Score purity and safety on a 0–100 scale.
 *
 * The dimension score is the MINIMUM contaminant score (worst offender wins),
 * with a bonus for third-party testing.
 */
export function scorePuritySafety(input: PuritySafetyInput): number {
  if (input.contaminants.length === 0) {
    // No contaminant data — assume safe but flag uncertainty with a score of 50
    return 50;
  }

  const contaminantScores = input.contaminants.map((c) =>
    scoreContaminant(c.amountMcg, c.safetyLimitMcg)
  );

  // Worst offender drives the score
  let score = Math.min(...contaminantScores);

  // Third-party testing bonus
  if (input.thirdPartyTested) {
    score = Math.min(score + 10, 100);
  }

  return Math.round(score);
}