import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "./__root";

export const Route = createFileRoute("/affiliates")({
  component: AffiliatesPage,
});

function AffiliatesPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-2 inline-block rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
          Affiliate Portal
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Partner With Us
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Help shoppers find honest supplement scores and earn commissions through
          transparent affiliate partnerships.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* How it works */}
          <section className="rounded-xl border border-slate-200 p-6 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              How It Works
            </h2>
            <ol className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-verde-100 text-xs font-bold text-verde-700 dark:bg-verde-950 dark:text-verde-300">
                  1
                </span>
                <span>Apply for the affiliate program below.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-verde-100 text-xs font-bold text-verde-700 dark:bg-verde-950 dark:text-verde-300">
                  2
                </span>
                <span>
                  Receive your unique affiliate links for our catalog and research
                  portal.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-verde-100 text-xs font-bold text-verde-700 dark:bg-verde-950 dark:text-verde-300">
                  3
                </span>
                <span>
                  Share Veriterra with your audience. Earn commissions on
                  referred purchases via Amazon affiliate links.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-verde-100 text-xs font-bold text-verde-700 dark:bg-verde-950 dark:text-verde-300">
                  4
                </span>
                <span>
                  Track performance through the affiliate dashboard (coming soon).
                </span>
              </li>
            </ol>
          </section>

          {/* Tiers */}
          <section className="rounded-xl border border-slate-200 p-6 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Affiliate Tiers
            </h2>
            <div className="mt-4 space-y-3">
              {[
                { tier: "Standard", commission: "5%", req: "Open to all" },
                { tier: "Premium", commission: "8%", req: "5,000+ monthly referrals" },
                { tier: "Partner", commission: "12%", req: "50,000+ monthly referrals" },
              ].map((t) => (
                <div
                  key={t.tier}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {t.tier}
                    </div>
                    <div className="text-xs text-slate-400">{t.req}</div>
                  </div>
                  <div className="text-sm font-bold text-verde-600">{t.commission}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Application */}
        <section className="mt-10 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Apply Now
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            The affiliate application form is coming soon. Sign up to be notified
            when enrollment opens.
          </p>
          <div className="mt-6">
            <input
              type="email"
              placeholder="your@email.com"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-verde-500 focus:outline-none focus:ring-1 focus:ring-verde-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder-slate-500"
              disabled
            />
            <button
              className="ml-2 rounded-lg bg-verde-600 px-4 py-2.5 text-sm font-medium text-white opacity-50"
              disabled
            >
              Notify Me
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">Form coming soon</p>
        </section>
      </div>
    </Layout>
  );
}