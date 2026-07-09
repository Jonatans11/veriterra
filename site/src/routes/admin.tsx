import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "./__root";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-2 inline-block rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300">
          Admin Console
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Administration
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Manage catalog entries, lab data, evidence grades, affiliate partnerships,
          and platform configuration.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Product Catalog", desc: "Add, edit, remove products", icon: "📦" },
            { title: "Lab Data", desc: "Upload and verify lab results", icon: "🔬" },
            { title: "Evidence", desc: "Grade scientific studies", icon: "📊" },
            { title: "Scores", desc: "Review score snapshots", icon: "🏆" },
            { title: "Affiliates", desc: "Manage affiliate partners", icon: "🤝" },
            { title: "Users", desc: "Manage user accounts", icon: "👤" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 p-5 transition-colors hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
            >
              <span className="text-2xl">{item.icon}</span>
              <h3 className="mt-2 font-semibold text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Admin console panels are under development. Authentication and role-based
            access will be required for all admin features.
          </p>
        </div>

        {/* Quick stats */}
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Quick Stats
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <div className="text-2xl font-bold text-slate-400">0</div>
              <div className="text-xs text-slate-500">Products in Catalog</div>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <div className="text-2xl font-bold text-slate-400">0</div>
              <div className="text-xs text-slate-500">Scores Published</div>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <div className="text-2xl font-bold text-slate-400">0</div>
              <div className="text-xs text-slate-500">Active Users</div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}