import Section from "@/components/ui/Section";
import { projectWorld as pw } from "@/content/projectWorld";

/**
 * Concept work, labelled as such everywhere it appears.
 *
 * The risks are rendered before the claims. That ordering is the argument: a
 * design document that leads with its benefits is marketing, and the failure
 * modes here are the part that belongs on a security portfolio.
 */

function StageBadge() {
  return (
    <span className="inline-flex items-center gap-2 border border-indigo/40 bg-indigo/10 px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-wider text-indigo">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo" />
      Concept · white paper
    </span>
  );
}

/** Mint-to-burn cycle. Horizontal on wide screens, vertical on narrow. */
function CreditCycle() {
  return (
    <ol className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
      {pw.flow.map((step, i) => (
        <li key={step.label} className="relative flex flex-col bg-panel p-5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[0.625rem] text-ink-faint">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={`inline-block h-px flex-1 ${i === pw.flow.length - 1 ? "bg-signal/40" : "bg-accent/35"}`}
              aria-hidden="true"
            />
          </div>

          <h4
            className={`mt-3 font-display text-base ${
              i === pw.flow.length - 1 ? "text-signal" : "text-accent"
            }`}
          >
            {step.label}
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-ink-faint text-pretty">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}

export default function ProjectWorld({ index }: { index: string }) {
  return (
    <Section
      id="project-world"
      index={index}
      eyebrow="Concept"
      title="Project World"
      lede={pw.standfirst}
    >
      <div className="flex flex-wrap items-center gap-3">
        <StageBadge />
        <span className="font-mono text-xs text-ink-faint">
          Nothing here is built. No code, no chain, no pilot.
        </span>
      </div>

      <p className="mt-8 max-w-3xl leading-relaxed text-ink-dim text-pretty">{pw.premise}</p>

      {/* Credit types */}
      <h3 className="rule-label mt-14 mb-5">Purpose-bound credits</h3>
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {pw.credits.map((credit) => (
          <div key={credit.symbol} className="bg-panel p-5">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-sm text-accent">{credit.symbol}</span>
              <span className="font-display text-base text-ink">{credit.name}</span>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-faint text-pretty">
              {credit.pegged}
            </p>
          </div>
        ))}
      </div>

      {/* Lifecycle */}
      <h3 className="rule-label mt-14 mb-5">Mint-to-burn cycle</h3>
      <CreditCycle />

      {/* Risks first. */}
      <h3 className="mt-16 font-display text-2xl">Where it breaks</h3>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink-dim">
        The failure modes are more interesting than the premise, and the first one is fatal
        unless solved.
      </p>

      <div className="mt-7 space-y-px border border-line bg-line">
        {pw.risks.map((risk, i) => (
          <article key={risk.title} className="bg-panel p-6 lg:p-7">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 shrink-0 border border-signal/35 bg-signal/10 px-2 py-0.5 font-mono text-[0.625rem] text-signal">
                R{String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h4 className="font-display text-lg leading-snug text-ink">{risk.title}</h4>
                <p className="mt-2 leading-relaxed text-ink-dim text-pretty">{risk.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Then the upside. */}
      <h3 className="mt-16 font-display text-2xl">What it would buy, if the first risk were solved</h3>

      <div className="mt-7 grid gap-px border border-line bg-line sm:grid-cols-2">
        {pw.claims.map((claim) => (
          <article key={claim.title} className="bg-panel p-6">
            <h4 className="flex items-start gap-3 font-display text-base leading-snug">
              <span
                className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 bg-accent"
                aria-hidden="true"
              />
              {claim.title}
            </h4>
            <p className="mt-2.5 pl-[1.125rem] text-sm leading-relaxed text-ink-dim text-pretty">
              {claim.body}
            </p>
          </article>
        ))}
      </div>

      {/* Roadmap */}
      <h3 className="rule-label mt-16 mb-5">Adoption path</h3>
      <ol className="relative space-y-7 border-l border-line pl-7">
        {pw.roadmap.map((phase) => (
          <li key={phase.n} className="relative">
            <span
              className="absolute -left-[calc(1.75rem+3.5px)] top-1.5 h-[7px] w-[7px] rounded-full bg-indigo ring-4 ring-void"
              aria-hidden="true"
            />
            <p className="font-mono text-xs text-ink-faint">Phase {phase.n}</p>
            <h4 className="mt-1 font-display text-lg">{phase.name}</h4>
            <p className="mt-1.5 max-w-2xl leading-relaxed text-ink-dim text-pretty">
              {phase.detail}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
