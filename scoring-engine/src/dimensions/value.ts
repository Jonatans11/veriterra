// ---------------------------------------------------------------------------
// Veriterra.AI — Value Dimension (10%)
// ---------------------------------------------------------------------------
// Evaluates cost-effectiveness: cost per clinically effective dose vs.
// the category benchmark. A product that costs less than the benchmark
// (better value) scores higher.
// ---------------------------------------------------------------------------

import type { ValueInput } from "../types.js";

/**
 * Score value for money on a 0–100 scale.
 *
 * Logic:
 * - cost <= benchmark → 100 (excellent value)
 * - cost > benchmark → linear decline
 * - cost >= 3× benchmark → 0
 *
 * Formula: score = max(100 - (cost/benchmark - 1) * 50, 0)
 * This gives 100 at benchmark, 50 at 2× benchmark, 0 at 3×+ benchmark.
 */
export function scoreValue(input: ValueInput): number {
  const { costPerEffectiveDose, categoryBenchmarkCost } = input;

  if (categoryBenchmarkCost <= 0) {
    // No benchmark available → neutral score
    return 50;
  }

  const ratio = costPerEffectiveDose / categoryBenchmarkCost;

  if (ratio <= 1) return 100;

  // Linear decline from 100 at ratio=1 to 0 at ratio=3
  const score = Math.max(0, 100 - (ratio - 1) * 50);

  return Math.round(score);
}