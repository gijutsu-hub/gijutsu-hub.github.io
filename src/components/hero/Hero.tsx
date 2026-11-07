"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import SceneBoundary from "@/components/hero/SceneBoundary";
import DownloadButton from "@/components/ui/DownloadButton";
import SceneFallback from "@/components/hero/SceneFallback";
import { site, stats } from "@/content/site";
import { useMediaQuery, useMounted, usePrefersReducedMotion, useWebGL } from "@/lib/hooks";

/**
 * The WebGL bundle is ~500KB. It has no business blocking first paint for a
 * page whose value is the text, so it loads only on the client, after mount.
 */
const NetworkScene = dynamic(() => import("@/components/hero/NetworkScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

function RotatingDiscipline() {
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % site.disciplines.length),
      2800,
    );
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <span className="relative inline-flex min-h-[1.4em] items-center">
      <span key={index} className="animate-[fadeUp_480ms_var(--ease-out-expo)] text-accent">
        {site.disciplines[index]}
      </span>
    </span>
  );
}

export default function Hero() {
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const isNarrow = useMediaQuery("(max-width: 860px)");
  const isCoarse = useMediaQuery("(pointer: coarse)");

  // Don't ship a 3D scene to a phone on a mobile connection at full quality.
  const quality = isNarrow || isCoarse ? "low" : "high";

  // Probed once on the client and cached; false during SSR.
  const webgl = useWebGL();
  const showScene = mounted && webgl;

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden border-b border-line"
    >
      <div className="grid-field pointer-events-none absolute inset-0 opacity-50" />

      {/* The scene sits behind the copy on narrow screens and beside it on wide
          ones. Either way it is decorative and marked aria-hidden. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-[58%]">
        <div className="absolute inset-0 opacity-70 lg:opacity-100">
          {showScene ? (
            <SceneBoundary>
              <NetworkScene animate={!reduced} quality={quality} />
            </SceneBoundary>
          ) : (
            <SceneFallback />
          )}
        </div>
        {/* Fade the scene into the background at its left edge so the headline
            never sits on top of a busy area. */}
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/70 to-transparent lg:via-void/20" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-24 lg:px-10">
        <div className="max-w-2xl">
          <p className="rule-label mb-6 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-accent" />
            {site.location}
          </p>

          <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {site.name}
          </h1>

          <p className="mt-5 font-display text-xl text-ink-dim sm:text-2xl">
            {site.role} <span className="text-ink-faint">/</span> <RotatingDiscipline />
          </p>

          <div className="hairline my-9 max-w-md" />

          <div className="space-y-5 text-pretty">
            {site.intro.map((paragraph, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-lg leading-relaxed text-ink sm:text-xl"
                    : "leading-relaxed text-ink-dim"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#vapt"
              className="group inline-flex items-center gap-2 border border-accent/40 bg-accent/10 px-5 py-2.5 font-mono text-sm text-accent transition-colors hover:bg-accent/20"
            >
              View capability
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <DownloadButton variant="ghost" />
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 border border-line-bright px-5 py-2.5 font-mono text-sm text-ink-dim transition-colors hover:border-accent/40 hover:text-ink"
            >
              GitHub
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 border border-line-bright px-5 py-2.5 font-mono text-sm text-ink-dim transition-colors hover:border-accent/40 hover:text-ink"
            >
              LinkedIn
            </a>
          </div>

          <dl className="mt-14 grid max-w-xl grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="border-l border-line pl-4">
                <dt className="font-display text-2xl text-accent">{stat.value}</dt>
                <dd className="mt-1 font-mono text-[0.6875rem] uppercase leading-snug tracking-wider text-ink-faint">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
