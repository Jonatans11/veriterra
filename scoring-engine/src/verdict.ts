// ---------------------------------------------------------------------------
// Veriterra.AI — Verdict Mapping
// ---------------------------------------------------------------------------
// Converts a composite score (0–100) into a plain-language verdict.
// ---------------------------------------------------------------------------

import type { VerdictLabel } from "./types.js";

/**
 * Thresholds for each verdict tier.
 */
const VERDICT_THRESHOLDS: { min: number; max: number; label: VerdictLabel }[] = [
  { min: 80, max: 100, label: "Worth taking" },
  { min: 60, max: 79, label: "Solid choice" },
  { min: 40, max: 59, label: "Mixed" },
  { min: 0, max: 39, label: "Skip it" },
];

/**
 * Map a composite score to a plain-language verdict label.
 *
 * @param compositeScore — The 0–100 composite score.
 * @returns The matching verdict label.
 * @throws If score is outside the valid range.
 */
export function scoreToVerdict(compositeScore: number): VerdictLabel {
  if (compositeScore < 0 || compositeScore > 100) {
    throw new Error(
      `Invalid compositeScore: ${compositeScore}. Must be between 0 and 100.`,
    );
  }

  const threshold = VERDICT_THRESHOLDS.find(
    (t) => compositeScore >= t.min && compositeScore <= t.max,
  );

  // This should always match since the ranges cover [0, 100] without gaps.
  return threshold!.label;
}

/**
 * Get a human-readable description for a verdict.
 */
export function verdictDescription(label: VerdictLabel): string {
  switch (label) {
    case "Worth taking":
      return "Strong scientific backing, accurate labeling, clean safety profile, well-formulated, and fairly priced.";
    case "Solid choice":
      return "Generally reliable with good evidence and formulation. Minor concerns in one or two areas.";
    case "Mixed":
      return "Some positive attributes but meaningful drawbacks in evidence, purity, or formulation.";
    case "Skip it":
      return "Significant concerns. Low evidence, potential contamination, poor formulation, or poor value.";
  }
}