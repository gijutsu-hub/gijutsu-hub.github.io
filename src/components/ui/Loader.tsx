/**
 * Route loading skeleton.
 *
 * Next shows this through Suspense while the next route segment is fetched.
 * On a static export the payload is small and this is often a single frame —
 * which is the point: it should read as the page arriving, not as a spinner
 * demanding attention. So it mirrors the real page's masthead geometry rather
 * than showing an unrelated animation, and the layout does not shift when the
 * content lands.
 */

function Bar({ w, className = "" }: { w: string; className?: string }) {
  return (
    <div
      className={`h-full animate-pulse rounded-sm bg-line-bright/50 ${className}`}
      style={{ width: w }}
    />
  );
}

export default function Loader({ rows = 3 }: { rows?: number }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page</span>

      <header className="border-b border-line px-6 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-36">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6 flex h-3 items-center gap-3">
            <Bar w="1.25rem" className="bg-accent/40" />
            <Bar w="1.5rem" />
            <Bar w="5rem" />
          </div>
          <div className="h-12 lg:h-16">
            <Bar w="min(28rem, 70%)" />
          </div>
          <div className="mt-7 h-4">
            <Bar w="min(36rem, 90%)" />
          </div>
          <div className="mt-3 h-4">
            <Bar w="min(28rem, 70%)" />
          </div>
        </div>
      </header>

      <div className="px-6 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-6xl space-y-10">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-3.5">
                <Bar w="9rem" className="bg-accent/25" />
              </div>
              <div className="h-24 border border-line bg-surface/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
