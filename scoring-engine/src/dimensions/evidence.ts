// ---------------------------------------------------------------------------
// Veriterra.AI — Evidence Dimension (25%)
// ---------------------------------------------------------------------------
// Evaluates the strength of scientific evidence backing marketed claims.
// Each claim is graded A–D; the overall score is the average grade weighted
// by the number of claims at each level.
// ---------------------------------------------------------------------------

import type { EvidenceGrade, EvidenceInput } from "../types.js";

/**
 * Map a letter grade to a numeric score (0–100).
 *
 * A → 100  (Multiple high-quality RCTs or meta-analyses)
 * B → 75   (At least one well-designed RCT)
 * C → 50   (Observational or mechanistic evidence only)
 * D → 25   (Traditional use, anecdotes, or no evidence)
 */
function gradeToNumeric(grade: EvidenceGrade): number {
  switch (grade) {
    case "A": return 100;
    case "B": return 75;
    case "C": return 50;
    case "D": return 25;
  }
}

/**
 * Score evidence strength on a 0–100 scale.
 *
 * Returns the average numeric score across all graded claims.
 * If no claims are provided, returns 0 (no evidence).
 */
export function scoreEvidence(input: EvidenceInput): number {
  if (input.claims.length === 0) return 0;

  const total = input.claims.reduce(
    (sum, claim) => sum + gradeToNumeric(claim.grade),
    0,
  );

  return Math.round(total / input.claims.length);
}