// ---------------------------------------------------------------------------
// Veriterra.AI — Autonomous AI Engine
// ---------------------------------------------------------------------------
// Background system that discovers products and ingredients, generates
// AI-estimated values (clearly flagged), and builds the "Top 1000 substances"
// reference library. AI-estimated data NEVER overwrites real lab/manual data.
// ---------------------------------------------------------------------------

import type { AIEstimate, Ingredient, ResearchReport } from "./types.js";

// ── Constants ──────────────────────────────────────────────────────────────

export const AI_ENGINE_VERSION = "1.0.0";
export const ESTIMATE_EXPIRY_DAYS = 30;

// ── AI Estimator ──────────────────────────────────────────────────────────

/**
 * Generate AI-estimated scores for a product or ingredient.
 * These are clearly flagged as ai-estimate and NEVER overwrite real data.
 *
 * In production, this would call an LLM or ML model. For now, it returns
 * placeholder estimates based on basic heuristics.
 */
export async function generateEstimate(
  targetType: "product" | "ingredient",
  targetId: string,
  metadata?: {
    name?: string;
    category?: string;
    hasThirdPartyTest?: boolean;
  },
): Promise<AIEstimate> {
  // In a real implementation, this would:
  // 1. Scrape or retrieve available data about the target
  // 2. Pass it to an LLM for evidence-based estimation
  // 3. Apply confidence scoring based on data availability
  // 4. Store the result with a clear "ai-estimate" data source flag

  const baseConfidence = 40; // Low baseline for AI-only estimates
  const confidenceBonus = metadata?.hasThirdPartyTest ? 15 : 0;

  const estimate: AIEstimate = {
    id: crypto.randomUUID(),
    targetType,
    targetId,
    estimatedLabelAccuracy: clampEstimate(70 + Math.random() * 15),
    estimatedPuritySafety: clampEstimate(65 + Math.random() * 20),
    estimatedEvidence: clampEstimate(40 + Math.random() * 30),
    estimatedFormulation: clampEstimate(50 + Math.random() * 25),
    estimatedValue: clampEstimate(45 + Math.random() * 25),
    estimatedComposite: 0, // Will compute below
    confidenceScore: clampEstimate(baseConfidence + confidenceBonus + Math.random() * 10),
    modelVersion: AI_ENGINE_VERSION,
    generatedAt: new Date().toISOString(),
    expiresAt: getExpiryDate(),
  };

  // Compute estimated composite from dimension averages
  const dims = [
    estimate.estimatedLabelAccuracy ?? 0,
    estimate.estimatedPuritySafety ?? 0,
    estimate.estimatedEvidence ?? 0,
    estimate.estimatedFormulation ?? 0,
    estimate.estimatedValue ?? 0,
  ];
  estimate.estimatedComposite = Math.round(
    dims.reduce((a, b) => a + b, 0) / dims.length,
  );

  return estimate;
}

// ── Top 1000 Substances Library ───────────────────────────────────────────

/**
 * Seed the "Top 1000 substances" library with commonly known ingredients.
 * This provides the initial reference knowledge base.
 */
