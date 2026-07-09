import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "./__root";

export const Route = createFileRoute("/compare")({
  component: ComparePage,
});

function ComparePage() {
  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Compare Products
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Put supplements side by side. See how their composite scores, sub-scores, and
            lab data stack up.
          </p>
        </div>

        {/* Product selector */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((slot) => (
            <div
              key={slot}
              className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-6 dark:border-slate-700"
            >
              <span className="text-3xl">+</span>
              <p className="mt-2 text-sm font-medium text-slate-400">
                Add product {slot}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Search and select products to compare. The comparison table will display scores,
            lab results, evidence grades, and pricing side by side.
          </p>
          <Link
            to="/catalog"
            className="mt-4 inline-block text-sm font-medium text-verde-600 hover:text-verde-700"
          >
            Browse catalog &rarr;
          </Link>
        </div>

        {/* Comparison table placeholder */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">Metric</th>
                {[1, 2, 3].map((i) => (
                  <th key={i} className="px-4 py-3 font-semibold text-slate-400">
                    Product {i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                "Composite Score",
                "Label Accuracy",
                "Purity & Safety",
                "Evidence",
                "Formulation",
                "Value",
              ].map((metric) => (
                <tr key={metric}>
                  <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">{metric}</td>
                  {[1, 2, 3].map((i) => (
                    <td key={i} className="px-4 py-3 text-slate-400">
                      —
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}