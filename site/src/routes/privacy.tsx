import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "./__root";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Privacy Policy
        </h1>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          <p>
            <strong className="text-slate-900 dark:text-white">Last updated:</strong>{" "}
            July 2026
          </p>

          <p>
            Veriterra.AI ("we," "our," or "us") respects your privacy. This policy
            explains how we collect, use, and protect your personal information.
          </p>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            Information We Collect
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-slate-900 dark:text-white">
                Usage data:
              </strong>{" "}
              Pages visited, products viewed, search queries, and referral sources.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">
                Device data:
              </strong>{" "}
              Browser type, operating system, and IP address (anonymized).
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">
                Account data:
              </strong>{" "}
              Email address and username if you create an account or subscribe.
            </li>
          </ul>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            How We Use Your Information
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>To provide and improve our supplement scoring and research services.</li>
            <li>To personalize your product discovery experience.</li>
            <li>To send occasional updates (only with your consent).</li>
            <li>To analyze usage patterns and improve our platform.</li>
          </ul>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            Data Sharing
          </h2>
          <p>
            We do not sell your personal information to third parties. We may share
            anonymized, aggregated data for research or analytical purposes. If we
            use third-party services (such as analytics or hosting), they are bound
            by data processing agreements.
          </p>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            Cookies
          </h2>
          <p>
            We use minimal cookies necessary for site functionality and analytics.
            You can control cookie preferences through your browser settings.
          </p>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            Your Rights
          </h2>
          <p>
            Depending on your jurisdiction, you may have the right to access,
            correct, delete, or export your personal data. To exercise these
            rights, please contact us.
          </p>

          <h2 className="pt-4 text-xl font-bold text-slate-900 dark:text-white">
            Contact
          </h2>
          <p>
            For privacy-related inquiries, please reach out through our{" "}
            <Link
              to="/about"
              className="text-verde-600 underline hover:text-verde-700"
            >
              About page
            </Link>
            .
          </p>
        </div>
      </div>
    </Layout>
  );
}