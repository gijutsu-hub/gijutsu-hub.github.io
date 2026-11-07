"use client";

import { useEffect, useState } from "react";

import { useReveal } from "@/components/charts/useReveal";

/**
 * Counts to a value when scrolled into view.
 *
 * `suffix` carries things like "+" so the number itself stays numeric and the
 * tabular figures keep the digits from shifting width mid-count — a counter
 * that jitters is worse than no counter.
 */
export default function CountUp({
  to,
  suffix = "",
  duration = 900,
  className = "",
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const { ref, shown } = useReveal<HTMLSpanElement>();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!shown) return;

    let raf = 0;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // Jump straight to the value, deferred a frame so this is not a
      // synchronous setState inside the effect body.
      raf = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(raf);
    }

    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // Ease-out cubic: fast first, settling at the end.
      setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shown, to, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value}
      {suffix}
    </span>
  );
}
