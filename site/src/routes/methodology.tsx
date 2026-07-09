import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "./__root";

export const Route = createFileRoute("/methodology")({
  component: MethodologyPage,
});

const dimensions = [
  {
    name: "Label Accuracy",
    weight: 25,
    icon: "📋",
    color: "text-verde-600",
    bgColor: "bg-verde-50 dark:bg-verde-950/50",
    borderColor: "border-verde-200 dark:border-verde-800",
    description:
      "How closely the lab-measured potency matches the label claim. Under-dosing is penalised severely — if a product delivers ≤50% of its claimed dose, the score drops to zero. A 10% over-delivery tolerance is allowed before gentle penalties apply.",
    formula: [
      "If measured ≥ 100% of claim: score = max(100 − (excess − 10) × 0.5, 50)",
      "If measured < 100% of claim: score = ((measured% − 50) / 50) × 100",
      "If measured ≤ 50% of claim: score = 0",
    ],
  },
  {
    name: "Purity & Safety",
    weight: 25,
    icon: "🛡️",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    borderColor: "border-blue-200 dark:border-blue-800",
    description:
      "Heavy-metal contamination (lead, arsenic, cadmium, mercury) measured against safety limits. The worst contaminant drives the overall score — one bad reading pulls down the entire dimension. Third-party certification adds a 10-point bonus.",
    formula: [
      "Per contaminant: if amount ≤ limit → 100; if amount ≥ 3× limit → 0; else linear decline",
      "Dimension score = min(contaminant scores) + (third-party tested ? 10 : 0)",
      "Capped at 100. No data → neutral 50.",
    ],
  },
  {
    name: "Evidence",
    weight: 25,
    icon: "🔬",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/50",
    borderColor: "border-purple-200 dark:border-purple-800",
    description:
      "Each marketed claim is graded by the quality and relevance of its scientific support. The overall score is the average across all claims. If there are no claims to evaluate, the score defaults to zero.",
    formula: [
      "A = 100 (Multiple high-quality RCTs or meta-analyses)",
      "B = 75 (At least one well-designed RCT)",
      "C = 50 (Observational or mechanistic evidence only)",
      "D = 25 (Traditional use, anecdotes, or no evidence)",
      "Score = average of all claim grades. No claims → 0.",
    ],
  },
  {
    name: "Formulation",
    weight: 15,
    icon: "⚗️",
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
    borderColor: "border-amber-200 dark:border-amber-800",
    description:
      "Evaluates the quality of the formulation: whether the dose matches clinical recommendations, whether the ingredient uses a bioavailable form, and whether the product carries third-party certification.",
    formula: [
      "Score = (doseAdequacy × 0.50) + (bioavailability × 0.30) + (certified × 0.20)",
      "Each sub-score is 0–1, scaled to 0–100.",
    ],
  },
  {
    name: "Value",
    weight: 10,
    icon: "💰",
    color: "text-rose-600",
    bgColor: "bg-rose-50 dark:bg-rose-950/50",
    borderColor: "border-rose-200 dark:border-rose-800",
    description:
      "Cost per clinically effective dose compared to the category average. A product at or below the benchmark gets full marks. Prices rise linearly above the benchmark to a maximum 3× multiplier.",
    formula: [
      "If cost ≤ benchmark → 100",
      "If cost ≥ 3× benchmark → 0",
      "Else: score = 100 − (cost/benchmark − 1) × 50",
      "No benchmark available → neutral 50.",
    ],
  },
];

