import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "./__root";

export const Route = createFileRoute("/product/$productId")({
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useParams();

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-xs text-slate-400">
          <Link to="/catalog" className="hover:text-slate-600 dark:hover:text-slate-300">
            Catalog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-600 dark:text-slate-300">{productId}</span>
        </nav>

        {/* Product header */}
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          {/* Score display */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 p-8 dark:border-slate-800">
            <div className="score-ring mb-4">
              <svg className="h-32 w-32" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-slate-200 dark:text-slate-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray={`${0 * 2.83} ${100 * 2.83}`}
                  strokeLinecap="round"
                  className="text-verde-500"
                />
              </svg>
              <span className="score-value text-slate-900 dark:text-white">—</span>
            </div>
            <span className="text-xs text-slate-400">Score — Awaiting lab data</span>
            <span className="mt-1 text-xs text-slate-400">Methodology v1.0</span>
          </div>

          {/* Product info */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {productId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This product has not been scored yet. Our research team is compiling lab data
              and scientific evidence.
            </p>

            {/* Sub-score placeholders */}
            <div className="mt-8 space-y-3">
              {[
                { label: "Label Accuracy", pct: 0, color: "bg-verde-500" },
                { label: "Purity & Safety", pct: 0, color: "bg-blue-500" },
                { label: "Evidence", pct: 0, color: "bg-purple-500" },
                { label: "Formulation", pct: 0, color: "bg-amber-500" },
                { label: "Value", pct: 0, color: "bg-rose-500" },
              ].map((dim) => (
                <div key={dim.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {dim.label}
                    </span>
                    <span className="text-slate-400">—</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={`h-2 rounded-full ${dim.color} opacity-20`}
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lab data section */}
        <section className="mt-12 rounded-xl border border-slate-200 p-6 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Lab Data</h2>
          <div className="mt-2 rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-400 dark:bg-slate-900">
            No lab data available yet. Lab results will appear here once analyzed.
          </div>
        </section>

        {/* Evidence section */}
        <section className="mt-6 rounded-xl border border-slate-200 p-6 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Scientific Evidence
          </h2>
          <div className="mt-2 rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-400 dark:bg-slate-900">
            Evidence analysis coming soon.
          </div>
        </section>
      </div>
    </Layout>
  );
}