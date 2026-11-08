/**
 * Verifies that every string in the resume content survives PDF text
 * extraction intact.
 *
 * This catches a failure class that looks fine on screen and passes every
 * other check: pdfkit may wrap a hyphenated term across a line, and a parser
 * that de-hyphenates then joins the halves without the hyphen —
 * "Proof-of-Concept" is ingested as "Proof-ofConcept". An ATS indexes the
 * mangled form, so the term no longer matches a recruiter's search.
 *
 * Run: npx tsx scripts/checks/extraction-fidelity.ts
 */

import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  resumeAchievements,
  resumeCertifications,
  resumeHighlights,
  resumeProjects,
  resumePublications,
  resumeRoles,
  resumeSkills,
  resumeSummary,
} from "../../src/content/resume.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "..", "public");

/** Collapse all whitespace so line wrapping alone never counts as a mismatch. */
const flat = (s: string) => s.replace(/\s+/g, " ").trim();

const strings: string[] = [
  resumeSummary,
  ...resumeHighlights,
  ...resumeRoles.flatMap((r) => [r.title, r.org, ...r.bullets]),
  ...resumeProjects.flatMap((p) => [p.title, ...p.bullets]),
  ...resumeSkills.flatMap((g) => [g.heading, ...g.items]),
  ...resumePublications,
  ...resumeAchievements,
  ...resumeCertifications,
];

// The compact build drops content by design, so a miss there is only a real
// failure if the string also survives nowhere in the full document.
const files = ["Sumon-Nath-Resume.pdf", "Sumon-Nath-Resume-Portfolio.pdf"];

/**
 * The check needs poppler's pdftotext. GitHub's runner image ships it, but a
 * deploy must not fail because a system tool is missing — that would block
 * publishing over a check that could not run. Missing tool: warn and skip.
 * Tool present and content mangled: fail hard.
 */
try {
  execFileSync("pdftotext", ["-v"], { stdio: "ignore" });
} catch {
  console.warn("[check] pdftotext not found; skipping extraction fidelity check.");
  process.exit(0);
}

let failures = 0;

for (const file of files) {
  const text = flat(
    execFileSync("pdftotext", [join(PUBLIC_DIR, file), "-"], { encoding: "utf8" }),
  );

  const missing = strings.filter((s) => !text.includes(flat(s)));

  if (missing.length) {
    failures += missing.length;
    console.error(`\n✗ ${file}: ${missing.length} string(s) did not survive extraction`);
    for (const s of missing) console.error(`    ${s.slice(0, 110)}${s.length > 110 ? "…" : ""}`);
  } else {
    console.log(`✓ ${file}: all ${strings.length} strings intact`);
  }
}

if (failures) process.exit(1);
