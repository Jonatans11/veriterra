// ---------------------------------------------------------------------------
// Veriterra.AI — Scoring Server Function
// ---------------------------------------------------------------------------
// Provides a server-only bridge between the scoring engine and the frontend.
// Used by the product detail page to compute and display scores.
// ---------------------------------------------------------------------------

import { createServerFn } from "@tanstack/react-start";
import { score, createSnapshot } from "@veriterra/scoring-engine";
import type { ScoringInput, ScoringResult, ScoringSnapshot } from "@veriterra/scoring-engine";

/**
 * Demo product data for Vitamin D3 2000 IU.
 * This demonstrates the scoring engine with realistic input data.
 */
const DEMO_PRODUCTS: Record<string, { name: string; brand: string; description: string; input: ScoringInput }> = {
  "vitamin-d3-demo": {
    name: "Vitamin D3 2000 IU",
    brand: "NutriGenix",
    description:
      "A high-potency Vitamin D3 (cholecalciferol) supplement designed to support bone health, immune function, and calcium absorption. Third-party tested for purity and potency.",
    input: {
      labelAccuracy: {
        measuredVsClaimedPercent: 98,
        source: "lab",
        notes: "Third-party lab tested; contains 1,960 IU vs 2,000 IU claimed (98% potency)",
      },
      puritySafety: {
        contaminants: [
          { contaminant: "lead", amountMcg: 0.3, safetyLimitMcg: 1.0, source: "lab" },
          { contaminant: "arsenic", amountMcg: 0.1, safetyLimitMcg: 1.0, source: "lab" },
          { contaminant: "cadmium", amountMcg: 0.05, safetyLimitMcg: 0.5, source: "lab" },
          { contaminant: "mercury", amountMcg: 0.02, safetyLimitMcg: 0.3, source: "lab" },
        ],
        thirdPartyTested: true,
        source: "lab",
        notes: "USP verified; all heavy metals well below USP limits",
      },
      evidence: {
        claims: [
          { claim: "Supports bone health", grade: "A" },
          { claim: "Supports immune function", grade: "A" },
          { claim: "Supports calcium absorption", grade: "A" },
          { claim: "Supports mood and cognitive health", grade: "B" },
        ],
        source: "manual",
        notes: "Vitamin D's role in bone/immune health is well-established via meta-analyses",
      },
      formulation: {
        doseAdequacyScore: 1.0,
        bioavailabilityScore: 0.8,
        thirdPartyCertified: 1.0,
        source: "manual",
        notes: "D3 (cholecalciferol) form is 2-3× more bioavailable than D2. 2000 IU is a clinically adequate daily dose.",
      },
      value: {
        costPerEffectiveDose: 0.06,
        categoryBenchmarkCost: 0.10,
        source: "manual",
        notes: "$0.06/serving vs. $0.10 category average — excellent value",
      },
    },
  },
  "omega-3-demo": {
    name: "Omega-3 Fish Oil 1000mg",
    brand: "PureMarine",
    description:
      "Concentrated omega-3 fatty acids (EPA/DHA) from wild-caught anchovies and sardines. Molecularly distilled for purity and freshness.",
    input: {
      labelAccuracy: {
        measuredVsClaimedPercent: 92,
        source: "lab",
        notes: "Third-party tested; 460mg EPA + 340mg DHA vs 500mg + 350mg claimed",
      },
      puritySafety: {
        contaminants: [
          { contaminant: "lead", amountMcg: 0.8, safetyLimitMcg: 1.0, source: "lab" },
          { contaminant: "arsenic", amountMcg: 0.9, safetyLimitMcg: 1.0, source: "lab" },
          { contaminant: "cadmium", amountMcg: 0.3, safetyLimitMcg: 0.5, source: "lab" },
          { contaminant: "mercury", amountMcg: 0.15, safetyLimitMcg: 0.3, source: "lab" },
        ],
        thirdPartyTested: true,
        source: "lab",
      },
      evidence: {
        claims: [
          { claim: "Supports cardiovascular health", grade: "A" },
          { claim: "Supports brain function", grade: "B" },
          { claim: "Reduces triglyceride levels", grade: "A" },
        ],
        source: "manual",
      },
      formulation: {
        doseAdequacyScore: 0.9,
        bioavailabilityScore: 0.7,
        thirdPartyCertified: 1.0,
        source: "manual",
      },
      value: {
        costPerEffectiveDose: 0.18,
        categoryBenchmarkCost: 0.15,
        source: "manual",
      },
    },
  },
  "multivitamin-demo": {
    name: "Daily Multivitamin (Men's 50+)",
    brand: "VitaCore",
    description:
      "Comprehensive multivitamin formulated for men over 50 with optimized levels of B12, D3, magnesium, zinc, and lycopene. Third-party tested and USP certified.",
    input: {
      labelAccuracy: {
        measuredVsClaimedPercent: 85,
        source: "lab",
        notes: "Third-party tested; slightly under in B12 (90% of claimed) and magnesium (82% of claimed)",
      },
      puritySafety: {
        contaminants: [
          { contaminant: "lead", amountMcg: 0.6, safetyLimitMcg: 1.0, source: "lab" },
          { contaminant: "arsenic", amountMcg: 0.4, safetyLimitMcg: 1.0, source: "lab" },
          { contaminant: "cadmium", amountMcg: 0.1, safetyLimitMcg: 0.5, source: "lab" },
          { contaminant: "mercury", amountMcg: 0.05, safetyLimitMcg: 0.3, source: "lab" },
        ],
        thirdPartyTested: true,
        source: "lab",
      },
      evidence: {
        claims: [
          { claim: "Supports immune health", grade: "A" },
          { claim: "Supports bone health", grade: "A" },
          { claim: "Supports energy metabolism", grade: "B" },
          { claim: "Supports cardiovascular health", grade: "B" },
          { claim: "Supports prostate health", grade: "C" },
        ],
        source: "manual",
      },
      formulation: {
        doseAdequacyScore: 0.7,
        bioavailabilityScore: 0.6,
        thirdPartyCertified: 1.0,
        source: "manual",
        notes: "Good formulation with bioavailable forms (methylcobalamin B12, chelated minerals). Some nutrients slightly below optimal clinical doses.",
      },
      value: {
        costPerEffectiveDose: 0.35,
        categoryBenchmarkCost: 0.30,
        source: "manual",
        notes: "Cost per day is $0.35 vs $0.30 category average — slightly above benchmark.",
      },
    },
  },
};

/**
 * Score a product by its ID.
 * Returns the scoring result with a snapshot for auditability.
 */
export const getProductScore = createServerFn({ method: "GET" })
  .validator((productId: string) => {
    const id = productId.trim().toLowerCase();
    // Allow alphanumeric, hyphens, and underscores only
    if (!/^[a-z0-9_-]+$/.test(id)) {
      throw new Error("Invalid product ID format");
    }
    return id;
  })
  .handler(async ({ data: productId }) => {
    const product = DEMO_PRODUCTS[productId];

    if (!product) {
      return {
        found: false as const,
        error: "Product not found",
      };
    }

    // Compute the score
    const result: ScoringResult = score(product.input);

    // Create an immutable snapshot
    const snapshot: ScoringSnapshot = await createSnapshot(
      product.input,
      result.compositeScore,
      result.dimensions,
      result.verdict,
      productId,
    );

    return {
      found: true as const,
      product: {
        name: product.name,
        brand: product.brand,
        description: product.description,
      },
      result,
      snapshot,
    };
  });

export type ProductScoreResponse = Awaited<ReturnType<typeof getProductScore>>;
