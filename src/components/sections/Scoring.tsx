"use client";

import { useState } from "react";

import Section from "@/components/ui/Section";
import {
  examples,
  METRICS,
  parseVector,
  SEVERITY_BANDS,
  type Severity,
} from "@/content/cvss";

/**
 * How findings are scored, shown by working an example rather than asserting
 * "CVSS 3.1" on a skills list.
 *
 * The examples are vulnerability classes, not engagement findings. Publishing
 * a real one, even anonymised, is how a consultancy loses a client.
 */

const SEVERITY_COLOR: Record<Severity, { text: string; bg: string; border: string; bar: string }> = {
  Critical: { text: "text-signal", bg: "bg-signal/10", border: "border-signal/45", bar: "bg-signal" },
  High: { text: "text-signal/85", bg: "bg-signal/[0.07]", border: "border-signal/30", bar: "bg-signal/75" },
  Medium: { text: "text-accent", bg: "bg-accent/10", border: "border-accent/35", bar: "bg-accent" },
  Low: { text: "text-ink-dim", bg: "bg-surface", border: "border-line-bright", bar: "bg-ink-faint" },
};

function ScoreGauge({ score, severity }: { score: number; severity: Severity }) {
  const colors = SEVERITY_COLOR[severity];
  const pct = (score / 10) * 100;

  return (
    <div className="flex items-center gap-4">
      <div className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center border ${colors.border} ${colors.bg}`}>
        <span className={`font-display text-xl leading-none ${colors.text}`}>
          {score.toFixed(1)}
        </span>
        <span className="mt-0.5 font-mono text-[0.5rem] uppercase tracking-wider text-ink-faint">
          CVSS
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between">
          <span className={`font-mono text-xs uppercase tracking-wider ${colors.text}`}>
            {severity}
          </span>
          <span className="font-mono text-[0.625rem] text-ink-faint">0 — 10</span>
        </div>

        {/* Band track, so the score reads against the thresholds it sits in. */}
        <div className="mt-2 flex h-1.5 w-full overflow-hidden bg-raised">
          {SEVERITY_BANDS.map((band) => (
            <div
              key={band.name}
              style={{ width: `${((band.max - band.min + 0.1) / 10) * 100}%` }}
              className={`h-full ${band.name === severity ? colors.bar : "bg-line"} ${band.name !== severity ? "opacity-50" : ""}`}
            />
          ))}
        </div>

        <div className="relative mt-1 h-3">
          <div
            className="absolute top-0 -translate-x-1/2"
            style={{ left: `${pct}%` }}
            aria-hidden="true"
          >
            <div className={`h-2 w-px ${colors.bar}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function VectorChips({ vector }: { vector: string }) {
  const parts = parseVector(vector);

  return (
    <div className="flex flex-wrap gap-1.5">
      {parts.map((part) => (
        <span
          key={part.key}
          className="group/chip inline-flex items-baseline gap-1 border border-line bg-base px-2 py-1 transition-colors hover:border-accent/40"
          title={`${METRICS.find((m) => m.key === part.key)?.name}: ${part.label}`}
        >
          <span className="font-mono text-[0.625rem] text-ink-faint">{part.key}</span>
          <span className="font-mono text-[0.6875rem] text-accent">{part.value}</span>
          <span className="text-[0.625rem] text-ink-dim">{part.label}</span>
        </span>
      ))}
    </div>
  );
}

export default function Scoring({ index }: { index: string }) {
  const [selected, setSelected] = useState(0);
  const example = examples[selected];
  const colors = SEVERITY_COLOR[example.severity];

  return (
    <Section
      id="scoring"
      index={index}
      eyebrow="Method"
      title="How findings are scored"
      lede="Every finding ships with a CVSS 3.1 vector, a CWE classification, a reproducible proof-of-concept chain and a business-impact narrative. The vector is the audit trail for the number."
    >
      <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]">
        {/* Selector */}
        <div className="flex flex-col bg-base">
          <p className="rule-label border-b border-line px-5 py-3">Vulnerability class</p>
          {examples.map((item, i) => (
            <button
              key={item.cwe}
              type="button"
              onClick={() => setSelected(i)}
              aria-pressed={i === selected}
              className={`border-b border-line px-5 py-4 text-left transition-colors last:border-b-0 ${
                i === selected ? "bg-surface" : "hover:bg-surface/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`text-sm leading-snug ${i === selected ? "text-ink" : "text-ink-dim"}`}
                >
                  {item.title}
                </span>
                <span
                  className={`shrink-0 font-display text-sm ${SEVERITY_COLOR[item.severity].text}`}
                >
                  {item.score.toFixed(1)}
                </span>
              </div>
              <span className="mt-1.5 block font-mono text-[0.625rem] text-ink-faint">
                {item.cwe}
              </span>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="bg-base p-6 lg:p-8">
          <ScoreGauge score={example.score} severity={example.severity} />

          <div className={`mt-6 border-l-2 ${colors.border} pl-4`}>
            <h3 className="font-display text-lg leading-snug text-ink">{example.title}</h3>
            <p className="mt-1.5 font-mono text-xs text-accent">
              {example.cwe} · {example.cweName}
            </p>
          </div>

          <div className="mt-6">
            <p className="rule-label mb-2.5">Vector</p>
            <code className="block overflow-x-auto border border-line bg-void px-3 py-2.5 font-mono text-[0.6875rem] text-ink-dim">
              {example.vector}
            </code>
            <div className="mt-3">
              <VectorChips vector={example.vector} />
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="rule-label mb-2">Why this score</p>
              <p className="text-sm leading-relaxed text-ink-dim text-pretty">
                {example.rationale}
              </p>
            </div>
            <div>
              <p className="rule-label mb-2">Business impact</p>
              <p className="text-sm leading-relaxed text-ink-dim text-pretty">{example.impact}</p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 font-mono text-xs text-ink-faint">
        Illustrative vulnerability classes, not engagement findings. Client findings stay under NDA.
      </p>
    </Section>
  );
}
