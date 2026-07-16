import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "./__root";
import { getDiscoveredProducts, runAiEngineCycle } from "~/lib/research";

export const Route = createFileRoute("/research")({
  loader: async () => {
    const [products, aiResults] = await Promise.all([
      getDiscoveredProducts(),
      runAiEngineCycle(),
    ]);
    return { products, aiResults };
  },
  component: ResearchPage,
});

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-verde-100 text-verde-700 dark:bg-verde-950 dark:text-verde-300"
      : score >= 60
        ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
        : score >= 40
          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
          : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300";

  return (
    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${color}`}>
      {score}
    </span>
  );
}

function ResearchPage() {
  const { products, aiResults } = Route.useLoaderData();

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="mb-2 inline-block rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300">
            AI Research Portal
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Shared Knowledge Base
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Our autonomous AI engine researches products and ingredients. Results are
            clearly flagged as <strong>AI-estimated</strong> — never confused with lab data.
          </p>
        </div>

        {/* Stats bar */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-950">
            <div className="text-2xl font-bold text-purple-600">{products.length}</div>
            <div className="text-xs text-slate-500">Products Discovered</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-950">
            <div className="text-2xl font-bold text-purple-600">{aiResults.length}</div>
            <div className="text-xs text-slate-500">AI Scored</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-950">
            <div className="text-2xl font-bold text-purple-600">AI-Estimate</div>
            <div className="text-xs text-slate-500">Data Source</div>
          </div>
        </div>

        {/* AI Scored Products */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            AI-Estimated Scores
          </h2>
          {aiResults.length > 0 ? (
            <div className="space-y-3">
              {aiResults.map((result) => (
                <Link
                  key={result.productId}
                  to="/product/$productId"
                  params={{ productId: result.productId }}
                  className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-purple-300 hover:bg-purple-50/50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-purple-700 dark:hover:bg-purple-950/30"
                >
                  <ScoreBadge score={result.compositeScore} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {result.productName}
                    </div>
                    <div className="text-xs text-slate-400">{result.brand}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {result.verdict}
                    </div>
                    <div className="text-xs text-slate-400">
                      Label: {result.dimensions.labelAccuracy} | Purity: {result.dimensions.puritySafety}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
              <p className="text-sm text-slate-400">
                Run the AI engine to discover and score products.
              </p>
            </div>
          )}
        </section>

        {/* Discovered Products list */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Discovered Products
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {products.map((product) => {
              const scored = aiResults.find((r) => r.productId === product.id);
              return (
                <Link
                  key={product.id}
                  to="/product/$productId"
                  params={{ productId: product.id }}
                  className="rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-purple-300 hover:bg-purple-50/50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-purple-700 dark:hover:bg-purple-950/30"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                      {product.name}
                    </h3>
                    {scored && <ScoreBadge score={scored.compositeScore} />}
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{product.brand}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                    {product.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {product.category}
                    </span>
                    <span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs text-purple-600 dark:bg-purple-950 dark:text-purple-300">
                      AI-estimated
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* API endpoint info */}
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            AI Engine API
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Trigger the AI engine programmatically via the API endpoint.
          </p>
          <code className="mt-2 block rounded bg-slate-100 p-2 text-xs font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            GET /api/ai-engine
          </code>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Returns JSON with all discovered products, their AI-estimated scores, and a
            disclaimer that these are estimates, not lab data.
          </p>
        </section>

        {/* Top 1000 library */}
        <section className="mt-8 rounded-xl border border-slate-200 p-6 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Top 1000 Substances Library
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A comprehensive library of the most common supplement ingredients, pre-researched
            and indexed. The AI engine uses this to estimate evidence grades and safety profiles.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Vitamin D3", evidence: "A", safety: "A" },
              { name: "Omega-3 (EPA/DHA)", evidence: "A", safety: "A" },
              { name: "Magnesium Glycinate", evidence: "B", safety: "A" },
              { name: "Ashwagandha", evidence: "C", safety: "B" },
              { name: "Probiotics", evidence: "B", safety: "A" },
              { name: "CoQ10", evidence: "B", safety: "A" },
              { name: "Curcumin", evidence: "B", safety: "A" },
              { name: "Collagen Peptides", evidence: "B", safety: "A" },
            ].map((item) => (
              <div
                key={item.name}
                className="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
              >
                <div className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</div>
                <div className="mt-1 flex gap-2 text-xs text-slate-400">
                  <span>Evidence: {item.evidence}</span>
                  <span>Safety: {item.safety}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}