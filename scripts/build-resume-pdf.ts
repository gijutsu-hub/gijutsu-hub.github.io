/**
 * Builds the resume PDFs from src/content/resume.ts.
 *
 *   Sumon-Nath-Resume.pdf            ATS-facing, full detail. White, single
 *                                    column, Helvetica, no embedded fonts.
 *                                    The one to upload to job portals.
 *
 *   Sumon-Nath-Resume-OnePage.pdf    Same document cut to one page by
 *                                    `compactPlan`. Google's own guidance is
 *                                    one page per ten years of experience.
 *
 *   Sumon-Nath-Resume-Portfolio.pdf  Matches the site. Dark, embedded type.
 *                                    For sending to a human directly.
 *
 * Same content, same layout engine, different theme. See scripts/resume/theme.ts.
 */

import { atsTheme, onePageTheme, portfolioTheme } from "./resume/theme.js";
import { renderResume } from "./resume/render.js";

for (const theme of [atsTheme, onePageTheme, portfolioTheme]) {
  const path = renderResume(theme);
  console.log(`[resume] ${theme.id.padEnd(12)} -> ${path}`);
}
