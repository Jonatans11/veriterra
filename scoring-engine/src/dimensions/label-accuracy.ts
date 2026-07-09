// ---------------------------------------------------------------------------
// Veriterra.AI — Label Accuracy Dimension (25%)
// ---------------------------------------------------------------------------
// Measures how closely a supplement's lab-measured potency matches its label
// claim. Under-dosing is penalised more heavily than over-dosing.
// ---------------------------------------------------------------------------

import type { LabelAccuracyInput } from "../types.js";

/**
 * Score label accuracy on a 0–100 scale.
 *
 * Penalty logic:
 * - 100% match (measuredVsClaimedPercent == 100) → 100
 * - Under-dosing (< 100): severe penalty ramp — 0% at ≤ 50% of claimed
 * - Over-dosing (> 100): gentler penalty — linear decline to 50 at 200%+
 *
 * Penalty curve (under-dose):
 *   score = clamp( (measured% - 50) / 50 * 100, 0, 100 )
 *   This gives 0 at 50%, 100 at 100%.
 *
 * Penalty curve (over-dose):
 *   score = max(100 - (measured% - 100) * 0.5, 50)
 *   This gives 100 at 100%, 75 at 150%, 50 at 200%+.
 */
export function scoreLabelAccuracy(input: LabelAccuracyInput): number {
  const { measuredVsClaimedPercent } = input;
  let score: number;

  if (measuredVsClaimedPercent >= 100) {
    // Over-dosing: gentle penalty (≤ 110% = no penalty, perfect match)
    const excess = measuredVsClaimedPercent - 100;
    score = Math.max(100 - Math.max(0, excess - 10) * 0.5, 50);
  } else {
    // Under-dosing: severe penalty
    score = measuredVsClaimedPercent >= 50
      ? ((measuredVsClaimedPercent - 50) / 50) * 100
      : 0;
  }

  // Clamp to [0, 100]
  return Math.round(Math.min(100, Math.max(0, score)));
}