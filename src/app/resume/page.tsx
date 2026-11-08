import type { Metadata } from "next";

import DownloadButton from "@/components/ui/DownloadButton";
import { resumeFile, resumeVariants } from "@/content/resumeMeta";
import {
  resumeAchievements,
  resumeCertifications,
  resumeEducation,
  resumeHeader,
  resumeHighlights,
  resumeProjects,
  resumePublications,
  resumeRoles,
  resumeSkills,
  resumeSummary,
} from "@/content/resume";

export const metadata: Metadata = {
  title: "Resume",
  description: resumeSummary.slice(0, 180),
};

/**
 * The web view of the resume. Renders the same `src/content/resume.ts` data
 * that generates the PDF, so the two cannot disagree — a page that quietly
 * drifts from the downloadable file is worse than not having one.
 */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 mt-14 first:mt-0">
      <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{children}</h2>
      <div className="mt-3 h-px bg-line-bright" />
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-dim">
          <span className="mt-[0.6em] inline-block h-px w-3 shrink-0 bg-line-bright" aria-hidden="true" />
          <span className="text-pretty">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ResumePage() {
  return (
    <div className="px-6 pb-24 pt-28 lg:px-10 lg:pt-32">
      <article className="mx-auto w-full max-w-3xl">
        <header className="border-b border-line pb-8">
          <h1 className="font-display text-4xl sm:text-5xl">{resumeHeader.name}</h1>
          <p className="mt-3 text-lg text-accent">{resumeHeader.title}</p>

          <p className="mt-4 font-mono text-xs leading-relaxed text-ink-faint">
            {resumeHeader.location} · {resumeHeader.email} · {resumeHeader.phone}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <DownloadButton />
            <DownloadButton variant="ghost" file={resumeVariants.onePage} />
            <span className="font-mono text-xs text-ink-faint">{resumeFile.note}</span>
          </div>

          <p className="mt-5 max-w-xl text-xs leading-relaxed text-ink-faint">
            There is also a{" "}
            <a
              href={resumeVariants.themed.href}
              download={resumeVariants.themed.download}
              className="text-accent underline underline-offset-2 hover:no-underline"
            >
              version styled like this site
            </a>
            . Same content. The plain one above is the one to upload to job
            portals — applicant tracking systems parse it more reliably, and it
            prints without burning a cartridge. The one-page cut carries the
            same facts with fewer supporting bullets, for places that ask for a
            single page.
          </p>
        </header>

        <SectionTitle>Professional summary</SectionTitle>
        <p className="leading-relaxed text-ink-dim text-pretty">{resumeSummary}</p>

        <SectionTitle>Key achievements</SectionTitle>
        <Bullets items={resumeHighlights} />

        <SectionTitle>Work experience</SectionTitle>
        <div className="space-y-10">
          {resumeRoles.map((role) => (
            <section key={`${role.org}-${role.dates}`}>
              <h3 className="font-display text-xl">{role.title}</h3>
              <p className="mt-1 text-sm text-ink-dim">
                {role.org}
                {role.location && <span className="text-ink-faint"> · {role.location}</span>}
              </p>
              <p className="mt-1 font-mono text-xs text-ink-faint">{role.dates}</p>
              <Bullets items={role.bullets} />
            </section>
          ))}
        </div>

        <SectionTitle>Technical skills</SectionTitle>
        <dl className="space-y-5">
          {resumeSkills.map((group) => (
            <div key={group.heading}>
              <dt className="font-mono text-xs uppercase tracking-wider text-ink">
                {group.heading}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink-dim">
                {group.items.join(", ")}
              </dd>
            </div>
          ))}
        </dl>

        <SectionTitle>Key projects</SectionTitle>
        <div className="space-y-9">
          {resumeProjects.map((project) => (
            <section key={project.title}>
              <h3 className="font-display text-lg">{project.title}</h3>
              {project.org && (
                <p className="mt-1 font-mono text-xs text-accent">{project.org}</p>
              )}
              <Bullets items={project.bullets} />
            </section>
          ))}
        </div>

        <SectionTitle>Publications</SectionTitle>
        <Bullets items={resumePublications} />

        <SectionTitle>Speaking and community</SectionTitle>
        <Bullets items={resumeAchievements} />

        <SectionTitle>Certifications</SectionTitle>
        <Bullets items={resumeCertifications} />

        <SectionTitle>Education</SectionTitle>
        <div>
          <h3 className="font-display text-lg">{resumeEducation.degree}</h3>
          <p className="mt-1 text-sm text-ink-dim">{resumeEducation.specialisation}</p>
          <p className="mt-1.5 font-mono text-xs text-ink-faint">
            {resumeEducation.institution} · {resumeEducation.dates}
          </p>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-3 border-t border-line pt-8">
          <DownloadButton />
          <DownloadButton variant="ghost" file={resumeVariants.onePage} />
          <DownloadButton variant="ghost" file={resumeVariants.themed} />
        </div>
      </article>
    </div>
  );
}
