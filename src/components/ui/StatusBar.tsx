"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Operator-console status strip.
 *
 * EVERY FIGURE HERE IS MEASURED. None are decorative placeholders, and that is
 * the whole point of putting it on this particular site: a security engineer's
 * page showing invented telemetry is a claim anyone can open devtools and
 * disprove in ten seconds. So:
 *
 *   RTT     a real HEAD request to a static asset on this origin, timed.
 *   LOAD    Navigation Timing: responseEnd - startTime for this document.
 *   FPS     sampled over a one-second window with requestAnimationFrame.
 *   VIEW    the actual viewport.
 *   GL      whether this browser gave us a WebGL context.
 *   BUILD   the commit this bundle was built from, inlined at build time.
 *
 * It collapses to a single chip on small screens and hides entirely for
 * reduced-motion users, since the live sampling is the part that would annoy
 * them.
 */

const SHA = process.env.NEXT_PUBLIC_BUILD_SHA ?? "unknown";

function useFps(active: boolean) {
  const [fps, setFps] = useState<number | null>(null);
  const frames = useRef(0);

  useEffect(() => {
    if (!active) return;

    let raf = 0;
    let mounted = true;
    let windowStart = performance.now();

    const tick = (now: number) => {
      frames.current += 1;
      if (now - windowStart >= 1000) {
        if (mounted) setFps(Math.round((frames.current * 1000) / (now - windowStart)));
        frames.current = 0;
        windowStart = now;
      }
      raf = requestAnimationFrame(tick);
    };

    // Stop sampling when the tab is hidden; a background rAF loop is wasted
    // battery and the browser throttles it to nonsense numbers anyway.
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (document.visibilityState === "visible") {
        windowStart = performance.now();
        frames.current = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active]);

  return fps;
}

export default function StatusBar() {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const isNarrow = useMediaQuery("(max-width: 900px)");

  const [rtt, setRtt] = useState<number | null>(null);
  const [load, setLoad] = useState<number | null>(null);
  const [view, setView] = useState<string>("");
  const [gl, setGl] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);

  const fps = useFps(!reduced);

  /**
   * Round-trip time, measured by actually timing a HEAD request to a static
   * asset on this origin — not read from a connection hint, and not invented.
   *
   * Re-runs on navigation so the figure describes the page you are on, and
   * every 15s after that. The writes happen inside timer callbacks rather
   * than the effect body, which is both what the lint rule wants and the
   * honest description of when the value actually arrives.
   */
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const start = performance.now();
      try {
        await fetch(`/og.png?rtt=${Date.now()}`, { method: "HEAD", cache: "no-store" });
        if (!cancelled) setRtt(Math.round(performance.now() - start));
      } catch {
        if (!cancelled) setRtt(null);
      }
    };

    const first = window.setTimeout(run, 0);
    const id = window.setInterval(run, 15_000);

    return () => {
      cancelled = true;
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [pathname]);

  useEffect(() => {
    const onResize = () => setView(`${window.innerWidth}×${window.innerHeight}`);
    window.addEventListener("resize", onResize, { passive: true });

    // The one-off reads are deferred a frame so none of them is a synchronous
    // setState inside the effect body, which would cascade a second render
    // before paint for values that are not needed that early.
    const raf = requestAnimationFrame(() => {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      if (nav) setLoad(Math.round(nav.responseEnd - nav.startTime));

      onResize();

      try {
        const c = document.createElement("canvas");
        setGl(Boolean(c.getContext("webgl2") ?? c.getContext("webgl")));
      } catch {
        setGl(false);
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (reduced) return null;

  const cells: Array<{ k: string; v: string; tone?: "good" | "warn" }> = [
    {
      k: "rtt",
      v: rtt === null ? "—" : `${rtt}ms`,
      tone: rtt === null ? undefined : rtt < 120 ? "good" : "warn",
    },
    { k: "load", v: load === null ? "—" : `${load}ms` },
    {
      k: "fps",
      v: fps === null ? "—" : String(fps),
      tone: fps === null ? undefined : fps >= 50 ? "good" : "warn",
    },
    { k: "view", v: view || "—" },
    { k: "gl", v: gl === null ? "—" : gl ? "ok" : "off", tone: gl ? "good" : "warn" },
    { k: "build", v: SHA },
  ];

  if (isNarrow && !open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Show live telemetry"
        className="fixed bottom-3 right-3 z-30 flex items-center gap-1.5 border border-line bg-void/90 px-2.5 py-1.5 font-mono text-[0.625rem] text-ink-faint backdrop-blur-sm"
      >
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
        {rtt === null ? "—" : `${rtt}ms`}
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-3 right-3 z-30 flex items-center gap-px border border-line bg-void/90 backdrop-blur-sm"
      role="status"
      aria-live="off"
      aria-label="Live client telemetry"
    >
      <span className="flex items-center gap-1.5 px-2.5 py-1.5">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
        <span className="font-mono text-[0.5625rem] uppercase tracking-wider text-ink-faint">
          live
        </span>
      </span>

      {cells.map((cell) => (
        <span
          key={cell.k}
          className="flex items-baseline gap-1.5 border-l border-line px-2.5 py-1.5 font-mono text-[0.625rem]"
        >
          <span className="text-ink-faint">{cell.k}</span>
          <span
            className={
              cell.tone === "good"
                ? "text-accent"
                : cell.tone === "warn"
                  ? "text-signal"
                  : "text-ink-dim"
            }
          >
            {cell.v}
          </span>
        </span>
      ))}

      {isNarrow && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Hide telemetry"
          className="border-l border-line px-2 py-1.5 font-mono text-[0.625rem] text-ink-faint"
        >
          ×
        </button>
      )}
    </div>
  );
}
