"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import { hasWebGL } from "@/lib/webgl";

/**
 * Media query as an external store.
 *
 * `useSyncExternalStore` is the right primitive here: matchMedia *is* an
 * external store. The useState/useEffect version works but tears during
 * concurrent rendering and triggers a cascading render on mount.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onStoreChange);
      return () => list.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  // The server cannot know, so it assumes "no" and the client corrects on mount.
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

const noopSubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/** True once hydrated. Used to defer client-only work such as WebGL. */
export function useMounted(): boolean {
  return useSyncExternalStore(noopSubscribe, clientSnapshot, serverSnapshot);
}

/**
 * Reveal-on-scroll. Unobserves after the first intersection — a reveal that
 * replays every time you scroll past is a distraction, not an effect.
 */
export function useInView<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  // Fires as soon as the section's top edge enters the viewport. A symmetric
  // inset margin looks tidier but reveals late enough that a fast scroll can
  // land on a section still at opacity 0.
  rootMargin = "0px 0px -8% 0px",
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // No IntersectionObserver: show everything rather than leaving the page
    // blank. Deferred a frame so this is not a synchronous effect setState.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}

/**
 * WebGL availability, read once and cached.
 *
 * Support cannot change within a page lifetime, so the snapshot is stable and
 * `useSyncExternalStore` never re-subscribes. This keeps the probe out of an
 * effect, which would otherwise cost a second render on every load.
 */
let webglSupport: boolean | null = null;

function getWebGLSnapshot(): boolean {
  webglSupport ??= hasWebGL();
  return webglSupport;
}

export function useWebGL(): boolean {
  return useSyncExternalStore(noopSubscribe, getWebGLSnapshot, serverSnapshot);
}
