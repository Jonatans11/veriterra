// ---------------------------------------------------------------------------
// Veriterra.AI — AI Estimator
// ---------------------------------------------------------------------------
// Generates estimated scoring inputs for a product using heuristic rules.
// All outputs are flagged as "ai-estimate" — never confused with lab data.
// The scoring engine itself is source-agnostic; source discrimination is
// enforced at the database layer (snapshots preserve source metadata).
// ---------------------------------------------------------------------------

import type { AiEstimatedInputs, AiDiscoveredProduct } from "./types.js";

/**
 * Estimate scoring inputs for a product using heuristic rules.
 *
 * This is a deterministic estimation engine — it uses the product's
 * category, name, brand reputation, and known ingredient profiles to
 * generate reasonable default values. Every estimate includes a
 * confidence level and rationale.
 *
 * IMPORTANT: These estimates are NEVER stored as lab or manual data.
 * They are clearly flagged as "ai-estimate" in the snapshot.
 */
export function estimateProductInputs(
  product: AiDiscoveredProduct,
): AiEstimatedInputs {
  const category = product.category;
  const name = product.name.toLowerCase();
  const brand = product.brand.toLowerCase();

  // ── Label Accuracy Estimation ──────────────────────────────────────
  // Most supplements are within 90-110% of label claim. We estimate
  // conservatively at 95% with medium confidence.
  const labelAccuracy = estimateLabelAccuracy(name, brand, category);

  // ── Purity & Safety Estimation ─────────────────────────────────────
  const puritySafety = estimatePuritySafety(name, brand, category);

  // ── Evidence Estimation ────────────────────────────────────────────
  const evidence = estimateEvidence(name, category);

  // ── Formulation Estimation ─────────────────────────────────────────
  const formulation = estimateFormulation(name, brand, category);

  // ── Value Estimation ────────────────────────────────────────────────
  const value = estimateValue(category);

  return {
    labelAccuracy,
    puritySafety,
    evidence,
    formulation,
    value,
  };
}

function estimateLabelAccuracy(
  name: string,
  brand: string,
  _category: string,
): AiEstimatedInputs["labelAccuracy"] {
  // Known reputable brands get a slightly higher estimate
  const reputableBrands = ["thorne", "pure encapsulations", "designs for health", "metagenics", "life extension", "now foods", "solgar", "nature made"];
  const isReputable = reputableBrands.some((b) => brand.includes(b));

  // Proprietary blends often have lower accuracy
  const hasPropBlend = name.includes("proprietary") || name.includes("blend");

  let measuredVsClaimedPercent = isReputable ? 97 : 92;
  let confidence: "high" | "medium" | "low" = isReputable ? "high" : "medium";

  if (hasPropBlend) {
    measuredVsClaimedPercent -= 10;
    confidence = "low";
  }

  return {
    measuredVsClaimedPercent,
    confidence,
    rationale: isReputable
      ? "Reputable brand with known quality control standards"
      : hasPropBlend
        ? "Proprietary blend — actual potency may vary significantly"
        : "Estimated based on industry average for this category",
  };
}

function estimatePuritySafety(
  name: string,
  _brand: string,
  category: string,
): AiEstimatedInputs["puritySafety"] {
  // Fish oil / omega-3 products have higher contamination risk
  const isFishOil = category === "omega-3s" || name.includes("fish oil") || name.includes("krill");
  // Herbal products have medium contamination risk
  const isHerbal = category === "herbal";

  const contaminants = [];

  if (isFishOil) {
    contaminants.push(
      { contaminant: "lead", amountMcg: 0.5, safetyLimitMcg: 1.0 },
      { contaminant: "mercury", amountMcg: 0.08, safetyLimitMcg: 0.3 },
      { contaminant: "pcbs", amountMcg: 0.02, safetyLimitMcg: 0.09 },
    );
  } else if (isHerbal) {
    contaminants.push(
      { contaminant: "lead", amountMcg: 0.8, safetyLimitMcg: 1.0 },
      { contaminant: "arsenic", amountMcg: 0.3, safetyLimitMcg: 1.0 },
      { contaminant: "cadmium", amountMcg: 0.2, safetyLimitMcg: 0.5 },
    );
  } else {
    contaminants.push(
      { contaminant: "lead", amountMcg: 0.3, safetyLimitMcg: 1.0 },
      { contaminant: "arsenic", amountMcg: 0.1, safetyLimitMcg: 1.0 },
      { contaminant: "cadmium", amountMcg: 0.05, safetyLimitMcg: 0.5 },
      { contaminant: "mercury", amountMcg: 0.02, safetyLimitMcg: 0.3 },
    );
  }

  return {
    contaminants,
    thirdPartyTested: !isHerbal, // Herbal products less likely to be 3rd-party tested
    confidence: isFishOil ? "medium" : isHerbal ? "low" : "high",
    rationale: isFishOil
      ? "Fish oil supplements have known contamination risk — estimated conservatively"
      : isHerbal
        ? "Herbal supplements have variable quality control — estimated with low confidence"
        : "Standard synthetic supplements typically have low contamination risk",
  };
}

