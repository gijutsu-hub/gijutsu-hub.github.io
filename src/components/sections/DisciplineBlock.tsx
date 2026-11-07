import Section from "@/components/ui/Section";
import type { Discipline } from "@/content/types";

export default function DisciplineBlock({
  discipline,
  index,
}: {
  discipline: Discipline;
  index: string;
}) {
  return (
    <Section
      id={discipline.id}
      index={index}
      eyebrow={discipline.label}
      title={discipline.title}
      lede={discipline.lede}
    >
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
        {discipline.points.map((point) => (
          <article
            key={point.heading}
            className="group bg-panel p-6 transition-colors hover:bg-surface lg:p-8"
          >
            <h3 className="flex items-start gap-3 font-display text-lg leading-snug">
              <span
                className="mt-2 inline-block h-1.5 w-1.5 shrink-0 bg-line-bright transition-colors group-hover:bg-accent"
                aria-hidden="true"
              />
              {point.heading}
            </h3>
            <p className="mt-3 pl-[1.125rem] text-sm leading-relaxed text-ink-dim text-pretty">
              {point.body}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
