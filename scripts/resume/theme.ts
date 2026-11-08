import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONT_DIR = join(__dirname, "..", "..", "assets", "fonts");

function font(file: string): string | null {
  const path = join(FONT_DIR, file);
  return existsSync(path) ? path : null;
}

export interface ResumeTheme {
  id: "ats" | "ats-onepage" | "portfolio";
  fileName: string;
  /** null = leave the page white. */
  background: string | null;
  accent: string;
  ink: string;
  muted: string;
  faint: string;
  rule: string;
  /** Font registrations: [name, path]. Empty means use the standard PDF fonts. */
  fonts: Array<[string, string]>;
  /**
   * True when the theme is designed around embedded type. Lets `resolveTheme`
   * tell "no fonts by design" apart from "fonts failed to load".
   */
  embedsFonts: boolean;
  body: string;
  bodyBold: string;
  display: string;
  mono: string;
  /** Drawn down the outer edge of each page. Decoration only. */
  edgeBar: boolean;
  /**
   * Applies `compactPlan` from the content file and tightens type, to land the
   * whole document on one page. Content is cut, never reworded.
   */
  compact: boolean;
}

/**
 * The ATS theme is the default download and is built for machines first:
 * white page, standard Helvetica (no embedding, no glyph-mapping risk),
 * nothing decorative.
 */
export const atsTheme: ResumeTheme = {
  id: "ats",
  fileName: "Sumon-Nath-Resume.pdf",
  background: null,
  accent: "#0F766E",
  ink: "#111827",
  muted: "#4B5563",
  faint: "#6B7280",
  rule: "#D1D5DB",
  fonts: [],
  embedsFonts: false,
  body: "Helvetica",
  bodyBold: "Helvetica-Bold",
  display: "Helvetica-Bold",
  mono: "Helvetica",
  edgeBar: false,
  compact: false,
};

/**
 * Same document, cut to a single page.
 *
 * Google's published guidance is one page per ten years of experience, so the
 * two-page file is a mild negative there. Everything else about this build is
 * identical to `atsTheme` — it is the content plan that differs, not the look.
 */
export const onePageTheme: ResumeTheme = {
  ...atsTheme,
  id: "ats-onepage",
  fileName: "Sumon-Nath-Resume-OnePage.pdf",
  compact: true,
};

/**
 * The portfolio theme matches the site and is for sending to a human who
 * already knows who you are. It embeds type, so it renders identically
 * everywhere — but it is NOT the file to upload to a job portal.
 */
export const portfolioTheme: ResumeTheme = {
  id: "portfolio",
  fileName: "Sumon-Nath-Resume-Portfolio.pdf",
  background: "#080B10",
  accent: "#45E0C8",
  ink: "#E8EEF5",
  muted: "#9AA8B8",
  faint: "#64717F",
  rule: "#1F2836",
  fonts: (
    [
      ["Body", font("Lato-Regular.ttf")],
      ["BodyBold", font("Lato-Bold.ttf")],
      ["Display", font("Lato-Black.ttf")],
      ["Mono", font("DejaVuSansMono.ttf")],
      ["MonoBold", font("DejaVuSansMono-Bold.ttf")],
    ] as Array<[string, string | null]>
  ).filter((entry): entry is [string, string] => entry[1] !== null),
  embedsFonts: true,
  body: "Body",
  bodyBold: "BodyBold",
  display: "Display",
  mono: "Mono",
  edgeBar: true,
  compact: false,
};

/**
 * If the vendored fonts are missing the themed build would crash at the first
 * `doc.font("Body")`. Fall back to the standard names instead — a plainer PDF
 * beats a failed build.
 */
export function resolveTheme(theme: ResumeTheme): ResumeTheme {
  // A theme with no embedded fonts by design is already resolved.
  if (!theme.embedsFonts) return theme;
  if (theme.fonts.length === 5) return theme;

  console.warn(
    `[resume] vendored fonts not found for "${theme.id}" theme; falling back to Helvetica.`,
  );

  return {
    ...theme,
    fonts: [],
    embedsFonts: false,
    body: "Helvetica",
    bodyBold: "Helvetica-Bold",
    display: "Helvetica-Bold",
    mono: "Courier",
  };
}
