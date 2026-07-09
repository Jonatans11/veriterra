import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";
import { Layout } from "./__root";

const getBusinessName = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const cfg = JSON.parse(await readFile("site.json", "utf8")) as {
      businessName?: string;
    };
    return cfg.businessName?.trim() ?? "";
  } catch {
    return "";
  }
});

export const Route = createFileRoute("/")({
  loader: () => getBusinessName(),
  component: Home,
});

function Home() {
  const businessName = Route.useLoaderData();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-verde-50 via-white to-slate-50 dark:from-verde-950 dark:via-slate-950 dark:to-slate-950" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-6 inline-block rounded-full border border-verde-200 bg-verde-50 px-3 py-1 text-xs font-medium text-verde-700 dark:border-verde-800 dark:bg-verde-950 dark:text-verde-300">
              Lab-Tested &bull; Science-Backed &bull; Independent
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {businessName || "Veriterra.AI"}
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 sm:mt-6 sm:text-xl">
              One honest score for every supplement.
            </p>
            <p className="mt-2 max-w-xl mx-auto text-base text-slate-500 dark:text-slate-400">
              We combine{" "}
              <span className="font-medium text-slate-700 dark:text-slate-300">
                objective lab data
              </span>
              ,{" "}
              <span className="font-medium text-slate-700 dark:text-slate-300">
                graded scientific evidence
              </span>
              , and an{" "}
              <span className="font-medium text-slate-700 dark:text-slate-300">
                immutable, transparent methodology
              </span>{" "}
              to give you a single composite score (0–100) — so you know exactly
              what you're paying for.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/catalog"
                className="rounded-lg bg-verde-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-verde-700"
              >
                Browse the Catalog
              </Link>
              <Link
                to="/about"
                className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust markers */}
      <section className="border-b border-slate-200 py-12 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-verde-100 dark:bg-verde-950">
                <svg className="h-6 w-6 text-verde-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Lab-Verified Data</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Every score starts with real lab results — not marketing claims.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0-.029 0 60.438 60.438 0 0-.029 0M12 3v2m0 4v2m0 4v2m0 4v2M3.5 10.5h17" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Graded Evidence</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Scientific claims are rated by study quality and relevance.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Immutable Methodology</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                The scoring engine is firewalled from commercial influence. Versioned, auditable, transparent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-slate-200 py-16 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            How the Score Works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-500 dark:text-slate-400">
            Our five-dimension scoring model gives you a complete picture of every supplement.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Label Accuracy", pct: 25, color: "text-verde-600", desc: "Does the label match reality?" },
              { label: "Purity & Safety", pct: 25, color: "text-blue-600", desc: "Contaminants, allergens, heavy metals" },
              { label: "Evidence", pct: 25, color: "text-purple-600", desc: "Quality and relevance of scientific support" },
              { label: "Formulation", pct: 15, color: "text-amber-600", desc: "Dosage, bioavailability, synergy" },
              { label: "Value", pct: 10, color: "text-rose-600", desc: "Cost per serving vs. benchmark" },
            ].map((dim) => (
              <div
                key={dim.label}
                className="rounded-xl border border-slate-200 p-5 text-center dark:border-slate-800"
              >
                <div className={`text-2xl font-bold ${dim.color}`}>{dim.pct}%</div>
                <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                  {dim.label}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{dim.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/about"
              className="text-sm font-medium text-verde-600 hover:text-verde-700"
            >
              Read the full methodology &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Featured / Stats */}
      <section className="border-b border-slate-200 py-16 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-2xl bg-slate-50 p-8 dark:bg-slate-900 sm:p-12 lg:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-verde-600">0</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Products Scored</div>
              <p className="mt-1 text-xs text-slate-400">Catalog growing daily</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">Methodology v1.0</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Immutable &amp; Auditable</div>
              <p className="mt-1 text-xs text-slate-400">Every score links to its methodology version</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">AI-Estimated</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Always clearly labeled</div>
              <p className="mt-1 text-xs text-slate-400">Never indistinguishable from lab data</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Know What You're Taking
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-500 dark:text-slate-400">
            No more guessing. No more marketing fluff. Just honest, science-backed scores.
          </p>
          <div className="mt-8">
            <Link
              to="/catalog"
              className="rounded-lg bg-verde-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-verde-700"
            >
              Start Exploring
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}