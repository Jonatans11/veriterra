// ---------------------------------------------------------------------------
// Veriterra.AI — Research Engine Type Definitions
// ---------------------------------------------------------------------------
// Shared types for the Research Portal, knowledge base, barcode scanner,
// and Autonomous AI Engine. Designed to interoperate with the scoring engine
// types at @veriterra/scoring-engine (peer dependency).
// ---------------------------------------------------------------------------

// Replicated from @veriterra/scoring-engine for standalone use.
// The scoring engine package is the source of truth for these types.
export type DataSource = "lab" | "manual" | "ai-estimate";

export interface DimensionScores {
  labelAccuracy: number;
  puritySafety: number;
  evidence: number;
  formulation: number;
  value: number;
}

export interface ScoringSnapshot {
  snapshotId: string;
  methodologyVersion: string;
  computedAt: string;
  productId?: string;
  compositeScore: number;
  dimensions: DimensionScores;
  verdict: string;
  inputs: unknown;
  auditHash: string;
}

// ── Products ────────────────────────────────────────────────────────────────
export interface Product {
  id: string; // UUID v4
  name: string;
  brandId: string;
  categoryId: string;
  barcode?: string; // UPC/EAN/GTIN
  imageUrl?: string;
  description?: string;
  servingSize?: string;
  servingsPerContainer?: number;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

export interface Brand {
  id: string; // UUID v4
  name: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string; // UUID v4
  name: string;
  slug: string;
  description?: string;
  parentCategoryId?: string;
  createdAt: string;
}

// ── Ingredients / Substances ────────────────────────────────────────────────
export interface Ingredient {
  id: string; // UUID v4
  name: string;
  aliases: string[]; // e.g. ["Vitamin C", "Ascorbic acid"]
  category: IngredientCategory;
  description?: string;
  typicalDosageRange?: string;
  safetyRating?: SafetyRating;
  evidenceRating?: EvidenceRating;
  // Top 1000 reference library metadata
  isTopSubstance: boolean; // true if in the "Top 1000" library
  topRanking?: number; // 1-1000 ranking
  createdAt: string;
  updatedAt: string;
}

export type IngredientCategory =
  | "vitamin"
  | "mineral"
  | "herb"
  | "amino-acid"
  | "probiotic"
  | "enzyme"
  | "fatty-acid"
  | "hormone"
  | "nootropic"
  | "adaptogen"
  | "antioxidant"
  | "other";

export type SafetyRating = "safe" | "caution" | "avoid" | "insufficient-data";
export type EvidenceRating = "strong" | "moderate" | "limited" | "inconclusive" | "none";

// ── Product ↔ Ingredient mapping ────────────────────────────────────────────
export interface ProductIngredient {
  productId: string;
  ingredientId: string;
  amountMg?: number;
  percentDailyValue?: number;
  isProprietaryBlend: boolean;
}

// ── Lab Results ────────────────────────────────────────────────────────────
export interface LabResult {
  id: string; // UUID v4
  productId: string;
  labName: string;
  testDate: string; // ISO 8601
  testedAt: string;
  // Label accuracy
  measuredVsClaimedPercent: number;
  // Contaminants
  contaminants: ContaminantReading[];
  // Source is always "lab" for verified results
  source: Extract<DataSource, "lab">;
  reportUrl?: string;
  notes?: string;
  createdAt: string;
}

// Re-use ContaminantReading from scoring engine types conceptually
export interface ContaminantReading {
  contaminant: string;
  amountMcg: number;
  safetyLimitMcg: number;
}

// ── Evidence Grades ─────────────────────────────────────────────────────────
export interface EvidenceGradeEntry {
  id: string; // UUID v4
  ingredientId: string;
  claim: string;
  grade: string; // "A" | "B" | "C" | "D"
  summary: string;
  sourceUrls: string[];
  assessedAt: string;
  createdAt: string;
}

// ── Research Reports (Knowledge Base) ──────────────────────────────────────
export type ReportStatus = "pending" | "in-progress" | "completed" | "failed";

export interface ResearchReport {
  id: string; // UUID v4
  targetType: "product" | "ingredient";
  targetId: string; // productId or ingredientId
  status: ReportStatus;
  // AI-generated content (clearly flagged)
  aiSummary?: string;
  aiKeyFindings?: string[];
  aiEstimatedEfficacy?: number; // 0-100, clearly labeled as AI-estimated
  aiResearchNotes?: string;
  // Metadata
  sourceUrls?: string[];
  generatedAt?: string; // ISO 8601
  expiresAt?: string; // ISO 8601 — cache expiration
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// ── AI Estimates (Autonomous AI Engine) ────────────────────────────────────
export interface AIEstimate {
  id: string; // UUID v4
  targetType: "product" | "ingredient";
  targetId: string;
  // Estimated dimension scores (0-100) — clearly flagged as AI-estimated
  estimatedLabelAccuracy?: number;
  estimatedPuritySafety?: number;
  estimatedEvidence?: number;
  estimatedFormulation?: number;
  estimatedValue?: number;
  estimatedComposite?: number;
  // Confidence score (0-100) of the AI estimation
  confidenceScore: number;
  // Model version that generated this estimate
  modelVersion: string;
  generatedAt: string; // ISO 8601
  expiresAt: string; // ISO 8601
}

// ── Affiliate Links ────────────────────────────────────────────────────────
export interface AffiliateLink {
  id: string; // UUID v4
  productId: string;
  url: string;
  platform: "amazon" | "iherb" | "other";
  priceSnapshot?: number;
  priceCurrency: string;
  priceCapturedAt?: string; // ISO 8601
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Scoring Snapshots (immutable — references from DB) ───────────────────
export interface StoredSnapshot {
  id: string; // matches snapshotId in ScoringSnapshot
  productId: string;
  snapshot: ScoringSnapshot;
  createdAt: string;
}

// ── Web-app-facing query result types ──────────────────────────────────────
export interface ProductWithScore {
  product: Product;
  brand: Brand;
  compositeScore?: number;
  dimensions?: DimensionScores;
  verdict?: string;
  hasRealData: boolean; // true if any dimension has lab/manual data
  reportStatus?: ReportStatus;
}

export interface ProductSearchResult {
  product: Product;
  brand: Brand;
  compositeScore?: number;
  verdict?: string;
}

// ── Schema metadata ─────────────────────────────────────────────────────────
export const SCHEMA_VERSION = "1.0.0";
export const DATA_MODEL_VERSION = "1.0.0";