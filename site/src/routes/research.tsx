import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "./__root";

export const Route = createFileRoute("/research")({
  component: ResearchPage,
});

function ResearchPage() {
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
            Our autonomous AI engine researches products and ingredients. The first search
            triggers live research; everyone after reads the finished report.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="search"
              placeholder="Search product, ingredient, or brand..."
              className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder-slate-500"
              disabled
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            AI research engine coming soon. First search triggers live web research.
          </p>
        </div>

        {/* Recent research */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Research Reports
          </h2>
          <div className="mt-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm dark:bg-purple-950">
                  📄
                </div>
                <div className="flex-1">
                  <div className="h-4 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="mt-1 h-3 w-32 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                </div>
                <span className="text-xs text-slate-400">—</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">
            Research reports will appear here once the AI engine is active.
          </p>
        </section>

        {/* Top 1000 library */}
        <section className="mt-12 rounded-xl border border-slate-200 p-6 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Top 1000 Substances Library
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A comprehensive library of the most common supplement ingredients, pre-researched
            and indexed. Coming soon.
          </p>
        </section>
      </div>
    </Layout>
  );
}