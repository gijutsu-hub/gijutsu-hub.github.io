/**
 * Route transition.
 *
 * A template remounts on every navigation (unlike a layout), so this animation
 * replays per route. It is short and small — a page that slides a long way on
 * every click is tiring to use, and the movement is only here to signal that
 * the content changed, which matters more now the shell stays put between
 * routes.
 *
 * Respects prefers-reduced-motion through the global rule in globals.css,
 * which collapses animation durations to near zero.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-[routeIn_380ms_var(--ease-out-expo)_both]">{children}</div>;
}
