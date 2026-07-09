import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Veriterra.AI — Honest Supplement Scores, Backed by Lab Data" },
      {
        name: "description",
        content:
          "A single, transparent composite score (0–100) for every dietary supplement. Objective lab data, graded scientific evidence, and an immutable methodology — no marketing influence.",
      },
      {
        name: "keywords",
        content:
          "supplement reviews, lab tested supplements, science backed supplements, supplement scores, Veriterra",
      },
      { property: "og:title", content: "Veriterra.AI — Honest Supplement Scores" },
      {
        property: "og:description",
        content:
          "Get a transparent, deterministic composite score for any dietary supplement. Backed by objective lab data and graded scientific evidence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text y='28' font-size='28'>🌿</text></svg>",
      },
    ],
  }),
  notFoundComponent: () => (
    <Layout>
      <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="max-w-md text-slate-500 dark:text-slate-400">
          This page doesn't exist yet. We're building something — check back soon.
        </p>
        <a
          href="/"
          className="rounded-lg bg-verde-600 px-4 py-2 text-sm font-medium text-white hover:bg-verde-700"
        >
          Go home
        </a>
      </div>
    </Layout>
  ),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/** Shared layout wrapper used by all pages */
function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="text-verde-600">▼</span>
          <span className="text-slate-900 dark:text-white">Veriterra</span>
          <span className="text-verde-500">.AI</span>
        </a>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex dark:text-slate-400">
          <a href="/catalog" className="hover:text-slate-900 dark:hover:text-white">
            Catalog
          </a>
          <a href="/compare" className="hover:text-slate-900 dark:hover:text-white">
            Compare
          </a>
          <a href="/research" className="hover:text-slate-900 dark:hover:text-white">
            Research
          </a>
          <a href="/methodology" className="hover:text-slate-900 dark:hover:text-white">
            Methodology
          </a>
          <a href="/about" className="hover:text-slate-900 dark:hover:text-white">
            About
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="/catalog"
            className="rounded-lg bg-verde-600 px-4 py-2 text-sm font-medium text-white hover:bg-verde-700"
          >
            Browse Products
          </a>
        </div>
      </div>
      {/* Mobile nav */}
      <div className="border-t border-slate-200 px-4 py-2 md:hidden dark:border-slate-800">
        <nav className="flex items-center justify-around text-xs font-medium text-slate-500 dark:text-slate-400">
          <a href="/catalog" className="hover:text-slate-900 dark:hover:text-white">
            Catalog
          </a>
          <a href="/compare" className="hover:text-slate-900 dark:hover:text-white">
            Compare
          </a>
          <a href="/research" className="hover:text-slate-900 dark:hover:text-white">
            Research
          </a>
          <a href="/methodology" className="hover:text-slate-900 dark:hover:text-white">
            Methodology
          </a>
          <a href="/about" className="hover:text-slate-900 dark:hover:text-white">
            About
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              Veriterra.AI
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Honest supplement scores, backed by lab data and graded science.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              Explore
            </h3>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <a href="/catalog" className="hover:text-slate-900 dark:hover:text-white">
                  Product Catalog
                </a>
              </li>
              <li>
                <a href="/compare" className="hover:text-slate-900 dark:hover:text-white">
                  Compare Products
                </a>
              </li>
              <li>
                <a href="/research" className="hover:text-slate-900 dark:hover:text-white">
                  Research Portal
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              Company
            </h3>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <a href="/about" className="hover:text-slate-900 dark:hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a
                  href="/editorial-independence"
                  className="hover:text-slate-900 dark:hover:text-white"
                >
                  Editorial Independence
                </a>
              </li>
              <li>
                <a
                  href="/conflict-of-interest"
                  className="hover:text-slate-900 dark:hover:text-white"
                >
                  Conflict-of-Interest Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              Legal
            </h3>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <a href="/privacy" className="hover:text-slate-900 dark:hover:text-white">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          &copy; {new Date().getFullYear()} Veriterra.AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export { Layout };