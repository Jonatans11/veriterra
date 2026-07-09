// ---------------------------------------------------------------------------
// Veriterra.AI — Research Engine Entry Point
// ---------------------------------------------------------------------------
// Exports everything the web app and other services need from the
// Research Portal, Autonomous AI Engine, and data pipelines.
// ---------------------------------------------------------------------------

// Schema & types
export { CREATE_TABLES_SQL, DROP_TABLES_SQL, TABLE_DEFINITIONS } from "./schema.js";
export type { TableDefinition } from "./schema.js";

// Re-export all types
export type {
  Product, Brand, Category,
  Ingredient, IngredientCategory, SafetyRating, EvidenceRating,
  ProductIngredient,
  LabResult, ContaminantReading,
  EvidenceGradeEntry,
  ResearchReport, ReportStatus,
  AIEstimate,
  AffiliateLink,
  StoredSnapshot,
  ProductWithScore, ProductSearchResult,
} from "./types.js";
export { SCHEMA_VERSION, DATA_MODEL_VERSION } from "./types.js";

// Knowledge base
export {
  getOrCreateReport,
  getReport,
  completeReport,
  isReportValid,
  failReport,
} from "./knowledge-base.js";

// Barcode scanner
export {
  lookupByBarcode,
  scanFromPhoto,
  generateProductInserts,
} from "./barcode-scanner.js";
export type { BarcodeScanResult, PhotoScanResult } from "./barcode-scanner.js";

// Autonomous AI Engine
export {
  generateEstimate,
  getTopSubstancesSeed,
  generateIngredientSeedSql,
  AI_ENGINE_VERSION,
  ESTIMATE_EXPIRY_DAYS,
} from "./ai-estimator.js";

// Version metadata
export const RESEARCH_ENGINE_VERSION = "1.0.0";