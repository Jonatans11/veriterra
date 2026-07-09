// ---------------------------------------------------------------------------
// Veriterra.AI — Snapshot Tests
// ---------------------------------------------------------------------------

import { describe, expect, it } from "vitest";
import { createSnapshot, verifySnapshot } from "../src/snapshot.js";
import type { ScoringInput, ScoringSnapshot } from "../src/types.js";

const sampleInput: ScoringInput = {
  labelAccuracy: { measuredVsClaimedPercent: 100, source: "lab" },
  puritySafety: {
    contaminants: [
      { contaminant: "lead", amountMcg: 0.2, safetyLimitMcg: 1.0, source: "lab" },
    ],
    thirdPartyTested: true,
    source: "lab",
  },
  evidence: {
    claims: [{ claim: "test", grade: "A" }],
    source: "manual",
  },
  formulation: {
    doseAdequacyScore: 1.0,
    bioavailabilityScore: 1.0,
    thirdPartyCertified: 1.0,
    source: "manual",
  },
  value: {
    costPerEffectiveDose: 0.25,
    categoryBenchmarkCost: 0.50,
    source: "manual",
  },
};

describe("createSnapshot", () => {
  it("produces a valid snapshot with all fields", async () => {
    const snapshot = await createSnapshot(
      sampleInput,
      85,
      { labelAccuracy: 100, puritySafety: 100, evidence: 75, formulation: 100, value: 100 },
      "Solid choice",
      "prod-123",
    );

    expect(snapshot).toBeDefined();
    expect(snapshot.snapshotId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(snapshot.methodologyVersion).toBe("1.0.0");
    expect(snapshot.computedAt).toBeDefined();
    expect(new Date(snapshot.computedAt).toISOString()).toBe(snapshot.computedAt);
    expect(snapshot.productId).toBe("prod-123");
    expect(snapshot.compositeScore).toBe(85);
    expect(snapshot.dimensions.labelAccuracy).toBe(100);
    expect(snapshot.dimensions.puritySafety).toBe(100);
    expect(snapshot.dimensions.evidence).toBe(75);
    expect(snapshot.dimensions.formulation).toBe(100);
    expect(snapshot.dimensions.value).toBe(100);
    expect(snapshot.verdict).toBe("Solid choice");
    expect(snapshot.inputs).toEqual(sampleInput);
    expect(snapshot.auditHash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("generates unique snapshot IDs each time", async () => {
    const snap1 = await createSnapshot(sampleInput, 80, {
      labelAccuracy: 100, puritySafety: 100, evidence: 100, formulation: 100, value: 100,
    }, "Worth taking");
    const snap2 = await createSnapshot(sampleInput, 80, {
      labelAccuracy: 100, puritySafety: 100, evidence: 100, formulation: 100, value: 100,
    }, "Worth taking");

    expect(snap1.snapshotId).not.toBe(snap2.snapshotId);
  });

  it("captures the exact inputs in the snapshot", async () => {
    const snapshot = await createSnapshot(sampleInput, 95, {
      labelAccuracy: 100, puritySafety: 100, evidence: 100, formulation: 100, value: 100,
    }, "Worth taking");

    // Deep equal — the snapshot stores the original inputs forever
    expect(snapshot.inputs).toEqual(sampleInput);
  });
});

describe("verifySnapshot", () => {
  it("returns true for an untampered snapshot", async () => {
    const snapshot = await createSnapshot(sampleInput, 85, {
      labelAccuracy: 100, puritySafety: 100, evidence: 75, formulation: 100, value: 100,
    }, "Solid choice");

    const valid = await verifySnapshot(snapshot);
    expect(valid).toBe(true);
  });

  it("returns false for a tampered snapshot", async () => {
    const snapshot = await createSnapshot(sampleInput, 85, {
      labelAccuracy: 100, puritySafety: 100, evidence: 75, formulation: 100, value: 100,
    }, "Solid choice");

    // Tamper with the inputs
    const tampered: ScoringSnapshot = {
      ...snapshot,
      inputs: {
        ...snapshot.inputs,
        labelAccuracy: { measuredVsClaimedPercent: 50, source: "lab" },
      },
    };

    const valid = await verifySnapshot(tampered);
    expect(valid).toBe(false);
  });

  it("returns false when the composite score is changed", async () => {
    const snapshot = await createSnapshot(sampleInput, 85, {
      labelAccuracy: 100, puritySafety: 100, evidence: 75, formulation: 100, value: 100,
    }, "Solid choice");

    const tampered: ScoringSnapshot = {
      ...snapshot,
      compositeScore: 90,
    };

    const valid = await verifySnapshot(tampered);
    expect(valid).toBe(false);
  });
});