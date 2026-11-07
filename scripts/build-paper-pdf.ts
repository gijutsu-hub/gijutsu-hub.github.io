/**
 * Builds the Project World paper PDFs.
 *
 *   Project-World-Paper.pdf           light, for reading, printing and sending
 *   Project-World-Paper-Dark.pdf      matches the site
 *
 * Same content, same layout engine, the two resume themes.
 */

import { atsTheme, portfolioTheme, type ResumeTheme } from "./resume/theme.js";
import { renderPaper } from "./paper/render.js";

/**
 * The light paper keeps the ATS theme's palette but takes the embedded fonts.
 *
 * The resume's light variant uses standard PDF fonts on purpose, so applicant
 * tracking systems never hit a glyph-mapping failure. A research paper has no
 * parser to satisfy, and it does contain mathematical notation that Helvetica
 * cannot render at all.
 */
const lightPaperTheme: ResumeTheme = {
  ...atsTheme,
  fonts: portfolioTheme.fonts,
  embedsFonts: true,
  body: "Body",
  bodyBold: "BodyBold",
  display: "Display",
  mono: "Mono",
};

const builds = [
  { theme: lightPaperTheme, file: "Project-World-Paper.pdf" },
  { theme: portfolioTheme, file: "Project-World-Paper-Dark.pdf" },
];

for (const b of builds) {
  const path = renderPaper(b.theme, b.file);
  console.log(`[paper] ${b.theme.id.padEnd(9)} -> ${path}`);
}
