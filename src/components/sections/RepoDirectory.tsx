"use client";

import { useMemo, useState } from "react";

import Section from "@/components/ui/Section";
import { curated, KIND_LABEL, type RepoKind } from "@/content/github";
import snapshot from "@/content/github.generated.json";
import { research } from "@/content/research";

/**
 * Directory of the repositories worth reading, filterable by kind.
 *
 * The account holds 70 public repos; this lists 7. Curation is the feature —
 * a reader who opens a portfolio and finds a wall of scratch repos learns
 * nothing except that nobody edited.
 */

const KINDS: Array<RepoKind | "all"> = ["all", "research", "tooling", "training", "platform"];

function ExternalIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4 2h6v6M10 2L2.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
    </svg>
  );
}

function since(iso: string): string {
  const months = Math.round((Date.now() - new Date(iso).getTime()) / 2_592_000_000);
  if (months < 1) return "this month";
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

export default function RepoDirectory({ index }: { index: string }) {
  const [kind, setKind] = useState<RepoKind | "all">("all");

  const rows = useMemo(() => {
    return curated
      .filter((c) => kind === "all" || c.kind === kind)
      .map((c) => ({ ...c, data: snapshot.repos.find((r) => r.slug === c.slug) }))
      .filter((r) => r.data)
      .sort((a, b) => (b.data!.stars - a.data!.stars) ||
        b.data!.pushedAt.localeCompare(a.data!.pushedAt));
  }, [kind]);

  return (
    <Section
      id="directory"
      index={index}
      eyebrow="Source"
      title="Repository directory"
      lede="Seven repositories out of seventy. The rest is scratch work, and listing it would bury these."
    >
      <div className="flex flex-wrap gap-2">
        {KINDS.map((k) => {
          const count = k === "all" ? curated.length : curated.filter((c) => c.kind === k).length;
          const active = kind === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              aria-pressed={active}
              className={`border px-3.5 py-1.5 font-mono text-xs transition-colors ${
                active
                  ? "border-accent/50 bg-accent/15 text-accent"
                  : "border-line bg-surface text-ink-dim hover:border-accent/30 hover:text-ink"
              }`}
            >
              {k === "all" ? "All" : KIND_LABEL[k]}
              <span className="ml-2 text-ink-faint">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-7 grid gap-px border border-line bg-line lg:grid-cols-2">
        {rows.map((repo, i) => (
          <article
            key={repo.slug}
            className="flex animate-[revealUp_520ms_var(--ease-out-expo)_both] flex-col bg-panel p-6 transition-colors hover:bg-surface lg:p-7"
            style={{ animationDelay: `${i * 55}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-lg">
                <a
                  href={repo.data!.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-accent"
                >
                  {repo.slug}
                  <ExternalIcon />
                </a>
              </h3>

              <div className="flex shrink-0 items-center gap-3 font-mono text-[0.625rem] text-ink-faint">
                {repo.data!.stars > 0 && <span className="text-accent">★ {repo.data!.stars}</span>}
                <span className="border border-line-bright px-1.5 py-0.5 uppercase tracking-wider">
                  {KIND_LABEL[repo.kind]}
                </span>
              </div>
            </div>

            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-dim text-pretty">
              {repo.blurb}
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {repo.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-line bg-surface px-2 py-0.5 font-mono text-[0.625rem] text-ink-faint"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-line pt-3 font-mono text-[0.625rem] text-ink-faint">
              <span>{repo.data!.languages.slice(0, 4).join(" · ") || "—"}</span>
              <span>updated {since(repo.data!.pushedAt)}</span>
            </div>
          </article>
        ))}
      </div>

      {/*
        CVE register.

        Identifiers are intentionally unpublished — a settled decision, not a
        gap. The renderer for a linked table already exists in
        src/content/research.ts; populating `research.cves` there makes it
        appear, each row pointing at its NVD record.

        That instruction belongs here and not on the page. It was briefly
        rendered as visitor-facing copy, which read as an unfinished site.
      */}
      <div className="mt-14">
        <h3 className="font-display text-2xl">CVE register</h3>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-dim">
          {research.cveCount} CVEs assigned through coordinated vendor disclosure, plus a
          contribution to a MITRE CWE entry.
        </p>

        <div className="mt-6 border border-line bg-surface p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-line-bright px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-wider text-ink-faint">
              Identifiers not published
            </span>
            <span className="font-mono text-xs text-ink-faint">
              {research.cveCount} assigned · 1 CWE contribution
            </span>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-dim text-pretty">
            Identifiers are shared on request rather than listed here. Each is a public NVD
            record and confirmable in seconds by anyone evaluating the work.
          </p>
        </div>
      </div>
    </Section>
  );
}
