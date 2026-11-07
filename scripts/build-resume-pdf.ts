/**
 * Builds both resume PDFs from src/content/resume.ts.
 *
 *   Sumon-Nath-Resume.pdf            ATS-facing. White, single column,
 *                                    Helvetica, no embedded fonts. This is the
 *                                    one to upload to job portals.
 *
 *   Sumon-Nath-Resume-Portfolio.pdf  Matches the site. Dark, embedded type.
 *                                    For sending to a human directly.
 *
 * Same content, same layout engine, different theme. See scripts/resume/theme.ts.
 */

import { atsTheme, portfolioTheme } from "./resume/theme.js";
import { renderResume } from "./resume/render.js";

for (const theme of [atsTheme, portfolioTheme]) {
  const path = renderResume(theme);
  console.log(`[resume] ${theme.id.padEnd(9)} -> ${path}`);
}
