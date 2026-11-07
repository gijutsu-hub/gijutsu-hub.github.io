"use client";

import { useState } from "react";

import Section from "@/components/ui/Section";
import {
  coverageSummary,
  DEPTH_LABEL,
  tactics,
  techniqueUrl,
  type Depth,
  type Technique,
} from "@/content/attack";

/**
 * ATT&CK coverage matrix, in the layout practitioners already read: tactics as
 * columns in kill-chain order, techniques stacked beneath, heat by depth.
 *
 * Deliberately not a generic "skills grid". Anyone in this field can scan an
 * ATT&CK matrix in seconds and spot both the strengths and the gaps, which is
 * the point — a matrix with every cell lit would read as a lie.
 */

const CELL: Record<Depth, string> = {
  3: "border-accent/55 bg-accent/20 text-accent",
  2: "border-accent/25 bg-accent/[0.07] text-accent/80",
  1: "border-line-bright bg-surface text-ink-faint",
  0: "border-line bg-transparent text-ink-faint",
};

function Cell({
  technique,
  onHover,
}: {
  technique: Technique;
  onHover: (t: Technique | null) => void;
}) {
  return (
    <a
      href={techniqueUrl(technique.id)}
      target="_blank"
      rel="noreferrer noopener"
      onMouseEnter={() => onHover(technique)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(technique)}
      onBlur={() => onHover(null)}
      className={`block border px-2 py-1.5 text-left transition-colors ${CELL[technique.depth]} hover:border-accent hover:bg-accent/25`}
      title={`${technique.id} · ${technique.name}${technique.note ? ` — ${technique.note}` : ""}`}
    >
      <span className="block font-mono text-[0.5625rem] leading-none opacity-70">
        {technique.id}
      </span>
      <span className="mt-1 block text-[0.6875rem] leading-tight">{technique.name}</span>
    </a>
  );
}

function Legend() {
  const summary = coverageSummary();

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {([3, 2, 1] as const).map((depth) => (
        <div key={depth} className="flex items-center gap-2">
          <span className={`inline-block h-3 w-3 border ${CELL[depth]}`} />
          <span className="font-mono text-xs text-ink-dim">
            {DEPTH_LABEL[depth]}
            <span className="ml-1.5 text-ink-faint">
              {depth === 3 ? summary.core : depth === 2 ? summary.applied : summary.assessed}
            </span>
          </span>
        </div>
      ))}
      <span className="font-mono text-xs text-ink-faint">
        {summary.techniques} techniques across {summary.tactics} tactics
      </span>
    </div>
  );
}

export default function AttackMatrix({ index }: { index: string }) {
  const [active, setActive] = useState<Technique | null>(null);

  return (
    <Section
      id="attack"
      index={index}
      eyebrow="Coverage"
      title="MITRE ATT&CK coverage"
      lede="Tactics in kill-chain order, techniques beneath, heat by how deeply each is actually operated. The gaps are left visible — a matrix with every cell lit would not be worth reading."
    >
      <Legend />

      {/* Hover readout. Fixed height so the matrix does not jump as it fills. */}
      <div className="mt-6 flex min-h-[3.5rem] items-start border-l-2 border-accent/40 bg-surface/60 px-4 py-3">
        {active ? (
          <p className="text-sm leading-relaxed text-ink-dim">
            <span className="font-mono text-accent">{active.id}</span>{" "}
            <span className="text-ink">{active.name}</span>
            {active.note && <span className="text-ink-faint"> — {active.note}</span>}
          </p>
        ) : (
          <p className="font-mono text-xs text-ink-faint">
            Hover a technique for detail. Each cell links to its ATT&CK entry.
          </p>
        )}
      </div>

      {/* Horizontal scroll rather than wrapping: the kill-chain order left to
          right is the information, and wrapping destroys it. */}
      <div className="mt-6 -mx-6 overflow-x-auto px-6 pb-3 lg:-mx-10 lg:px-10">
        <div className="flex min-w-max gap-2">
          {tactics.map((tactic) => (
            <div key={tactic.id} className="flex w-[9.25rem] shrink-0 flex-col">
              <div className="mb-2 border-b border-line-bright pb-2">
                <p className="font-mono text-[0.5625rem] uppercase tracking-wider text-accent/70">
                  {tactic.id}
                </p>
                <h3 className="mt-1 text-xs leading-tight text-ink">{tactic.name}</h3>
              </div>

              <div className="flex flex-col gap-1.5">
                {tactic.techniques.map((technique) => (
                  <Cell
                    key={`${tactic.id}-${technique.id}`}
                    technique={technique}
                    onHover={setActive}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 font-mono text-xs text-ink-faint">
        Impact techniques are assessed and reported, never executed against a client estate.
      </p>
    </Section>
  );
}
