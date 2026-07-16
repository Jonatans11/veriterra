// ---------------------------------------------------------------------------
// Veriterra.AI — Autonomous AI Engine Types
// ---------------------------------------------------------------------------

import type { ScoringInput, DataSource } from "@veriterra/scoring-engine";

/** A product discovered by the AI engine. */
export interface AiDiscoveredProduct {
  /** Unique product identifier (slug) */
  id: string;
  /** Product name */
  name: string;
  /** Brand name */
  brand: string;
  /** Category slug */
  category: string;
  /** Product description */
  description: string;
  /** Barcode (if available) */
  barcode?: string;
  /** URL of the product page or image */
  imageUrl?: string;
  /** When this product was discovered */
  discoveredAt: string;
}

/** AI-estimated scoring inputs. These are always flagged as "ai-estimate" source. */
export interface AiEstimatedInputs {
  labelAccuracy: {
    measuredVsClaimedPercent: number;
    confidence: "high" | "medium" | "low";
    rationale: string;
  };
  puritySafety: {
    contaminants: Array<{
      contaminant: string;
      amountMcg: number;
      safetyLimitMcg: number;
    }>;
    thirdPartyTested: boolean;
    confidence: "high" | "medium" | "low";
    rationale: string;
  };
  evidence: {
    claims: Array<{
      claim: string;
      grade: "A" | "B" | "C" | "D";
    }>;
    confidence: "high" | "medium" | "low";
    rationale: string;
  };
  formulation: {
    doseAdequacyScore: number;
    bioavailabilityScore: number;
    thirdPartyCertified: number;
    confidence: "high" | "medium" | "low";
    rationale: string;
  };
  value: {
    costPerEffectiveDose: number;
    categoryBenchmarkCost: number;
    confidence: "high" | "medium" | "low";
    rationale: string;
  };
}

/** A research report for a product or ingredient. */
export interface AiResearchReport {
  /** Target type: "product" or "ingredient" */
  targetType: "product" | "ingredient";
  /** Target ID (product slug or ingredient name) */
  targetId: string;
  /** Status of the research */
  status: "pending" | "in-progress" | "completed" | "failed";
  /** AI-generated summary */
  aiSummary: string | null;
  /** Key findings */
  aiKeyFindings: string[] | null;
  /** Estimated efficacy score (0-100) */
  aiEstimatedEfficacy: number | null;
  /** AI research notes */
  aiResearchNotes: string | null;
  /** When the research was generated */
  generatedAt: string | null;
  /** When the research expires */
  expiresAt: string | null;
  /** View count */
  viewCount: number;
}

/** Result of scoring via the AI engine. */
export interface AiScoringResult {
  productId: string;
  productName: string;
  brand: string;
  compositeScore: number;
  verdict: string;
  dimensions: {
    labelAccuracy: number;
    puritySafety: number;
    evidence: number;
    formulation: number;
    value: number;
  };
  /** The AI-estimated inputs that produced this score */
  estimatedInputs: AiEstimatedInputs;
  /** The scoring inputs converted to the engine's format */
  scoringInput: ScoringInput;
  /** Whether lab data exists for this product (AI can't overwrite) */
  hasLabData: boolean;
  /** Timestamp */
  scoredAt: string;
}

/** Engine configuration */
export interface AiEngineConfig {
  /** Maximum number of products to discover per run */
  maxDiscoverPerRun: number;
  /** Delay between API calls (ms) */
  rateLimitDelayMs: number;
  /** Whether to enable web research */
  enableWebResearch: boolean;
  /** Default category benchmark costs */
  categoryBenchmarks: Record<string, number>;
}

export const DEFAULT_AI_ENGINE_CONFIG: AiEngineConfig = {
  maxDiscoverPerRun: 10,
  rateLimitDelayMs: 1000,
  enableWebResearch: true,
  categoryBenchmarks: {
    "vitamins-minerals": 0.15,
    "protein-amino-acids": 0.50,
    "omega-3s": 0.15,
    probiotics: 0.30,
    herbal: 0.20,
    "sports-nutrition": 0.40,
    "sleep-mood": 0.25,
    "joint-bone": 0.35,
  },
};