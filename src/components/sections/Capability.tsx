import Section from "@/components/ui/Section";
import { capabilities } from "@/content/capabilities";
import type { Depth } from "@/content/types";

const DEPTH_STYLE: Record<Depth, string> = {
  Lead: "border-accent/50 bg-accent/10 text-accent",
  Strong: "border-indigo/40 bg-indigo/10 text-indigo",
  Working: "border-line-bright bg-surface text-ink-faint",
};

/** Bars give the matrix a shape you can read before you read the words. */
const DEPTH_BARS: Record<Depth, number> = { Lead: 3, Strong: 2, Working: 1 };

function DepthMark({ depth }: { depth: Depth }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex gap-[3px]" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-3 w-[3px] ${
              i < DEPTH_BARS[depth]
                ? depth === "Lead"
                  ? "bg-accent"
                  : depth === "Strong"
                    ? "bg-indigo"
                    : "bg-ink-faint"
                : "bg-line-bright"
            }`}
          />
        ))}
      </span>
      <span
        className={`border px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-wider ${DEPTH_STYLE[depth]}`}
      >
        {depth}
      </span>
    </span>
  );
}

export default function Capability({ index }: { index: string }) {
  return (
    <Section
      id="capability"
      index={index}
      eyebrow="Capability"
      title="Depth stated against evidence, not aspiration"
      lede="Every row names what backs it. Where the evidence is thin, the row says so rather than borrowing weight from the ones above it."
    >
      <div className="overflow-hidden border border-line">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Capability by discipline, with depth and supporting evidence
          </caption>
          <thead>
            <tr className="border-b border-line bg-surface">
              <th scope="col" className="rule-label px-5 py-4 font-normal">
                Discipline
              </th>
              <th scope="col" className="rule-label px-5 py-4 font-normal">
                Depth
              </th>
              <th scope="col" className="rule-label hidden px-5 py-4 font-normal md:table-cell">
                Evidence
              </th>
            </tr>
          </thead>
          <tbody>
            {capabilities.map((row) => (
              <tr
                key={row.discipline}
                className="border-b border-line transition-colors last:border-b-0 hover:bg-surface/60"
              >
                <th scope="row" className="px-5 py-5 align-top font-display text-base font-normal">
                  {row.href ? (
                    <a href={row.href} className="transition-colors hover:text-accent">
                      {row.discipline}
                    </a>
                  ) : (
                    row.discipline
                  )}
                  <span className="mt-2 block text-sm leading-relaxed text-ink-faint md:hidden">
                    {row.evidence}
                  </span>
                </th>
                <td className="whitespace-nowrap px-5 py-5 align-top">
                  <DepthMark depth={row.depth} />
                </td>
                <td className="hidden px-5 py-5 align-top text-sm leading-relaxed text-ink-dim md:table-cell">
                  {row.evidence}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
