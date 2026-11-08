/**
 * Verifies that every string the resume renders survives PDF text extraction
 * intact, in every published build.
 *
 * This catches a failure class that looks fine on screen and passes every
 * other check: pdfkit may wrap a hyphenated term across a line, and a parser
 * that de-hyphenates then joins the halves without the hyphen —
 * "Proof-of-Concept" is ingested as "Proof-ofConcept". An ATS indexes the
 * mangled form, so the term no longer matches a recruiter's search. Because
 * the break point depends on type size, each build has to be checked against
 * the content it actually renders, not against a shared superset.
 *
 * Run: npx tsx scripts/checks/extraction-fidelity.ts
 */

import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  compactPlan,
  resumeAchievements,
  resumeCertifications,
  resumeEducation,
  resumeHighlights,
  resumeProjects,
  resumePublications,
  resumePublicationsShort,
  resumeRoles,
  resumeSkills,
  resumeSummary,
} from "../../src/content/resume.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "..", "public");

/** Collapse all whitespace so line wrapping alone never counts as a mismatch. */
const flat = (s: string) => s.replace(/\s+/g, " ").trim();

const education = [
  resumeEducation.degree,
  resumeEducation.specialisation,
  resumeEducation.institution,
];

/** Exactly what `renderResume` writes for a full-detail build. */
const fullStrings: string[] = [
  resumeSummary,
  ...resumeHighlights,
  ...resumeRoles.flatMap((r) => [r.title, r.org, ...r.bullets]),
  ...resumeProjects.flatMap((p) => [p.title, ...p.bullets]),
  ...resumeSkills.flatMap((g) => [g.heading, ...g.items]),
  ...resumePublications,
  ...resumeCertifications,
  ...resumeAchievements,
  ...education,
];

/**
 * Exactly what it writes for the compact build. Mirrors `compactPlan` rather
 * than guessing with a prefix match — the short summary shares a long opening
 * with the full one, so a heuristic reports it as mangled when it is simply a
 * different string that was never rendered here.
 */
const compactSkills = new Set<string>(compactPlan.skillGroups);
const compactStrings: string[] = [
  compactPlan.summary,
  ...resumeHighlights.slice(0, compactPlan.highlights),
  ...resumeRoles.flatMap((r, i) => [
    r.title,
    r.org,
    ...r.bullets.slice(0, compactPlan.roleBullets[i]),
  ]),
  ...resumeProjects.flatMap((p) => [
    p.title,
    ...p.bullets.slice(0, compactPlan.projectBullets),
  ]),
  ...resumeSkills
    .filter((g) => compactSkills.has(g.heading))
    .flatMap((g) => [g.heading, ...g.items.slice(0, compactPlan.skillItemsPerGroup)]),
  ...resumePublicationsShort,
  ...resumeCertifications,
  ...education,
];

const builds = [
  { name: "Sumon-Nath-Resume.pdf", strings: fullStrings },
  { name: "Sumon-Nath-Resume-OnePage.pdf", strings: compactStrings },
  { name: "Sumon-Nath-Resume-Portfolio.pdf", strings: fullStrings },
];

/**
 * The check needs poppler's pdftotext. The deploy workflow installs
 * poppler-utils for exactly this reason — it is not on the runner image by
 * default. The skip below is for a local machine without it; a deploy must
 * not fail over a missing system tool, but it must not silently skip either,
 * which is why CI installs the tool rather than relying on this path.
 */
try {
  execFileSync("pdftotext", ["-v"], { stdio: "ignore" });
} catch {
  console.warn("[check] pdftotext not found; skipping extraction fidelity check.");
  process.exit(0);
}

let failures = 0;

for (const { name, strings } of builds) {
  const text = flat(
    execFileSync("pdftotext", [join(PUBLIC_DIR, name), "-"], { encoding: "utf8" }),
  );

  const missing = strings.filter((s) => !text.includes(flat(s)));

  if (missing.length) {
    failures += missing.length;
    console.error(`\n✗ ${name}: ${missing.length} of ${strings.length} string(s) mangled`);
    for (const s of missing) {
      console.error(`    ${s.slice(0, 110)}${s.length > 110 ? "…" : ""}`);
    }
  } else {
    console.log(`✓ ${name}: all ${strings.length} rendered strings intact`);
  }
}

if (failures) process.exit(1);
