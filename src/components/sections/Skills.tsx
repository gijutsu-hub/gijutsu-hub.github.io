import Section from "@/components/ui/Section";
import Tag from "@/components/ui/Tag";
import { certifications, education, skillGroups, standards } from "@/content/skills";

export default function Skills({ index }: { index: string }) {
  return (
    <Section
      id="skills"
      index={index}
      eyebrow="Inventory"
      title="Skills, standards & credentials"
    >
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="space-y-9">
          {skillGroups.map((group) => (
            <div key={group.group}>
              <h3 className="rule-label mb-4 text-ink-dim">{group.group}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="rule-label mb-4 text-ink-dim">Frameworks & compliance</h3>
            <dl className="divide-y divide-line border-y border-line">
              {standards.map((standard) => (
                <div key={standard.framework} className="py-3.5">
                  <dt className="font-mono text-sm text-ink">{standard.framework}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-faint">
                    {standard.appliedTo}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="rule-label mb-4 text-ink-dim">Certifications</h3>
            <ul className="space-y-3">
              {certifications.map((cert) => (
                <li
                  key={cert.name}
                  className="flex items-start justify-between gap-4 border border-line bg-surface p-4"
                >
                  <div>
                    <p className="text-sm leading-snug text-ink">{cert.name}</p>
                    <p className="mt-1 font-mono text-xs text-ink-faint">{cert.issuer}</p>
                  </div>
                  <span
                    className={`shrink-0 border px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-wider ${
                      cert.status === "Certified"
                        ? "border-accent/40 bg-accent/10 text-accent"
                        : "border-line-bright text-ink-faint"
                    }`}
                  >
                    {cert.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="rule-label mb-4 text-ink-dim">Education</h3>
            <div className="border border-line bg-surface p-4">
              <p className="text-sm leading-snug text-ink">{education.degree}</p>
              <p className="mt-1 text-sm text-ink-dim">{education.specialisation}</p>
              <p className="mt-2.5 font-mono text-xs text-ink-faint">
                {education.institution} · {education.period}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
