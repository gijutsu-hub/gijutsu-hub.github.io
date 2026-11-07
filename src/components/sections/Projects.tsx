import Section from "@/components/ui/Section";
import Tag from "@/components/ui/Tag";
import { projects } from "@/content/projects";

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M4 2h6v6M10 2L2.5 9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}

export default function Projects({ index }: { index: string }) {
  return (
    <Section
      id="projects"
      index={index}
      eyebrow="Build"
      title="Tooling & research"
      lede="Platforms, engines and pipelines built end to end — the work that runs when the engagement is over."
    >
      <div className="grid gap-px border border-line bg-line lg:grid-cols-2">
        {projects.map((project) => (
          <article key={project.name} className="flex flex-col bg-panel p-7 lg:p-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl">
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 transition-colors hover:text-accent"
                    >
                      {project.name}
                      <ExternalIcon />
                    </a>
                  ) : (
                    project.name
                  )}
                </h3>
                <p className="mt-1 font-mono text-xs text-accent">{project.tagline}</p>
              </div>
              <span
                className={`shrink-0 border px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-wider ${
                  project.stage === "Built"
                    ? "border-accent/35 bg-accent/10 text-accent"
                    : project.stage === "Research"
                      ? "border-indigo/35 bg-indigo/10 text-indigo"
                      : "border-line-bright text-ink-faint"
                }`}
              >
                {project.stage}
              </span>
            </div>

            <p className="mt-5 leading-relaxed text-ink-dim text-pretty">{project.description}</p>

            <ul className="mt-5 flex-1 space-y-2.5">
              {project.highlights.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-faint">
                  <span className="mt-[0.6em] inline-block h-px w-3 shrink-0 bg-line-bright" aria-hidden="true" />
                  <span className="text-pretty">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
