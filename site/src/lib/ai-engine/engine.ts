// ---------------------------------------------------------------------------
// Veriterra.AI — Autonomous AI Engine
// ---------------------------------------------------------------------------
// Background system that discovers products and generates AI-estimated
// scores. All estimates are clearly flagged as "ai-estimate" source.
// ---------------------------------------------------------------------------

import { score, createSnapshot, SCORING_METHODOLOGY_VERSION } from "@veriterra/scoring-engine";
import type { ScoringInput, ScoringResult, ScoringSnapshot, DataSource } from "@veriterra/scoring-engine";
import { discoverProducts, hasLabData, hasExistingScore } from "./discoverer.js";
import { estimateProductInputs } from "./estimator.js";
import type { AiDiscoveredProduct, AiEstimatedInputs, AiScoringResult, AiEngineConfig } from "./types.js";
import { DEFAULT_AI_ENGINE_CONFIG } from "./types.js";

/**
 * The Autonomous AI Engine.
 *
 * Run this to discover new products, estimate their scores, and store
 * the results. All estimates are clearly flagged as "ai-estimate" and
 * can never overwrite lab or manual data.
 */
export class AiEngine {
  private config: AiEngineConfig;

  constructor(config: Partial<AiEngineConfig> = {}) {
    this.config = { ...DEFAULT_AI_ENGINE_CONFIG, ...config };
  }

  /**
   * Run a full discovery + scoring cycle.
   * Returns all products that were scored.
   */
  async runCycle(): Promise<AiScoringResult[]> {
    const results: AiScoringResult[] = [];

    // 1. Discover products that need scoring
    const products = await discoverProducts(this.config.maxDiscoverPerRun);

    for (const product of products) {
      try {
        // 2. Check if product already has lab data (can't overwrite)
        const labExists = await hasLabData(product.id);
        const scoreExists = await hasExistingScore(product.id);

        if (labExists) {
          // Skip — lab data takes priority, AI can't overwrite
          continue;
        }

        if (scoreExists) {
          // Skip — already scored
          continue;
        }

        // 3. Generate AI-estimated inputs
        const estimatedInputs = estimateProductInputs(product);

        // 4. Convert to scoring engine format
        const scoringInput = convertToScoringInput(estimatedInputs);

        // 5. Run the scoring engine
        const scoringResult: ScoringResult = score(scoringInput);

        // 6. Create immutable snapshot
        const snapshot: ScoringSnapshot = await createSnapshot(
          scoringInput,
          scoringResult.compositeScore,
          scoringResult.dimensions,
          scoringResult.verdict,
          product.id,
        );

        // 7. Build the result
        const aiResult: AiScoringResult = {
          productId: product.id,
          productName: product.name,
          brand: product.brand,
          compositeScore: scoringResult.compositeScore,
          verdict: scoringResult.verdict,
          dimensions: scoringResult.dimensions,
          estimatedInputs,
          scoringInput,
          hasLabData: false,
          scoredAt: snapshot.computedAt,
        };

        results.push(aiResult);

        // Rate limiting
        if (this.config.rateLimitDelayMs > 0) {
          await delay(this.config.rateLimitDelayMs);
        }
      } catch (err) {
        console.error(`[AI Engine] Error scoring product ${product.id}:`, err);
      }
    }

    return results;
  }

  /**
   * Score a single product by ID (already discovered).
   * Useful for on-demand scoring.
   */
  async scoreProduct(product: AiDiscoveredProduct): Promise<AiScoringResult | null> {
    const labExists = await hasLabData(product.id);
    if (labExists) return null; // Can't overwrite lab data

    const estimatedInputs = estimateProductInputs(product);
    const scoringInput = convertToScoringInput(estimatedInputs);
    const scoringResult = score(scoringInput);

    const snapshot = await createSnapshot(
      scoringInput,
      scoringResult.compositeScore,
      scoringResult.dimensions,
      scoringResult.verdict,
      product.id,
    );

    return {
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      compositeScore: scoringResult.compositeScore,
      verdict: scoringResult.verdict,
      dimensions: scoringResult.dimensions,
      estimatedInputs,
      scoringInput,
      hasLabData: false,
      scoredAt: snapshot.computedAt,
    };
  }

  /**
   * Get the current engine configuration.
   */
  getConfig(): AiEngineConfig {
    return { ...this.config };
  }

  /**
   * Update engine configuration.
   */
  updateConfig(updates: Partial<AiEngineConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────

/**
 * Convert AI-estimated inputs to the scoring engine's input format.
 * All sources are set to "ai-estimate".
 */
function convertToScoringInput(estimated: AiEstimatedInputs): ScoringInput {
  const source: DataSource = "ai-estimate";

  return {
    labelAccuracy: {
      measuredVsClaimedPercent: estimated.labelAccuracy.measuredVsClaimedPercent,
      source,
      notes: `AI-estimated: ${estimated.labelAccuracy.rationale} (confidence: ${estimated.labelAccuracy.confidence})`,
    },
    puritySafety: {
      contaminants: estimated.puritySafety.contaminants.map((c) => ({
        ...c,
        source,
      })),
      thirdPartyTested: estimated.puritySafety.thirdPartyTested,
      source,
      notes: `AI-estimated: ${estimated.puritySafety.rationale} (confidence: ${estimated.puritySafety.confidence})`,
    },
    evidence: {
      claims: estimated.evidence.claims.map((c) => ({
        claim: c.claim,
        grade: c.grade,
      })),
      source,
      notes: `AI-estimated: ${estimated.evidence.rationale} (confidence: ${estimated.evidence.confidence})`,
    },
    formulation: {
      doseAdequacyScore: estimated.formulation.doseAdequacyScore,
      bioavailabilityScore: estimated.formulation.bioavailabilityScore,
      thirdPartyCertified: estimated.formulation.thirdPartyCertified,
      source,
      notes: `AI-estimated: ${estimated.formulation.rationale} (confidence: ${estimated.formulation.confidence})`,
    },
    value: {
      costPerEffectiveDose: estimated.value.costPerEffectiveDose,
      categoryBenchmarkCost: estimated.value.categoryBenchmarkCost,
      source,
      notes: `AI-estimated: ${estimated.value.rationale} (confidence: ${estimated.value.confidence})`,
    },
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Convenience exports ──────────────────────────────────────────────────

/** Run a single AI engine cycle. */
export async function runAiCycle(): Promise<AiScoringResult[]> {
  const engine = new AiEngine();
  return engine.runCycle();
}

/** Score a single product using the AI engine. */
export async function aiScoreProduct(product: AiDiscoveredProduct): Promise<AiScoringResult | null> {
  const engine = new AiEngine();
  return engine.scoreProduct(product);
}

export { AiEngine as default };