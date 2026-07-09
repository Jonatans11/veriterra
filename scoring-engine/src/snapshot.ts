// ---------------------------------------------------------------------------
// Veriterra.AI — Immutable Snapshot Architecture
// ---------------------------------------------------------------------------
// Every published score is an immutable record containing:
// - The composite score
// - Each dimension score
// - The exact inputs that produced it
// - Methodology version
// - Timestamp
// - Cryptographic audit hash
//
// Snapshots can be serialised to JSON for storage/database archives.
// The audit hash allows anyone to verify that a snapshot hasn't been tampered
// with by re-hashing the inputs, outputs, and version and comparing.
// ---------------------------------------------------------------------------

import type { ScoringInput, ScoringSnapshot } from "./types.js";
import { SCORING_METHODOLOGY_VERSION } from "./types.js";

/**
 * Simplified SHA-256 digest using the Web Crypto API (available in Node 18+).
 *
 * We avoid pulling in a crypto dependency so the library stays pure and
 * dependency-free.
 */
async function sha256Hex(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Canonical JSON serialisation for hashing.
 * Recursively sorts all object keys deterministically so the same value always
 * produces the same string, regardless of property insertion order.
 */
function canonicalJson(obj: unknown): string {
  if (obj === null || obj === undefined) return JSON.stringify(obj);
  if (Array.isArray(obj)) {
    return `[${obj.map(canonicalJson).join(",")}]`;
  }
  if (typeof obj === "object") {
    const keys = Object.keys(obj as Record<string, unknown>).sort();
    const pairs = keys.map((k) => `"${k}":${canonicalJson((obj as Record<string, unknown>)[k])}`);
    return `{${pairs.join(",")}}`;
  }
  return JSON.stringify(obj);
}

/**
 * Generate a UUID v4 string without external dependencies.
 */
function uuidV4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Create an immutable score snapshot.
 *
 * This is the ONLY way to produce a verified scoring record. Consumers receive
 * a `ScoringSnapshot` which they can serialise to their database.
 *
 * @param inputs — The exact inputs that produced the score (immutable).
 * @param compositeScore — The composite score (0–100).
 * @param dimensionScores — Individual dimension scores.
 * @param verdict — The plain-language verdict label.
 * @param productId — Optional product identifier.
 * @returns A fully populated, auditable snapshot.
 */
export async function createSnapshot(
  inputs: ScoringInput,
  compositeScore: number,
  dimensionScores: { labelAccuracy: number; puritySafety: number; evidence: number; formulation: number; value: number },
  verdict: string,
  productId?: string,
): Promise<ScoringSnapshot> {
  const snapshotId = uuidV4();
  const computedAt = new Date().toISOString();

  // Build the audit payload: everything that makes this score unique.
  // This includes inputs, outputs, and methodology version so that any
  // tampering with any field is detectable.
  const auditPayload = canonicalJson({
    compositeScore,
    dimensions: dimensionScores,
    inputs,
    methodologyVersion: SCORING_METHODOLOGY_VERSION,
    verdict,
  });
  const auditHash = await sha256Hex(auditPayload);

  return {
    snapshotId,
    methodologyVersion: SCORING_METHODOLOGY_VERSION,
    computedAt,
    productId,
    compositeScore,
    dimensions: {
      labelAccuracy: dimensionScores.labelAccuracy,
      puritySafety: dimensionScores.puritySafety,
      evidence: dimensionScores.evidence,
      formulation: dimensionScores.formulation,
      value: dimensionScores.value,
    },
    verdict: verdict as ScoringSnapshot["verdict"],
    inputs,
    auditHash,
  };
}

/**
 * Verify a snapshot's integrity by re-computing its audit hash.
 *
 * @param snapshot — A previously created snapshot.
 * @returns True if the hash matches; false if the snapshot has been tampered with.
 */
export async function verifySnapshot(
  snapshot: ScoringSnapshot,
): Promise<boolean> {
  const auditPayload = canonicalJson({
    compositeScore: snapshot.compositeScore,
    dimensions: snapshot.dimensions,
    inputs: snapshot.inputs,
    methodologyVersion: snapshot.methodologyVersion,
    verdict: snapshot.verdict,
  });
  const expectedHash = await sha256Hex(auditPayload);

  return expectedHash === snapshot.auditHash;
}