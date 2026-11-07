"use client";

import BarChart, { type BarRow } from "@/components/charts/BarChart";
import CountUp from "@/components/charts/CountUp";
import Section from "@/components/ui/Section";
import { tactics } from "@/content/attack";
import { examples, SEVERITY_BANDS } from "@/content/cvss";
import snapshot from "@/content/github.generated.json";

/**
 * Charts built only from data the site already holds.
 *
 * No engagement counts, no severity distributions from real client work —
 * those numbers are under NDA and inventing plausible ones would be the
 * easiest lie on the page to tell and the hardest to spot. Everything plotted
 * here is either derived from the ATT&CK and CVSS content files or read from
 * the committed GitHub snapshot.
 */

function tacticRows(): BarRow[] {
  return tactics.map((t) => ({
    label: t.name,
    segments: [
      {
        label: "Core",
        value: t.techniques.filter((x) => x.depth === 3).length,
        className: "bg-accent",
      },
      {
        label: "Applied",
        value: t.techniques.filter((x) => x.depth === 2).length,
        className: "bg-accent/45",
      },
      {
        label: "Assessed",
        value: t.techniques.filter((x) => x.depth === 1).length,
        className: "bg-line-bright",
      },
    ],
  }));
}

function languageRows(): BarRow[] {
  const counts = new Map<string, number>();
  for (const repo of snapshot.repos) {
    for (const lang of repo.languages) {
      counts.set(lang, (counts.get(lang) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([lang, n]) => ({
      label: lang,
      segments: [{ label: "Repositories", value: n, className: "bg-indigo/70" }],
    }));
}

function severityRows(): BarRow[] {
  return SEVERITY_BANDS.slice()
    .reverse()
    .map((band) => ({
      label: band.name,
      segments: [
        {
          label: "Documented classes",
          value: examples.filter((e) => e.severity === band.name).length,
          className:
            band.name === "Critical"
              ? "bg-signal"
              : band.name === "High"
                ? "bg-signal/60"
                : band.name === "Medium"
                  ? "bg-accent"
                  : "bg-ink-faint",
        },
      ],
    }));
}

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  return (
    <div className="border border-line bg-panel p-5">
      <p className="font-display text-3xl text-accent">
        <CountUp to={value} suffix={suffix} />
      </p>
      <p className="mt-1.5 font-mono text-[0.625rem] uppercase leading-snug tracking-wider text-ink-faint">
        {label}
      </p>
    </div>
  );
}

export default function Signals({ index }: { index: string }) {
  const totalTechniques = tactics.flatMap((t) => t.techniques).length;
  const coreTechniques = tactics
    .flatMap((t) => t.techniques)
    .filter((t) => t.depth === 3).length;
  const stars = snapshot.repos.reduce((s, r) => s + r.stars, 0);
  const languages = new Set(snapshot.repos.flatMap((r) => r.languages)).size;

  return (
    <Section
      id="signals"
      index={index}
      eyebrow="Numbers"
      title="What the data says"
      lede="Everything plotted here is derived from the content files or read from a committed GitHub snapshot. No engagement statistics — those are under NDA, and plausible invented ones would be the easiest lie on this page to tell."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat value={totalTechniques} label="ATT&CK techniques mapped" />
        <Stat value={coreTechniques} label="Operated as core" />
        <Stat value={snapshot.profile.publicRepos} label="Public repositories" />
        <Stat value={languages} label="Languages across curated repos" />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="rule-label mb-1.5">ATT&CK coverage by tactic</h3>
          <p className="mb-5 text-sm text-ink-faint">
            Technique count per tactic, split by depth. The short bars are the honest part.
          </p>
          <BarChart rows={tacticRows()} caption="ATT&CK technique count per tactic, by depth" />
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {[
              ["Core", "bg-accent"],
              ["Applied", "bg-accent/45"],
              ["Assessed", "bg-line-bright"],
            ].map(([label, cls]) => (
              <span key={label} className="flex items-center gap-2">
                <span className={`inline-block h-2.5 w-2.5 ${cls}`} />
                <span className="font-mono text-[0.6875rem] text-ink-dim">{label}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="rule-label mb-1.5">Languages across curated repositories</h3>
            <p className="mb-5 text-sm text-ink-faint">
              Repositories each language appears in, from the GitHub snapshot.
            </p>
            <BarChart rows={languageRows()} caption="Languages by repository count" />
          </div>

          <div>
            <h3 className="rule-label mb-1.5">Documented vulnerability classes by severity</h3>
            <p className="mb-5 text-sm text-ink-faint">
              The worked CVSS examples, not engagement findings.
            </p>
            <BarChart rows={severityRows()} caption="Documented vulnerability classes by severity" />
          </div>
        </div>
      </div>

      {/* The snapshot date stays — it tells a reader how current these numbers
          are. The command to refresh it does not; that is for whoever
          maintains the site, and it was briefly rendered to visitors. */}
      <p className="mt-10 font-mono text-xs text-ink-faint">
        GitHub figures as of {new Date(snapshot.fetchedAt).toISOString().slice(0, 10)} ·{" "}
        {stars} stars across curated repositories
      </p>
    </Section>
  );
}
