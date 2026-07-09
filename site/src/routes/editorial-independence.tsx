import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "./__root";

export const Route = createFileRoute("/editorial-independence")({
  component: EditorialPage,
});

function EditorialPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Editorial Independence Policy
        </h1>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          <p>
            <strong className="text-slate-900 dark:text-white">Last updated:</strong>{" "}
            July 2026
          </p>

          <p>
            Veriterra.AI's editorial independence is the foundation of our value
            proposition. This policy explains how we protect the integrity of our
            scoring engine and content from commercial influence.
          </p>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            1. The Score is Sacred
          </h2>
          <p>
            The Veriterra composite score (0–100) is produced by a deterministic,
            immutable scoring engine. No brand, advertiser, affiliate partner, or
            community member can request, pay for, or otherwise influence a score
            change. Scores are determined solely by lab data, scientific evidence,
            and the fixed methodology.
          </p>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            2. Revenue Separation
          </h2>
          <p>
            Veriterra generates revenue through Amazon affiliate commissions on
            "buy" links. These links are provided purely as a reader convenience.
            The following rules govern affiliate revenue:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Affiliate relationships never influence score placement, score values,
              or editorial content.
            </li>
            <li>
              All prices shown are{" "}
              <strong className="text-slate-900 dark:text-white">
                timestamped "as researched" snapshots
              </strong>
              , not live prices.
            </li>
            <li>
              Buy links are clearly labeled and visually distinct from score content.
            </li>
          </ul>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            3. No Paid Placement
          </h2>
          <p>
            We do not accept payments from supplement brands or manufacturers for
            product placement, rating changes, category positioning, or any form of
            favorable treatment. There is no "premium listing" or "sponsored score"
            option.
          </p>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            4. Community vs. Score
          </h2>
          <p>
            Community reviews and user ratings exist for informational context only.
            They never influence the composite score. The score is determined solely
            by lab data and evidence — not popularity.
          </p>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            5. Transparency
          </h2>
          <p>
            Every published score links to the exact methodology version that
            produced it. Lab data, evidence grades, and any AI-estimated values are
            clearly labeled. We publish annual transparency reports detailing our
            revenue sources and confirming no conflicts have arisen.
          </p>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            6. Reporting Concerns
          </h2>
          <p>
            If you believe a score has been improperly influenced, or if you
            suspect a conflict of interest, please contact us at our{" "}
            <Link
              to="/conflict-of-interest"
              className="text-verde-600 underline hover:text-verde-700"
            >
              Conflict-of-Interest page
            </Link>
            .
          </p>
        </div>
      </div>
    </Layout>
  );
}