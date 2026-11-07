"use client";

import { useState } from "react";

import NetworkGraph from "@/components/charts/NetworkGraph";
import Section from "@/components/ui/Section";
import { topologies } from "@/content/topologies";

/**
 * Gallery of C2 topologies.
 *
 * These are drawn rather than photographed deliberately: engagement
 * screenshots would either be a client's network (which cannot be published)
 * or staged (which is worse than nothing). A diagram of the technique is the
 * honest version, and it stays legible at tile size.
 */

const LEGEND = [
  { label: "Operator", className: "bg-signal" },
  { label: "Relay / edge", className: "bg-indigo" },
  { label: "Compromised host", className: "bg-accent" },
  { label: "Segmented host", className: "bg-ink-faint" },
];

export default function TopologyGallery({ index }: { index: string }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Section
      id="topologies"
      index={index}
      eyebrow="Infrastructure"
      title="Command-and-control topologies"
      lede="The shapes the operations actually use, and what each one leaves in a defender's logs. Drawn, not screenshotted — engagement traffic belongs to the client."
    >
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {LEGEND.map((item) => (
          <span key={item.label} className="flex items-center gap-2">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${item.className}`} />
            <span className="font-mono text-[0.6875rem] text-ink-dim">{item.label}</span>
          </span>
        ))}
      </div>

      <div className="mt-7 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {topologies.map((topology, i) => {
          const expanded = open === topology.id;
          return (
            <article
              key={topology.id}
              style={{ animationDelay: `${i * 70}ms` }}
              className="flex animate-[revealUp_560ms_var(--ease-out-expo)_both] flex-col bg-panel p-5 transition-colors hover:bg-surface lg:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-base leading-snug text-ink">{topology.name}</h3>
                {topology.technique && (
                  <a
                    href={`https://attack.mitre.org/techniques/${topology.technique.id}/`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="shrink-0 border border-line-bright px-1.5 py-0.5 font-mono text-[0.5625rem] text-ink-faint transition-colors hover:border-accent/40 hover:text-accent"
                    title={topology.technique.name}
                  >
                    {topology.technique.id}
                  </a>
                )}
              </div>

              <div className="my-4 aspect-[4/3] w-full">
                <NetworkGraph topology={topology} />
              </div>

              <p className="text-sm leading-relaxed text-ink-dim text-pretty">
                {topology.summary}
              </p>

              <button
                type="button"
                onClick={() => setOpen(expanded ? null : topology.id)}
                aria-expanded={expanded}
                className="mt-4 flex items-center gap-2 self-start font-mono text-[0.6875rem] text-accent transition-colors hover:text-ink"
              >
                <span
                  className={`inline-block transition-transform ${expanded ? "rotate-90" : ""}`}
                  aria-hidden="true"
                >
                  ›
                </span>
                What the defender sees
              </button>

              {expanded && (
                <p className="mt-2.5 animate-[revealUp_320ms_var(--ease-out-expo)_both] border-l-2 border-accent/40 pl-3 text-sm leading-relaxed text-ink-faint text-pretty">
                  {topology.defenderNote}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </Section>
  );
}
