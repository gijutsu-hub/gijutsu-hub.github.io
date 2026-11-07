import Link from "next/link";

import { pagedRoutes, routeIndex } from "@/content/routes";

/**
 * The landing page's index of the rest of the site.
 *
 * A multi-page site hides its own scope — you can no longer scroll and see
 * everything. This puts the whole map on the front page so a visitor knows in
 * one screen what is here before deciding where to go.
 */
export default function SiteIndex() {
  return (
    <section className="border-b border-line px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <p className="rule-label mb-5 flex items-center gap-3">
          <span className="inline-block h-px w-8 bg-accent" />
          Contents
        </p>

        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {pagedRoutes.map((route, i) => (
            <Link
              key={route.href}
              href={route.href}
              style={{ animationDelay: `${i * 60}ms` }}
              className="group flex animate-[revealUp_560ms_var(--ease-out-expo)_both] flex-col bg-panel p-6 transition-colors hover:bg-surface lg:p-8"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-xs text-accent">{routeIndex(route.href)}</span>
                <span
                  className="font-mono text-xs text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>

              <h2 className="mt-4 font-display text-xl text-ink transition-colors group-hover:text-accent">
                {route.title}
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-dim text-pretty">
                {route.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
