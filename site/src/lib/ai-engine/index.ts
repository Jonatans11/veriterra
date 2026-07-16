// ---------------------------------------------------------------------------
// Veriterra.AI — AI Engine Index (Public API)
// ---------------------------------------------------------------------------

export { AiEngine, runAiCycle, aiScoreProduct } from "./engine.js";
export { estimateProductInputs } from "./estimator.js";
export { discoverProducts, hasLabData, hasExistingScore } from "./discoverer.js";
export {
  getSubstances,
  findSubstance,
  getTopSubstances,
  searchSubstances,
  getSubstanceCategories,
  getSubstanceCount,
} from "./top-substances.js";
export {
  DEFAULT_AI_ENGINE_CONFIG,
} from "./types.js";

export type {
  AiDiscoveredProduct,
  AiEstimatedInputs,
  AiResearchReport,
  AiScoringResult,
  AiEngineConfig,
} from "./types.js";

export type { SubstanceEntry } from "./top-substances.js";