import Link from "next/link";

import { siblings } from "@/content/routes";

/**
 * Prev/next paging at the foot of each content page.
 *
 * Splitting one scroll into seven pages costs the reader the sense of "what
 * else is here". This gives it back without making them go via the nav.
 */
export default function PageNav({ href }: { href: string }) {
  const { prev, next } = siblings(href);
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Page navigation"
      className="grid gap-px border-t border-line bg-line sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group bg-void px-6 py-8 transition-colors hover:bg-surface lg:px-10"
        >
          <span className="rule-label flex items-center gap-2">
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            Previous
          </span>
          <span className="mt-2 block font-display text-xl text-ink-dim transition-colors group-hover:text-accent">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span className="hidden bg-void sm:block" />
      )}

      {next && (
        <Link
          href={next.href}
          className="group bg-void px-6 py-8 text-right transition-colors hover:bg-surface lg:px-10"
        >
          <span className="rule-label flex items-center justify-end gap-2">
            Next
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
          <span className="mt-2 block font-display text-xl text-ink-dim transition-colors group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
