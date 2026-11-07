import Section from "@/components/ui/Section";
import { citation, doiUrl, publications } from "@/content/publications";

function ExternalIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4 2h6v6M10 2L2.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
    </svg>
  );
}

/**
 * Peer-reviewed output. Every entry carries a DOI, which either resolves or
 * does not — the most checkable claim on the site, and deliberately so.
 */
export default function Publications({ index }: { index: string }) {
  return (
    <Section
      id="publications"
      index={index}
      eyebrow="Peer reviewed"
      title="Publications"
      lede="Work that went through review rather than straight to a blog. Each entry links to its DOI."
    >
      <div className="space-y-px border border-line bg-line">
        {publications.map((pub) => (
          <article key={pub.doi} className="bg-panel p-6 lg:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="border border-accent/35 bg-accent/10 px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-wider text-accent">
                {pub.type}
              </span>
              <span className="font-mono text-xs text-ink-faint">{pub.year}</span>
              {pub.accesses && (
                <span className="font-mono text-xs text-ink-faint">
                  {pub.accesses.count.toLocaleString()} accesses as of {pub.accesses.asOf}
                </span>
              )}
            </div>

            <h3 className="mt-4 max-w-3xl font-display text-xl leading-snug text-balance lg:text-2xl">
              <a
                href={doiUrl(pub.doi)}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-start gap-2 transition-colors hover:text-accent"
              >
                {pub.title}
                <span className="mt-2 shrink-0">
                  <ExternalIcon />
                </span>
              </a>
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-ink-dim">
              {pub.authors.map((a, i) => (
                <span key={a.name}>
                  <span className={a.self ? "text-accent" : undefined}>{a.name}</span>
                  {i < pub.authors.length - 1 && ", "}
                </span>
              ))}
            </p>

            <p className="mt-1.5 font-mono text-xs text-ink-faint">
              {pub.venue}
              {pub.pages && ` · pp. ${pub.pages}`} · {pub.publisher}
            </p>

            <p className="mt-5 max-w-3xl leading-relaxed text-ink-dim text-pretty">
              {pub.abstract}
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {pub.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-line bg-surface px-2 py-0.5 font-mono text-[0.625rem] text-ink-faint"
                >
                  {tag}
                </span>
              ))}
            </div>

            <details className="mt-6 border-t border-line pt-4">
              <summary className="cursor-pointer font-mono text-xs text-accent transition-colors hover:text-ink">
                Citation
              </summary>
              <p className="mt-3 select-all border border-line bg-void p-3 font-mono text-[0.6875rem] leading-relaxed text-ink-dim">
                {citation(pub)}
              </p>
              <p className="mt-2 font-mono text-[0.625rem] text-ink-faint">
                DOI:{" "}
                <a
                  href={doiUrl(pub.doi)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-accent hover:underline"
                >
                  {pub.doi}
                </a>
              </p>
            </details>
          </article>
        ))}
      </div>
    </Section>
  );
}