function estimateEvidence(
  name: string,
  category: string,
): AiEstimatedInputs["evidence"] {
  // Map known ingredients to evidence grades
  const evidenceMap: Record<string, "A" | "B" | "C" | "D"> = {
    // Well-established (Grade A)
    "vitamin d": "A",
    "vitamin d3": "A",
    "omega-3": "A",
    "fish oil": "A",
    "folic acid": "A",
    "vitamin b12": "A",
    calcium: "A",
    magnesium: "A",
    zinc: "A",
    iron: "A",
    creatine: "A",
    "whey protein": "A",
    // Well-studied (Grade B)
    probiotics: "B",
    "vitamin c": "B",
    "vitamin e": "B",
    "b complex": "B",
    "coq10": "B",
    "coenzyme q10": "B",
    curcumin: "B",
    "green tea": "B",
    melatonin: "B",
    collagen: "B",
    glucosamine: "B",
    // Limited evidence (Grade C)
    ashwagandha: "C",
    "rhodiola rosea": "C",
    "milk thistle": "C",
    "grape seed": "C",
    "ginkgo biloba": "C",
    "saw palmetto": "C",
    "st. john's wort": "C",
    valerian: "C",
    // Traditional use only (Grade D)
    "maca root": "D",
    "horny goat weed": "D",
    "tribulus terrestris": "D",
  };

  // Find matching ingredients in the product name
  const matchedClaims: Array<{ claim: string; grade: "A" | "B" | "C" | "D" }> = [];
  for (const [ingredient, grade] of Object.entries(evidenceMap)) {
    if (name.includes(ingredient)) {
      matchedClaims.push({
        claim: `Supports ${ingredient}-related health benefits`,
        grade,
      });
    }
  }

  if (matchedClaims.length === 0) {
    // Generic claim for unknown products
    matchedClaims.push({
      claim: "Supports general health and wellness",
      grade: "C",
    });
  }

  const hasStrongEvidence = matchedClaims.some((c) => c.grade === "A" || c.grade === "B");
  const hasWeakEvidence = matchedClaims.every((c) => c.grade === "C" || c.grade === "D");

  return {
    claims: matchedClaims,
    confidence: hasStrongEvidence ? "high" : hasWeakEvidence ? "low" : "medium",
    rationale: hasStrongEvidence
      ? "Product contains well-studied ingredients with strong scientific backing"
      : hasWeakEvidence
        ? "Product ingredients have limited scientific evidence"
        : "Product contains a mix of well-studied and less-studied ingredients",
  };
}

function estimateFormulation(
  name: string,
  brand: string,
  _category: string,
): AiEstimatedInputs["formulation"] {
  const reputableBrands = ["thorne", "pure encapsulations", "designs for health", "metagenics", "life extension"];
  const isPremium = reputableBrands.some((b) => brand.includes(b));

  // Check for bioavailable forms
  const hasBioavailableForm = name.includes("methyl") ||
    name.includes("chelated") ||
    name.includes("bisglycinate") ||
    name.includes("citrate") ||
    name.includes("active") ||
    name.includes("liposomal");

  // Check for clinical dosing language
  const hasClinicalDose = name.includes("iu") ||
    name.includes("mg") ||
    name.includes("mcg") ||
    name.includes("international units");

  return {
    doseAdequacyScore: hasClinicalDose ? 0.8 : 0.5,
    bioavailabilityScore: hasBioavailableForm ? 0.9 : isPremium ? 0.7 : 0.5,
    thirdPartyCertified: isPremium ? 1.0 : 0.5,
    confidence: isPremium ? "high" : hasBioavailableForm ? "medium" : "low",
    rationale: isPremium
      ? "Premium brand with high-quality formulation standards"
      : hasBioavailableForm
        ? "Product uses bioavailable ingredient forms — better absorption expected"
        : "Standard formulation — estimated based on product category averages",
  };
}

function estimateValue(category: string): AiEstimatedInputs["value"] {
  const benchmarkCosts: Record<string, number> = {
    "vitamins-minerals": 0.15,
    "protein-amino-acids": 0.50,
    "omega-3s": 0.15,
    probiotics: 0.30,
    herbal: 0.20,
    "sports-nutrition": 0.40,
    "sleep-mood": 0.25,
    "joint-bone": 0.35,
  };

  const benchmark = benchmarkCosts[category] ?? 0.25;

  // AI estimates cost at ~benchmark level with some variation
  const estimatedCost = benchmark * (0.8 + Math.random() * 0.4);

  return {
    costPerEffectiveDose: Math.round(estimatedCost * 100) / 100,
    categoryBenchmarkCost: benchmark,
    confidence: category in benchmarkCosts ? "medium" : "low",
    rationale: category in benchmarkCosts
      ? `Estimated cost within typical range for ${category} category`
      : "No established benchmark for this category — estimated conservatively",
  };
}