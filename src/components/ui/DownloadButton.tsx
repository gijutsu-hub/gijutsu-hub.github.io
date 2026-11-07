import { resumeFile, type ResumeVariant } from "@/content/resumeMeta";

export default function DownloadButton({
  variant = "primary",
  file = resumeFile,
  className = "",
}: {
  variant?: "primary" | "ghost";
  /** Defaults to the ATS resume. */
  file?: ResumeVariant;
  className?: string;
}) {
  const base =
    "group inline-flex items-center gap-2 px-5 py-2.5 font-mono text-sm transition-colors";
  const styles =
    variant === "primary"
      ? "border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
      : "border border-line-bright text-ink-dim hover:border-accent/40 hover:text-ink";

  return (
    <a
      href={file.href}
      download={file.download}
      className={`${base} ${styles} ${className}`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          d="M7 1.5v7.5M3.75 6.25L7 9.5l3.25-3.25M2 12h10"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="square"
        />
      </svg>
      {file.label}
    </a>
  );
}
