"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fires once when the element enters the viewport, so charts draw themselves
 * as you reach them rather than animating off-screen where nobody sees it.
 *
 * Returns `shown` immediately for reduced-motion users: the data is the point,
 * the animation is not, so it is skipped rather than merely shortened.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.15 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, shown };
}
