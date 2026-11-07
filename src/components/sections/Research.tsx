import Section from "@/components/ui/Section";
import { cveUrl, disclosureTargets, events, recognition, research } from "@/content/research";

function ExternalIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4 2h6v6M10 2L2.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
    </svg>
  );
}

function Counter({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <div className="border border-line bg-surface p-6">
      <p className="font-display text-4xl text-accent">{value}</p>
      <p className="mt-2 font-mono text-xs uppercase tracking-wider text-ink-dim">{label}</p>
      {note && <p className="mt-3 text-sm leading-relaxed text-ink-faint">{note}</p>}
    </div>
  );
}

export default function Research({ index }: { index: string }) {
  return (
    <Section
      id="research"
      index={index}
      eyebrow="Disclosure"
      title="Vulnerability research & disclosure"
      lede="Vulnerabilities found, reported through vendor programmes, and fixed. Every credit below is a public record."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Counter
          value={String(research.cveCount)}
          label="CVEs assigned"
          note="Discovered and reported through coordinated vendor disclosure."
        />
        <Counter
          value="1"
          label="CWE contribution"
          note="Contribution to a MITRE CWE weakness entry."
        />
        <Counter
          value="100+"
          label="Programs"
          note="Independent bug bounty research across public and private programmes."
        />
        <Counter
          value="2×"
          label="Microsoft MVR"
          note="Most Valuable Security Researcher, 2022 and 2023."
        />
      </div>

      {/* Renders only once real identifiers exist. See the note in
          src/content/research.ts for why none are invented. */}
      {research.cves.length > 0 && (
        <div className="mt-8 overflow-hidden border border-line">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Assigned CVE identifiers</caption>
            <thead>
              <tr className="border-b border-line bg-surface">
                <th scope="col" className="rule-label px-5 py-4 font-normal">Identifier</th>
                <th scope="col" className="rule-label px-5 py-4 font-normal">Vendor</th>
                <th scope="col" className="rule-label hidden px-5 py-4 font-normal md:table-cell">
                  Summary
                </th>
              </tr>
            </thead>
            <tbody>
              {research.cves.map((cve) => (
                <tr key={cve.id} className="border-b border-line last:border-b-0 hover:bg-surface/60">
                  <th scope="row" className="px-5 py-4 align-top font-mono text-sm font-normal">
                    <a
                      href={cveUrl(cve)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 text-accent hover:underline"
                    >
                      {cve.id}
                      <ExternalIcon />
                    </a>
                    <span className="mt-2 block text-sm text-ink-faint md:hidden">{cve.summary}</span>
                  </th>
                  <td className="px-5 py-4 align-top text-sm text-ink-dim">{cve.vendor}</td>
                  <td className="hidden px-5 py-4 align-top text-sm leading-relaxed text-ink-dim md:table-cell">
                    {cve.summary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {research.cwe && (
        <div className="mt-5 border border-line bg-surface p-6">
          <a
            href={research.cwe.url ?? `https://cwe.mitre.org/data/definitions/${research.cwe.id.replace("CWE-", "")}.html`}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 font-mono text-sm text-accent hover:underline"
          >
            {research.cwe.id}
            <ExternalIcon />
          </a>
          <p className="mt-2 font-display text-lg">{research.cwe.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-dim">{research.cwe.note}</p>
        </div>
      )}

      <div className="mt-10">
        <h3 className="rule-label mb-4">Reported to</h3>
        <div className="flex flex-wrap gap-2">
          {disclosureTargets.map((target) => (
            <span
              key={target}
              className="border border-line-bright bg-surface px-4 py-2 font-mono text-sm text-ink"
            >
              {target}
            </span>
          ))}
          <span className="border border-line bg-surface px-4 py-2 font-mono text-sm text-ink-faint">
            + others under CVD
          </span>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="font-display text-2xl">Events organised</h3>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-dim">
          Running an event is the other side of competing in one — infrastructure, challenge
          design, live scoring and keeping a thousand people from knocking the platform over.
        </p>

        <div className="mt-8 grid gap-px border border-line bg-line lg:grid-cols-3">
          {events.map((event) => (
            <article key={event.name} className="flex flex-col bg-base p-6 lg:p-7">
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-display text-lg">{event.name}</h4>
                {event.weight && (
                  <span className="shrink-0 border border-accent/35 bg-accent/10 px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-wider text-accent">
                    {event.weight}
                  </span>
                )}
              </div>

              <p className="mt-1.5 font-mono text-xs text-accent">{event.role}</p>
              {event.editions && (
                <p className="mt-1 font-mono text-xs text-ink-faint">{event.editions}</p>
              )}

              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-dim text-pretty">
                {event.detail}
              </p>

              {(event.url || event.ctftime) && (
                <div className="mt-5 flex flex-wrap gap-4">
                  {event.url && (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-dim transition-colors hover:text-accent"
                    >
                      Site
                      <ExternalIcon />
                    </a>
                  )}
                  {event.ctftime && (
                    <a
                      href={event.ctftime}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-dim transition-colors hover:text-accent"
                    >
                      CTFtime
                      <ExternalIcon />
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="font-display text-2xl">Recognition</h3>
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
          {recognition.map((item) => (
            <article key={item.title} className="bg-base p-6 lg:p-7">
              {item.period && <p className="rule-label mb-3">{item.period}</p>}
              <h4 className="font-display text-lg leading-snug">{item.title}</h4>
              <p className="mt-3 text-sm leading-relaxed text-ink-dim text-pretty">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
