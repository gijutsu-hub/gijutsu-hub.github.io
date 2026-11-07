import { site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="px-6 py-12 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 font-mono text-sm">
          <span className="inline-block h-1.5 w-1.5 bg-accent" />
          <span className="text-ink-dim">{site.handle}</span>
        </div>

        <nav aria-label="Social" className="flex items-center gap-5 font-mono text-sm">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer noopener"
            className="text-ink-faint transition-colors hover:text-accent"
          >
            GitHub
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="text-ink-faint transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${site.email}`}
            className="text-ink-faint transition-colors hover:text-accent"
          >
            Email
          </a>
        </nav>

        <p className="font-mono text-xs text-ink-faint">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
