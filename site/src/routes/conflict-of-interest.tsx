import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "./__root";

export const Route = createFileRoute("/conflict-of-interest")({
  component: ConflictPage,
});

function ConflictPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Conflict-of-Interest Policy
        </h1>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          <p>
            <strong className="text-slate-900 dark:text-white">Last updated:</strong>{" "}
            July 2026
          </p>

          <p>
            Veriterra.AI is committed to maintaining the highest standards of
            objectivity and transparency. This policy governs how we identify,
            disclose, and manage potential conflicts of interest.
          </p>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            1. What Constitutes a Conflict
          </h2>
          <p>
            A conflict of interest arises when a Veriterra team member, contributor,
            or affiliate has a financial, professional, or personal relationship
            that could reasonably be seen to compromise the objectivity of our
            scoring or editorial content.
          </p>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            2. Prohibited Arrangements
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Veriterra team members may not hold financial positions (stock,
              options, equity) in any supplement brand or manufacturer featured on
              the platform.
            </li>
            <li>
              No team member may accept compensation, gifts, or favors from
              supplement brands.
            </li>
            <li>
              No brand may purchase or influence a score, rating, or review.
            </li>
          </ul>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            3. Disclosure
          </h2>
          <p>
            Any potential conflict of interest involving a team member, contributor,
            or the company itself must be disclosed publicly. Affiliate commissions
            are disclosed on buy links. Any sponsored content would be clearly
            labeled as such.
          </p>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            4. Reporting
          </h2>
          <p>
            If you believe a conflict of interest exists that has not been properly
            disclosed, please email us. All reports will be investigated promptly
            and transparently.
          </p>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            5. Enforcement
          </h2>
          <p>
            Violations of this policy by team members may result in immediate
            removal from the scoring team. Violations by affiliates may result in
            termination of the affiliate relationship.
          </p>
        </div>
      </div>
    </Layout>
  );
}