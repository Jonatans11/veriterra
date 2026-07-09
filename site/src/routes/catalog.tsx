import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "./__root";

export const Route = createFileRoute("/catalog")({
  component: CatalogPage,
});

const categories = [
  { name: "Vitamins & Minerals", slug: "vitamins-minerals", count: 0 },
  { name: "Protein & Amino Acids", slug: "protein-amino-acids", count: 0 },
  { name: "Omega-3s & Fatty Acids", slug: "omega-3s", count: 0 },
  { name: "Probiotics & Digestive", slug: "probiotics", count: 0 },
  { name: "Herbal & Botanicals", slug: "herbal", count: 0 },
  { name: "Sports Nutrition", slug: "sports-nutrition", count: 0 },
  { name: "Sleep & Mood", slug: "sleep-mood", count: 0 },
  { name: "Joint & Bone Health", slug: "joint-bone", count: 0 },
];

function CatalogPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Product Catalog
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Browse supplements by category. Every product includes a Veriterra composite score
            backed by lab data and graded evidence.
          </p>
        </div>

        {/* Search bar placeholder */}
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
              placeholder="Search products, brands, or ingredients..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-verde-500 focus:outline-none focus:ring-1 focus:ring-verde-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder-slate-500"
              disabled
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">Search coming soon</p>
        </div>

        {/* Categories grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to="/catalog"
              className="rounded-xl border border-slate-200 p-5 transition-colors hover:border-verde-300 hover:bg-verde-50/50 dark:border-slate-800 dark:hover:border-verde-700 dark:hover:bg-verde-950/30"
            >
              <h3 className="font-semibold text-slate-900 dark:text-white">{cat.name}</h3>
              <p className="mt-1 text-xs text-slate-400">
                {cat.count} product{cat.count !== 1 ? "s" : ""}
              </p>
            </Link>
          ))}
        </div>

        {/* Placeholder product cards */}
        <div className="mt-16">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recently Scored
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Products are being scored. Check back soon for the first reviews.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700"
              >
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-slate-800">
                  🔬
                </div>
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200 mx-auto dark:bg-slate-700" />
                <div className="mt-2 h-3 w-32 animate-pulse rounded bg-slate-100 mx-auto dark:bg-slate-800" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}