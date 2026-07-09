// ---------------------------------------------------------------------------
// Veriterra.AI — Dimension Scoring Tests
// ---------------------------------------------------------------------------

import { describe, expect, it } from "vitest";
import { scoreLabelAccuracy } from "../src/dimensions/label-accuracy.js";
import { scorePuritySafety } from "../src/dimensions/purity-safety.js";
import { scoreEvidence } from "../src/dimensions/evidence.js";
import { scoreFormulation } from "../src/dimensions/formulation.js";
import { scoreValue } from "../src/dimensions/value.js";

// ── Label Accuracy ────────────────────────────────────────────────────────

describe("scoreLabelAccuracy", () => {
  it("returns 100 for exact match", () => {
    expect(scoreLabelAccuracy({ measuredVsClaimedPercent: 100, source: "lab" })).toBe(100);
  });

  it("returns 100 for slight over-dose (100-110%)", () => {
    expect(scoreLabelAccuracy({ measuredVsClaimedPercent: 105, source: "lab" })).toBe(100);
  });

  it("penalises over-dosing gently", () => {
    // 150% claimed → 100 - ((150-100-10) * 0.5) = 100 - 20 = 80
    expect(scoreLabelAccuracy({ measuredVsClaimedPercent: 150, source: "lab" })).toBe(80);
  });

  it("floors over-dose penalty at 50", () => {
    // 200%+ → clamped at 50
    expect(scoreLabelAccuracy({ measuredVsClaimedPercent: 250, source: "lab" })).toBe(50);
  });

  it("severely penalises under-dosing", () => {
    // 80% claimed → ((80-50)/50)*100 = 60
    expect(scoreLabelAccuracy({ measuredVsClaimedPercent: 80, source: "lab" })).toBe(60);
  });

  it("returns 0 for severe under-dose (≤50%)", () => {
    expect(scoreLabelAccuracy({ measuredVsClaimedPercent: 40, source: "lab" })).toBe(0);
  });

  it("returns 50 at 75% of claimed", () => {
    expect(scoreLabelAccuracy({ measuredVsClaimedPercent: 75, source: "lab" })).toBe(50);
  });

  it("clamps at 100 for over-delivery", () => {
    expect(scoreLabelAccuracy({ measuredVsClaimedPercent: 101, source: "lab" })).toBe(100);
  });
});

// ── Purity & Safety ───────────────────────────────────────────────────────

describe("scorePuritySafety", () => {
  it("returns 100 when all contaminants are within limits", () => {
    const result = scorePuritySafety({
      contaminants: [
        { contaminant: "lead", amountMcg: 0.5, safetyLimitMcg: 1.0, source: "lab" },
        { contaminant: "arsenic", amountMcg: 0.8, safetyLimitMcg: 1.0, source: "lab" },
      ],
      thirdPartyTested: true,
      source: "lab",
    });
    // 100 + 10 bonus → capped at 100
    expect(result).toBe(100);
  });

  it("penalises by the worst contaminant", () => {
    const result = scorePuritySafety({
      contaminants: [
        { contaminant: "lead", amountMcg: 0.5, safetyLimitMcg: 1.0, source: "lab" },
        { contaminant: "mercury", amountMcg: 1.8, safetyLimitMcg: 1.0, source: "lab" }, // ratio = 1.8 → 100 - (0.8/2)*100 = 60
      ],
      thirdPartyTested: false,
      source: "lab",
    });
    // Worst is mercury → 60
    expect(result).toBe(60);
  });

  it("returns 0 when a contaminant is 3×+ the limit", () => {
    const result = scorePuritySafety({
      contaminants: [
        { contaminant: "cadmium", amountMcg: 3.0, safetyLimitMcg: 1.0, source: "lab" },
      ],
      thirdPartyTested: false,
      source: "lab",
    });
    expect(result).toBe(0);
  });

  it("applies third-party bonus", () => {
    const result = scorePuritySafety({
      contaminants: [
        { contaminant: "lead", amountMcg: 1.5, safetyLimitMcg: 1.0, source: "lab" }, // ratio 1.5 → 75
      ],
      thirdPartyTested: true,
      source: "lab",
    });
    // 75 + 10 = 85
    expect(result).toBe(85);
  });

  it("returns neutral 50 when no contaminant data", () => {
    const result = scorePuritySafety({
      contaminants: [],
      thirdPartyTested: false,
      source: "manual",
    });
    expect(result).toBe(50);
  });
});

