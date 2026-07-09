import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "./__root";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          About Veriterra.AI
        </h1>

        <section className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          <p>
            <strong className="text-slate-900 dark:text-white">Veriterra.AI</strong>{" "}
            exists to give supplement shoppers one honest answer:{" "}
            <em>"Is this supplement actually worth taking?"</em>
          </p>

          <p>
            The dietary supplement industry is a $50B+ market where marketing claims
            often outrun the science. Most review sites are funded by the brands they
            cover. Most ratings are either user-generated (prone to fake reviews) or
            paid endorsements in disguise.
          </p>

          <p>
            We built Veriterra to be different. Our composite score (0–100) is the
            output of a <strong className="text-slate-900 dark:text-white">deterministic, immutable scoring engine</strong>{" "}
            that weighs five dimensions:
          </p>

          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-slate-900 dark:text-white">Label Accuracy (25%)</strong> — Do
              lab results confirm the label claims?
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Purity & Safety (25%)</strong> — Are
              there contaminants, heavy metals, or allergens?
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Evidence (25%)</strong> — What does
              the peer-reviewed science say?
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Formulation (15%)</strong> — Is the
              dosage effective? Bioavailable? Well-synergized?
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Value (10%)</strong> — What's the
              cost per active serving vs. a benchmark?
            </li>
          </ul>

          <p>
            The scoring engine is versioned, auditable, and completely firewalled from
            commercial or community influence. Every published score links to the exact
            methodology version that produced it.
          </p>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            Our Editorial Independence
          </h2>
          <p>
            Veriterra does not accept payments from supplement brands for score placement,
            rating changes, or favorable coverage. Our revenue comes from transparent
            affiliate commissions on "buy" links — but these are always clearly labeled,
            timestamped, and never influence the score. See our{" "}
            <Link
              to="/editorial-independence"
              className="text-verde-600 underline hover:text-verde-700"
            >
              Editorial Independence Policy
            </Link>{" "}
            for details.
          </p>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            AI-Estimated Data
          </h2>
          <p>
            Where lab data is unavailable, our autonomous AI engine may estimate values
            based on publicly available information. These estimates are{" "}
            <strong className="text-amber-600">always clearly labeled</strong> and never
            presented as lab-verified data. The score makes clear what is measured and
            what is estimated.
          </p>
        </section>
      </div>
    </Layout>
  );
}