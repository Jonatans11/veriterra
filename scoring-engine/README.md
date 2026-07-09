# @veriterra/scoring-engine

Deterministic dietary supplement scoring engine — the core IP of Veriterra.AI.

A pure, stateless TypeScript library that computes a transparent composite score (0–100) and plain-language verdict for any dietary supplement, backed by five objective dimensions.

## Scoring Dimensions

| Dimension | Weight | Description |
|-----------|--------|-------------|
| **Label Accuracy** | 25% | Lab-measured potency vs. label claim. Under-dosing penalised hardest. |
| **Purity & Safety** | 25% | Heavy-metal contamination (lead, arsenic, cadmium, mercury) vs. safety limits. |
| **Evidence** | 25% | Average research strength of marketed claims (grades A–D). |
| **Formulation** | 15% | Clinical dose adequacy, bioavailable form, third-party testing. |
| **Value** | 10% | Cost per clinically effective dose vs. category benchmark. |

## Verdict Mapping

| Score Range | Verdict |
|-------------|---------|
| 80–100 | **Worth taking** |
| 60–79 | **Solid choice** |
| 40–59 | **Mixed** |
| 0–39 | **Skip it** |

## Installation

```bash
npm install @veriterra/scoring-engine
```

## Usage

```typescript
import { score } from "@veriterra/scoring-engine";

const result = score({
  labelAccuracy: { measuredVsClaimedPercent: 100, source: "lab" },
  puritySafety: {
    contaminants: [
      { contaminant: "lead", amountMcg: 0.5, safetyLimitMcg: 1.0, source: "lab" },
    ],
    thirdPartyTested: true,
    source: "lab",
  },
  evidence: {
    claims: [
      { claim: "supports immune health", grade: "A" },
    ],
    source: "manual",
  },
  formulation: {
    doseAdequacyScore: 1.0,
    bioavailabilityScore: 1.0,
    thirdPartyCertified: 1.0,
    source: "manual",
  },
  value: {
    costPerEffectiveDose: 0.30,
    categoryBenchmarkCost: 0.50,
    source: "manual",
  },
});

console.log(result.compositeScore); // 0–100
console.log(result.verdict); // "Worth taking" | "Solid choice" | "Mixed" | "Skip it"
console.log(result.dimensions); // individual dimension scores
```

## Immutable Snapshots

Every score can be captured as an immutable `ScoringSnapshot` with:

- A unique snapshot ID (UUID v4)
- The exact inputs used
- Each dimension score
- The composite score and verdict
- An SHA-256 audit hash for tamper detection

```typescript
import { score, createSnapshot, verifySnapshot } from "@veriterra/scoring-engine";

const result = score(input);
const snapshot = await createSnapshot(
  input,
  result.compositeScore,
  result.dimensions,
  result.verdict,
  "prod-123", // optional product ID
);

// Verify integrity later
const isValid = await verifySnapshot(snapshot);
```

## Data Source Security

Every input field includes a `source` discriminator (`"lab"` | `"manual"` | `"ai-estimated"`). The scoring engine is source-agnostic at runtime, but the snapshot preserves source metadata so consumers can apply their own trust policies. AI-estimated inputs can never overwrite lab/manual data at the database layer.

## Determinism Guarantee

Same inputs → same outputs, always. The scoring functions are pure and stateless. Dimensional weights and methodology version are versioned constants.

## Development

```bash
npm install    # install dependencies
npm test       # run tests
npm run build  # compile TypeScript → dist/
```

## API

### `score(input: ScoringInput): ScoringResult`

Main scoring function. Pure and deterministic.

### `computeDimensionScores(input: ScoringInput): DimensionScores`

Compute individual dimension scores without the composite.

### `computeCompositeScore(dimensions: DimensionScores): number`

Weighted sum of dimension scores (rounded to integer).

### `scoreLabelAccuracy(input): number`, `scorePuritySafety(input): number`, `scoreEvidence(input): number`, `scoreFormulation(input): number`, `scoreValue(input): number`

Individual dimension scoring functions, exported for debugging or partial scoring.

### `scoreToVerdict(compositeScore: number): VerdictLabel`

Map a numeric score to its human-readable verdict.

### `createSnapshot(inputs, compositeScore, dimensions, verdict, productId?): Promise<ScoringSnapshot>`

Create an immutable, auditable scoring record.

### `verifySnapshot(snapshot): Promise<boolean>`

Verify a snapshot hasn't been tampered with.

## License

MIT