// ── Evidence ──────────────────────────────────────────────────────────────

describe("scoreEvidence", () => {
  it("returns 100 for all A-grade claims", () => {
    const result = scoreEvidence({
      claims: [
        { claim: "supports immune health", grade: "A" },
        { claim: "reduces inflammation", grade: "A" },
      ],
      source: "manual",
    });
    expect(result).toBe(100);
  });

  it("returns 75 for all B-grade claims", () => {
    const result = scoreEvidence({
      claims: [{ claim: "test claim", grade: "B" }],
      source: "manual",
    });
    expect(result).toBe(75);
  });

  it("averages claims of different grades", () => {
    const result = scoreEvidence({
      claims: [
        { claim: "well-studied benefit", grade: "A" },    // 100
        { claim: "some evidence", grade: "C" },            // 50
      ],
      source: "manual",
    });
    // (100 + 50) / 2 = 75
    expect(result).toBe(75);
  });

  it("returns 0 when no claims provided", () => {
    const result = scoreEvidence({
      claims: [],
      source: "manual",
    });
    expect(result).toBe(0);
  });

  it("handles D-grade claims", () => {
    const result = scoreEvidence({
      claims: [{ claim: "anecdotal", grade: "D" }],
      source: "manual",
    });
    expect(result).toBe(25);
  });
});

// ── Formulation ───────────────────────────────────────────────────────────

describe("scoreFormulation", () => {
  it("returns 100 for perfect formulation", () => {
    const result = scoreFormulation({
      doseAdequacyScore: 1.0,
      bioavailabilityScore: 1.0,
      thirdPartyCertified: 1.0,
      source: "manual",
    });
    expect(result).toBe(100);
  });

  it("returns 0 for worst formulation", () => {
    const result = scoreFormulation({
      doseAdequacyScore: 0,
      bioavailabilityScore: 0,
      thirdPartyCertified: 0,
      source: "manual",
    });
    expect(result).toBe(0);
  });

  it("weights dose adequacy most heavily", () => {
    const result = scoreFormulation({
      doseAdequacyScore: 0.5,    // 0.5 * 0.5 = 0.25
      bioavailabilityScore: 1.0,  // 1.0 * 0.3 = 0.30
      thirdPartyCertified: 1.0,   // 1.0 * 0.2 = 0.20
      source: "manual",
    });
    // 0.25 + 0.30 + 0.20 = 0.75 → 75
    expect(result).toBe(75);
  });
});

// ── Value ─────────────────────────────────────────────────────────────────

describe("scoreValue", () => {
  it("returns 100 when cost equals benchmark", () => {
    const result = scoreValue({
      costPerEffectiveDose: 0.50,
      categoryBenchmarkCost: 0.50,
      source: "manual",
    });
    expect(result).toBe(100);
  });

  it("returns 100 when cost is below benchmark", () => {
    const result = scoreValue({
      costPerEffectiveDose: 0.30,
      categoryBenchmarkCost: 0.50,
      source: "manual",
    });
    expect(result).toBe(100);
  });

  it("penalises costs above benchmark", () => {
    const result = scoreValue({
      costPerEffectiveDose: 1.00,  // 2× benchmark
      categoryBenchmarkCost: 0.50,
      source: "manual",
    });
    // 100 - (2 - 1) * 50 = 50
    expect(result).toBe(50);
  });

  it("returns 0 at 3×+ benchmark", () => {
    const result = scoreValue({
      costPerEffectiveDose: 1.80,  // 3.6× benchmark
      categoryBenchmarkCost: 0.50,
      source: "manual",
    });
    expect(result).toBe(0);
  });

  it("returns neutral 50 when no benchmark available", () => {
    const result = scoreValue({
      costPerEffectiveDose: 1.00,
      categoryBenchmarkCost: 0,
      source: "manual",
    });
    expect(result).toBe(50);
  });
});