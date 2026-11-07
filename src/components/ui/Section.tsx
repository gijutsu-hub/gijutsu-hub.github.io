"use client";

import { useRef, type ReactNode } from "react";

import { useInView } from "@/lib/hooks";

interface SectionProps {
  id: string;
  /** Monospace kicker above the heading, e.g. "02 / Red Team". */
  index?: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  children: ReactNode;
  className?: string;
}

export default function Section({
  id,
  index,
  eyebrow,
  title,
  lede,
  children,
  className = "",
}: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);

  return (
    <section
      ref={ref}
      id={id}
      className={`scroll-mt-24 border-b border-line px-6 py-24 lg:px-10 lg:py-32 ${className}`}
    >
      <div className={`mx-auto w-full max-w-6xl ${inView ? "reveal" : "opacity-0"}`}>
        <header className="mb-12 lg:mb-16">
          {(index || eyebrow) && (
            <p className="rule-label mb-5 flex items-center gap-3">
              {index && <span className="text-accent">{index}</span>}
              {index && eyebrow && <span className="inline-block h-px w-6 bg-line-bright" />}
              {eyebrow}
            </p>
          )}
          <h2 className="max-w-3xl text-3xl leading-tight text-balance sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h2>
          {lede && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-dim text-pretty">
              {lede}
            </p>
          )}
          <div className="hairline mt-10" />
        </header>
        {children}
      </div>
    </section>
  );
}
