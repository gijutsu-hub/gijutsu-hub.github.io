/**
 * The three published resume files.
 *
 * `ats` is the default everywhere. The themed file exists because it looks
 * like the rest of the site, not because it is better — uploading it to a job
 * portal is the one way to make this worse than having a single file, so
 * every label says plainly which is which.
 */

export interface ResumeVariant {
  href: string;
  /** Browsers use this as the saved filename. */
  download: string;
  label: string;
  /** Shown beside the link. Says what the file is for. */
  note: string;
}

export const resumeVariants = {
  ats: {
    href: "/Sumon-Nath-Resume.pdf",
    download: "Sumon-Nath-Resume.pdf",
    label: "Download resume",
    note: "PDF · 2 pages · ATS-friendly",
  },
  onePage: {
    href: "/Sumon-Nath-Resume-OnePage.pdf",
    download: "Sumon-Nath-Resume-OnePage.pdf",
    label: "One-page version",
    note: "Same document cut to a single page. Google's own guidance is one page per ten years of experience.",
  },
  themed: {
    href: "/Sumon-Nath-Resume-Portfolio.pdf",
    download: "Sumon-Nath-Resume-Portfolio.pdf",
    label: "Themed version",
    note: "Same content, designed to match this site. Send it to a person, not a job portal.",
  },
} satisfies Record<string, ResumeVariant>;

/** The default download used in the nav, hero and contact block. */
export const resumeFile = resumeVariants.ats;

/**
 * The Project World paper. Same two-variant pattern as the resume: the light
 * file is the one to read, print or send; the dark one matches the site.
 */
export const paperVariants = {
  light: {
    href: "/Project-World-Paper.pdf",
    download: "Project-World-Paper.pdf",
    label: "Download paper",
    note: "PDF \u00b7 9 pages \u00b7 conceptual proposal",
  },
  dark: {
    href: "/Project-World-Paper-Dark.pdf",
    download: "Project-World-Paper-Dark.pdf",
    label: "Themed version",
    note: "Same paper, styled to match this site.",
  },
} satisfies Record<string, ResumeVariant>;