const verdicts = [
  { range: "80–100", label: "Worth taking", color: "text-verde-600", bgColor: "bg-verde-100 dark:bg-verde-950", desc: "Strong scientific backing, accurate labeling, clean safety profile, well-formulated, and fairly priced." },
  { range: "60–79", label: "Solid choice", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-950", desc: "Generally reliable with good evidence and formulation. Minor concerns in one or two areas." },
  { range: "40–59", label: "Mixed", color: "text-amber-600", bgColor: "bg-amber-100 dark:bg-amber-950", desc: "Some positive attributes but meaningful drawbacks in evidence, purity, or formulation." },
  { range: "0–39", label: "Skip it", color: "text-rose-600", bgColor: "bg-rose-100 dark:bg-rose-950", desc: "Significant concerns. Low evidence, potential contamination, poor formulation, or poor value." },
];

function MethodologyPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Scoring Methodology v1.0
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Every score on Veriterra.AI is computed by a deterministic, immutable engine.
            The methodology is versioned, open-source, and auditable. What you see below is
            the exact math running in production — derived from the source code.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-verde-200 bg-verde-50 px-3 py-1 text-xs font-medium text-verde-700 dark:border-verde-800 dark:bg-verde-950 dark:text-verde-300">
              Methodology v1.0.0
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              Immutable &amp; Auditable
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              Deterministic
            </span>
          </div>
        </div>

        {/* Composite score formula */}
        <section className="mb-12 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Composite Score
          </h2>
          <div className="mt-4 rounded-lg bg-slate-50 p-4 font-mono text-sm dark:bg-slate-900">
            <span className="text-slate-500 dark:text-slate-400">compositeScore =</span>
            <br />
            <span className="ml-4">
              labelAccuracy × <strong className="text-verde-600">0.25</strong> +
            </span>
            <br />
            <span className="ml-4">
              puritySafety × <strong className="text-blue-600">0.25</strong> +
            </span>
            <br />
            <span className="ml-4">
              evidence × <strong className="text-purple-600">0.25</strong> +
            </span>
            <br />
            <span className="ml-4">
              formulation × <strong className="text-amber-600">0.15</strong> +
            </span>
            <br />
            <span className="ml-4">
              value × <strong className="text-rose-600">0.10</strong>
            </span>
            <br />
            <span className="text-slate-500 dark:text-slate-400">
              Result: rounded to nearest integer, 0–100
            </span>
          </div>
        </section>

        {/* Verdict mapping */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
            Verdict Mapping
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {verdicts.map((v) => (
              <div
                key={v.label}
                className={`rounded-xl border border-slate-200 p-4 dark:border-slate-800 ${v.bgColor}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-bold ${v.color}`}>{v.label}</span>
                  <span className="text-xs text-slate-400">{v.range}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Dimension deep dives */}
        <section>
          <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
            Dimension Details
          </h2>
          <div className="space-y-6">
            {dimensions.map((dim) => (
              <div
                key={dim.name}
                className={`rounded-xl border p-6 ${dim.borderColor} ${dim.bgColor}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{dim.icon}</span>
                  <div>
                    <h3 className={`text-lg font-bold ${dim.color}`}>{dim.name}</h3>
                    <span className="text-xs text-slate-400">Weight: {dim.weight}%</span>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {dim.description}
                </p>
                <div className="mt-4 space-y-1">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Formula:
                  </span>
                  {dim.formula.map((f, i) => (
                    <p key={`f-${i}`} className="font-mono text-xs text-slate-600 dark:text-slate-300">
                      {f}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data sources & immutability */}
        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Data Sources &amp; Security
          </h2>
          <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <p>
              Every input to the scoring engine carries a <strong>source</strong> discriminator:
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">lab</code>,
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">manual</code>, or
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">ai-estimated</code>.
              The scoring engine itself is source-agnostic — it computes the same score regardless — but
              the snapshot preserves the source metadata so consumers can apply their own trust policies.
            </p>
            <p>
              <strong>AI-estimated data</strong> can never overwrite lab or manual data at the database layer.
              Community reviews are completely firewalled from the scoring engine.
            </p>
            <p>
              Each score is captured as an <strong>immutable snapshot</strong> with a SHA-256 audit hash.
              Anyone can verify that a snapshot hasn't been tampered with by re-computing the hash
              from the stored inputs, outputs, and methodology version.
            </p>
            <p>
              <Link
                to={`https://github.com/Jonatans11/veriterra/tree/main/scoring-engine`}
                target="_blank"
                className="font-medium text-verde-600 hover:text-verde-700"
              >
                View the source code on GitHub &rarr;
              </Link>
            </p>
          </div>
        </section>

        {/* Footer note */}
        <div className="mt-10 text-center text-xs text-slate-400">
          <p>
            Methodology v1.0.0 &bull; Published on first use &bull; Next update: methodology review before v2.0
          </p>
        </div>
      </div>
    </Layout>
  );
}
