// ---------------------------------------------------------------------------
// Veriterra.AI — Scoring Engine Entry Point
// ---------------------------------------------------------------------------

export { score, computeDimensionScores, computeCompositeScore } from "./scorer.js";
export { DIMENSION_WEIGHTS } from "./scorer.js";
export { scoreLabelAccuracy } from "./dimensions/label-accuracy.js";
export { scorePuritySafety } from "./dimensions/purity-safety.js";
export { scoreEvidence } from "./dimensions/evidence.js";
export { scoreFormulation } from "./dimensions/formulation.js";
export { scoreValue } from "./dimensions/value.js";
export { scoreToVerdict } from "./verdict.js";
export { createSnapshot, verifySnapshot } from "./snapshot.js";

export {
  SCORING_METHODOLOGY_VERSION,
} from "./types.js";

export type {
  DataSource,
  LabelAccuracyInput,
  ContaminantReading,
  PuritySafetyInput,
  EvidenceGrade,
  ClaimGrade,
  EvidenceInput,
  FormulationInput,
  ValueInput,
  ScoringInput,
  DimensionScores,
  VerdictLabel,
  ScoringSnapshot,
  ScoringResult,
} from "./types.js";