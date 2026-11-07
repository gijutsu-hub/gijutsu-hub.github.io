import Section from "@/components/ui/Section";
import { roles } from "@/content/experience";

export default function Experience({ index }: { index: string }) {
  return (
    <Section
      id="experience"
      index={index}
      eyebrow="Track record"
      title="Experience"
      lede="Clients are described by sector rather than named. Most engagement contracts forbid publishing the client list, and a public site is not the place to test that."
    >
      <ol className="relative space-y-14 border-l border-line pl-8 lg:pl-12">
        {roles.map((role) => (
          <li key={`${role.org}-${role.start}`} className="relative">
            <span
              className="absolute -left-[calc(2rem+4.5px)] top-2 h-2 w-2 rounded-full bg-accent ring-4 ring-void lg:-left-[calc(3rem+4.5px)]"
              aria-hidden="true"
            />

            <p className="rule-label mb-3">
              {role.start} — {role.end}
            </p>

            <h3 className="font-display text-xl leading-snug sm:text-2xl">{role.title}</h3>
            <p className="mt-1.5 text-ink-dim">
              {role.org}
              <span className="text-ink-faint"> · {role.location}</span>
            </p>

            {role.summary && (
              <p className="mt-5 max-w-2xl leading-relaxed text-ink text-pretty">
                {role.summary}
              </p>
            )}

            <ul className="mt-5 space-y-3">
              {role.highlights.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-dim">
                  <span className="mt-[0.6em] inline-block h-px w-3 shrink-0 bg-line-bright" aria-hidden="true" />
                  <span className="text-pretty">{item}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
