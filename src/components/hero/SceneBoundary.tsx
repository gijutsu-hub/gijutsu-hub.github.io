"use client";

import { Component, type ReactNode } from "react";

import SceneFallback from "@/components/hero/SceneFallback";

/**
 * WebGL is not guaranteed.
 *
 * It is disabled outright by hardened browser profiles and privacy extensions
 * (it is a strong fingerprinting vector), unavailable on blocklisted GPUs and
 * some virtualised environments, and context creation can fail at runtime when
 * the system is out of GPU memory. The audience for this site is more likely
 * than most to have turned it off deliberately.
 *
 * In every one of those cases the page must degrade to the static fallback
 * rather than render a dead canvas or crash the tree.
 */
export default class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[hero] WebGL scene failed, using static fallback:", error.message);
    }
  }

  render() {
    if (this.state.failed) return <SceneFallback />;
    return this.props.children;
  }
}