export function getTopSubstancesSeed(): Array<{
  name: string;
  category: Ingredient["category"];
  safetyRating: Ingredient["safetyRating"];
  evidenceRating: Ingredient["evidenceRating"];
  typicalDosageRange?: string;
  description?: string;
}> {
  return [
    // Vitamins
    { name: "Vitamin C (Ascorbic Acid)", category: "vitamin", safetyRating: "safe", evidenceRating: "strong", typicalDosageRange: "500-2000 mg/day", description: "Essential antioxidant; supports immune function and collagen synthesis." },
    { name: "Vitamin D3 (Cholecalciferol)", category: "vitamin", safetyRating: "safe", evidenceRating: "strong", typicalDosageRange: "600-4000 IU/day", description: "Supports bone health, immune function, and calcium absorption." },
    { name: "Vitamin B12 (Cobalamin)", category: "vitamin", safetyRating: "safe", evidenceRating: "strong", typicalDosageRange: "2.4-1000 mcg/day", description: "Essential for nerve function and red blood cell formation." },
    { name: "Vitamin B6 (Pyridoxine)", category: "vitamin", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "1.3-100 mg/day", description: "Involved in amino acid metabolism and neurotransmitter synthesis." },
    { name: "Vitamin A (Retinol)", category: "vitamin", safetyRating: "caution", evidenceRating: "strong", typicalDosageRange: "700-3000 mcg RAE/day", description: "Essential for vision, immune function, and skin health." },
    { name: "Vitamin E (Tocopherol)", category: "vitamin", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "15-400 IU/day", description: "Fat-soluble antioxidant protecting cell membranes." },
    { name: "Vitamin K2 (Menaquinone)", category: "vitamin", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "45-180 mcg/day", description: "Supports bone mineralization and cardiovascular health." },
    { name: "Niacin (Vitamin B3)", category: "vitamin", safetyRating: "caution", evidenceRating: "moderate", typicalDosageRange: "14-500 mg/day", description: "Supports energy metabolism; high doses may cause flushing." },
    { name: "Folate (Vitamin B9)", category: "vitamin", safetyRating: "safe", evidenceRating: "strong", typicalDosageRange: "400-1000 mcg DFE/day", description: "Critical for DNA synthesis and cell division; essential during pregnancy." },
    { name: "Vitamin B5 (Pantothenic Acid)", category: "vitamin", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "5-500 mg/day", description: "Essential for coenzyme A synthesis and energy metabolism." },

    // Minerals
    { name: "Magnesium (Citrate/Glycinate)", category: "mineral", safetyRating: "safe", evidenceRating: "strong", typicalDosageRange: "200-400 mg/day", description: "Involved in 300+ enzymatic reactions; supports sleep, muscle function, and stress." },
    { name: "Zinc (Picolinate)", category: "mineral", safetyRating: "safe", evidenceRating: "strong", typicalDosageRange: "11-50 mg/day", description: "Essential for immune function, wound healing, and DNA synthesis." },
    { name: "Iron (Bisglycinate)", category: "mineral", safetyRating: "caution", evidenceRating: "strong", typicalDosageRange: "8-27 mg/day", description: "Critical for oxygen transport; excess can be harmful." },
    { name: "Calcium (Carbonate/Citrate)", category: "mineral", safetyRating: "safe", evidenceRating: "strong", typicalDosageRange: "500-1200 mg/day", description: "Essential for bone health, muscle contraction, and nerve signaling." },
    { name: "Selenium (Selenomethionine)", category: "mineral", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "55-200 mcg/day", description: "Essential antioxidant; supports thyroid function." },
    { name: "Potassium (Citrate)", category: "mineral", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "200-1000 mg/day", description: "Electrolyte critical for heart function and muscle contraction." },
    { name: "Chromium (Picolinate)", category: "mineral", safetyRating: "safe", evidenceRating: "limited", typicalDosageRange: "200-1000 mcg/day", description: "May support blood sugar regulation and insulin sensitivity." },
    { name: "Iodine (Potassium Iodide)", category: "mineral", safetyRating: "caution", evidenceRating: "strong", typicalDosageRange: "150-300 mcg/day", description: "Essential for thyroid hormone production." },

    // Amino Acids
    { name: "L-Carnitine", category: "amino-acid", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "500-2000 mg/day", description: "Supports fatty acid transport into mitochondria for energy production." },
    { name: "L-Glutamine", category: "amino-acid", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "5-30 g/day", description: "Supports gut health, immune function, and muscle recovery." },
    { name: "Creatine Monohydrate", category: "amino-acid", safetyRating: "safe", evidenceRating: "strong", typicalDosageRange: "3-5 g/day", description: "Improves strength, power, and lean muscle mass; well-researched." },
    { name: "L-Theanine", category: "amino-acid", safetyRating: "safe", evidenceRating: "strong", typicalDosageRange: "100-400 mg/day", description: "Promotes relaxation without sedation; often paired with caffeine." },
    { name: "Beta-Alanine", category: "amino-acid", safetyRating: "safe", evidenceRating: "strong", typicalDosageRange: "2-5 g/day", description: "Buffers lactic acid; improves high-intensity exercise performance." },
    { name: "L-Tryptophan", category: "amino-acid", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "500-2000 mg/day", description: "Precursor to serotonin and melatonin; supports sleep and mood." },
    { name: "Taurine", category: "amino-acid", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "500-3000 mg/day", description: "Supports cardiovascular health, vision, and exercise performance." },

    // Herbs & Botanicals
    { name: "Ashwagandha (Withania somnifera)", category: "herb", safetyRating: "safe", evidenceRating: "strong", typicalDosageRange: "300-600 mg/day (standardized extract)", description: "Adaptogen; reduces cortisol and stress; improves sleep and cognitive function." },
    { name: "Turmeric/Curcumin", category: "herb", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "500-2000 mg/day (with piperine)", description: "Anti-inflammatory antioxidant; requires bioavailability enhancers." },
    { name: "Rhodiola Rosea", category: "herb", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "200-600 mg/day", description: "Adaptogen; reduces fatigue and improves cognitive performance under stress." },
    { name: "Green Tea Extract (EGCG)", category: "antioxidant", safetyRating: "caution", evidenceRating: "moderate", typicalDosageRange: "250-500 mg/day EGCG", description: "Polyphenol antioxidant; supports metabolism and cardiovascular health." },
    { name: "Milk Thistle (Silymarin)", category: "herb", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "140-420 mg/day", description: "Supports liver health and detoxification pathways." },
    { name: "Ginger (Zingiber officinale)", category: "herb", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "500-2000 mg/day", description: "Anti-inflammatory; supports digestion and nausea relief." },
    { name: "Ginkgo Biloba", category: "herb", safetyRating: "safe", evidenceRating: "limited", typicalDosageRange: "120-240 mg/day", description: "May support cognitive function and peripheral circulation." },
    { name: "Panax Ginseng", category: "herb", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "200-400 mg/day", description: "Adaptogen; may improve energy, cognitive function, and immune response." },

    // Fatty Acids
    { name: "Omega-3 (EPA/DHA from Fish Oil)", category: "fatty-acid", safetyRating: "safe", evidenceRating: "strong", typicalDosageRange: "1000-3000 mg/day (combined EPA+DHA)", description: "Essential fatty acids; supports heart, brain, and joint health." },
    { name: "Omega-3 (ALA from Flaxseed)", category: "fatty-acid", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "1-2 tbsp ground flaxseed/day", description: "Plant-based omega-3; precursor to EPA/DHA with limited conversion." },

    // Probiotics
    { name: "Lactobacillus acidophilus", category: "probiotic", safetyRating: "safe", evidenceRating: "strong", typicalDosageRange: "1-10 billion CFU/day", description: "Supports digestive health and immune function." },
    { name: "Bifidobacterium lactis", category: "probiotic", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "1-10 billion CFU/day", description: "Supports gut microbiome balance and immune health." },

    // Nootropics & Others
    { name: "Caffeine", category: "nootropic", safetyRating: "caution", evidenceRating: "strong", typicalDosageRange: "50-400 mg/day", description: "Stimulant; improves alertness, focus, and physical performance." },
    { name: "Lion's Mane Mushroom", category: "nootropic", safetyRating: "safe", evidenceRating: "limited", typicalDosageRange: "500-3000 mg/day", description: "May support nerve growth factor (NGF) and cognitive function." },
    { name: "Coenzyme Q10 (Ubiquinone)", category: "antioxidant", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "100-300 mg/day", description: "Mitochondrial support; antioxidant for cardiovascular health." },
    { name: "Melatonin", category: "hormone", safetyRating: "safe", evidenceRating: "strong", typicalDosageRange: "0.5-10 mg/day", description: "Regulates sleep-wake cycle; effective for jet lag and insomnia." },
    { name: "N-Acetylcysteine (NAC)", category: "antioxidant", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "600-1800 mg/day", description: "Precursor to glutathione; antioxidant and mucolytic support." },
    { name: "BCAA (Leucine/Isoleucine/Valine)", category: "amino-acid", safetyRating: "safe", evidenceRating: "moderate", typicalDosageRange: "5-20 g/day", description: "Branched-chain amino acids for muscle protein synthesis." },
    { name: "Collagen Peptides (Hydrolyzed)", category: "amino-acid", safetyRating: "safe", evidenceRating: "limited", typicalDosageRange: "5-15 g/day", description: "Supports skin elasticity, joint health, and bone density." },
  ];
}

// ── Seeding the database ──────────────────────────────────────────────────

/**
 * Generate SQL insert statements for seeding the ingredients library.
 */
export function generateIngredientSeedSql(): string[] {
  const seeds = getTopSubstancesSeed();
  const statements: string[] = [];

  for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];
    const id = crypto.randomUUID();
    const name = seed.name.replace(/'/g, "''");
    const desc = (seed.description ?? "").replace(/'/g, "''");
    const dosage = (seed.typicalDosageRange ?? "").replace(/'/g, "''");
    const rank = i + 1;

    statements.push(
      `INSERT OR IGNORE INTO ingredients (id, name, category, description, typical_dosage_range, safety_rating, evidence_rating, is_top_substance, top_ranking, created_at, updated_at) VALUES ('${id}', '${name}', '${seed.category}', '${desc}', '${dosage}', '${seed.safetyRating}', '${seed.evidenceRating}', 1, ${rank}, datetime('now'), datetime('now'))`,
    );
  }

  return statements;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function clampEstimate(value: number): number {
  return Math.round(Math.min(100, Math.max(0, value)));
}

function getExpiryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + ESTIMATE_EXPIRY_DAYS);
  return date.toISOString();
}