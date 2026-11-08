/**
 * Shared resume layout. One flow, three builds.
 *
 * All PDFs are generated from `src/content/resume.ts` by this single
 * renderer, so the ATS file, the one-page file and the themed file can never
 * say different things — only look different, or carry less.
 */

import { createWriteStream, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import PDFDocument from "pdfkit";

import {
  compactPlan,
  resumeAchievements,
  resumeCertifications,
  resumeEducation,
  resumeHeader,
  resumeHighlights,
  resumeProjects,
  resumePublications,
  resumePublicationsShort,
  resumeRoles,
  resumeSkills,
  resumeSummary,
  type ResumeRole,
  type ResumeSection,
} from "../../src/content/resume.js";
import { resolveTheme, type ResumeTheme } from "./theme.js";

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const CONTENT_WIDTH_AT = (margin: number) => PAGE_WIDTH - margin * 2;
/**
 * Hanging indent for bullet text.
 *
 * KEEP THIS TIGHT. The marker is drawn as its own text run at the margin and
 * the body hangs just past it. The gutter between glyph and text is measured
 * from the glyph, not guessed, and kept SMALL on purpose: once that whitespace
 * approaches the body size, poppler's column detector reads the markers as a
 * separate narrow column and extracts every "•" in a block followed by every
 * sentence — which is then what an ATS ingests. Re-verify with
 * `pdftotext file.pdf -` (raw mode, no -layout) after any size change.
 */
const BULLET_GUTTER = 2.6;

/**
 * Stamped into both PDFs so builds are byte-reproducible. Bump it only when
 * you want the documents to carry a new date.
 */
const BUILD_DATE = new Date("2026-11-07T00:00:00Z");

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "..", "public");

type Doc = InstanceType<typeof PDFDocument>;

/**
 * Every size the layout uses, in one place.
 *
 * The compact build is the same document with the dial turned down — smaller
 * type, tighter leading, narrower margins. Nothing is reworded to make it
 * fit; what does not fit is dropped by `compactPlan`, visibly, in the content
 * file where it can be reviewed.
 */
interface Metrics {
  margin: number;
  contentWidth: number;
  body: number;
  heading: number;
  roleTitle: number;
  roleMeta: number;
  name: number;
  tagline: number;
  contact: number;
  lineGap: number;
  bulletGap: number;
  sectionGap: number;
  blockGap: number;
}

function metricsFor(theme: ResumeTheme): Metrics {
  const margin = theme.compact ? 32 : 40;
  const base: Metrics = {
    margin,
    contentWidth: CONTENT_WIDTH_AT(margin),
    body: 8.15,
    heading: theme.id === "portfolio" ? 8 : 9.5,
    roleTitle: 9.8,
    roleMeta: 8.8,
    name: theme.id === "portfolio" ? 26 : 21,
    tagline: 10,
    contact: theme.id === "portfolio" ? 6.8 : 9,
    lineGap: 0.3,
    bulletGap: 2,
    sectionGap: 0.35,
    blockGap: 0.3,
  };

  if (!theme.compact) return base;

  return {
    ...base,
    body: 7.7,
    heading: 8.6,
    roleTitle: 9.1,
    roleMeta: 8.1,
    name: 17.5,
    tagline: 8.5,
    contact: 7.7,
    lineGap: 0.1,
    bulletGap: 1.5,
    sectionGap: 0.45,
    blockGap: 0.26,
  };
}

export function renderResume(rawTheme: ResumeTheme): string {
  const theme = resolveTheme(rawTheme);
  const m = metricsFor(theme);
  const outPath = join(PUBLIC_DIR, theme.fileName);
  mkdirSync(PUBLIC_DIR, { recursive: true });

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: m.margin, bottom: m.margin, left: m.margin, right: m.margin },
    info: {
      Title: `${resumeHeader.name} - Resume`,
      Author: resumeHeader.name,
      Subject: resumeHeader.title,
      Keywords: [
        "penetration testing",
        "VAPT",
        "red team",
        "offensive security",
        "security engineer",
        "application security",
        "secure code review",
        "cloud security",
        "vulnerability research",
        "MITRE ATT&CK",
        "OSCP",
        "CEH",
      ].join(", "),
      Creator: "gijutsu-hub portfolio build",
      // Fixed, not `new Date()`. pdfkit stamps CreationDate into the file, so
      // a live clock makes every build emit a different binary and shows the
      // PDFs as modified in git after any build, with no content change.
      // Reproducible output keeps the tree honest about what actually changed.
      CreationDate: BUILD_DATE,
      ModDate: BUILD_DATE,
    },
  });

  for (const [name, path] of theme.fonts) doc.registerFont(name, path);

  doc.pipe(createWriteStream(outPath));

  // The background must be painted before anything else on every page, so it
  // is wired to the page event rather than called by hand at each break.
  const paint = () => {
    if (!theme.background) return;
    doc.save();
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(theme.background);
    if (theme.edgeBar) {
      doc.rect(0, 0, 3, PAGE_HEIGHT).fill(theme.accent);
    }
    doc.restore();
  };

  doc.on("pageAdded", paint);
  paint();

  const take = <T,>(items: readonly T[], limit: number | undefined) =>
    typeof limit === "number" ? items.slice(0, limit) : [...items];

  header(doc, theme, m);

  sectionHeading(doc, theme, m, "Professional Summary");
  doc
    .font(theme.body)
    .fontSize(m.body)
    .fillColor(theme.muted)
    .text(theme.compact ? compactPlan.summary : resumeSummary, m.margin, doc.y, {
      width: m.contentWidth,
      lineGap: m.lineGap,
    });

  // Directly under the summary on purpose. These are the four rarest facts in
  // the document and they used to sit on page two, below the fold of an
  // eight-second skim.
  sectionHeading(doc, theme, m, "Key Achievements");
  bullets(doc, theme, m, take(resumeHighlights, theme.compact ? compactPlan.highlights : undefined));

  sectionHeading(doc, theme, m, "Work Experience");
  resumeRoles.forEach((role, i) => {
    const limit = theme.compact ? compactPlan.roleBullets[i] : undefined;
    roleBlock(doc, theme, m, { ...role, bullets: take(role.bullets, limit) }, true);
  });

  sectionHeading(doc, theme, m, "Technical Skills");
  skills(doc, theme, m, skillGroupsFor(theme));

  sectionHeading(doc, theme, m, "Key Projects");
  resumeProjects.forEach((project) => {
    const limit = theme.compact ? compactPlan.projectBullets : undefined;
    roleBlock(doc, theme, m, { ...project, bullets: take(project.bullets, limit) }, false);
  });

  sectionHeading(doc, theme, m, "Publications");
  bullets(doc, theme, m, theme.compact ? resumePublicationsShort : resumePublications);

  if (theme.compact) {
    // One heading instead of two, to buy back a line on a one-page budget.
    sectionHeading(doc, theme, m, "Education and Certifications", 72);
    education(doc, theme, m);
    doc.moveDown(m.blockGap);
    bullets(doc, theme, m, resumeCertifications);
  } else {
    sectionHeading(doc, theme, m, "Certifications");
    bullets(doc, theme, m, resumeCertifications);

    sectionHeading(doc, theme, m, "Speaking and Community");
    bullets(doc, theme, m, resumeAchievements);

    sectionHeading(doc, theme, m, "Education", 60);
    education(doc, theme, m);
  }

  doc.end();
  return outPath;
}

function skillGroupsFor(theme: ResumeTheme): ResumeSection[] {
  if (!theme.compact) return resumeSkills;
  const keep = new Set<string>(compactPlan.skillGroups);
  return resumeSkills
    .filter((group) => keep.has(group.heading))
    .map((group) => ({
      ...group,
      items: group.items.slice(0, compactPlan.skillItemsPerGroup),
    }));
}

function header(doc: Doc, theme: ResumeTheme, m: Metrics) {
  doc.font(theme.display).fontSize(m.name).fillColor(theme.ink);
  doc.text(resumeHeader.name, m.margin, m.margin, { width: m.contentWidth });

  doc.moveDown(0.2);
  doc
    .font(theme.body)
    .fontSize(m.tagline)
    .fillColor(theme.accent)
    .text(resumeHeader.title, { width: m.contentWidth });

  doc.moveDown(0.45);
  // Contact details sit in the page body, never a PDF header region — text in
  // a true header is routinely dropped by extractors.
  const contact = [
    resumeHeader.location,
    resumeHeader.email,
    resumeHeader.phone,
    resumeHeader.linkedin,
    resumeHeader.github,
  ];

  // Monospace is wide; at the themed size this line wrapped mid-URL, which
  // reads as a broken link. Narrower separators and a smaller size keep it on
  // one line without dropping any detail.
  doc
    .font(theme.mono)
    .fontSize(m.contact)
    .fillColor(theme.faint)
    .text(contact.join(theme.id === "portfolio" ? " · " : "  |  "), {
      width: m.contentWidth,
      lineBreak: false,
    });

  const y = doc.y + (theme.compact ? 5 : 7);
  doc
    .moveTo(m.margin, y)
    .lineTo(PAGE_WIDTH - m.margin, y)
    .lineWidth(1.4)
    .strokeColor(theme.accent)
    .stroke();

  doc.y = y + 4;
  doc.x = m.margin;
}

function sectionHeading(
  doc: Doc,
  theme: ResumeTheme,
  m: Metrics,
  text: string,
  /** Height the section needs below its heading before a break is worth it. */
  needs = 100,
) {
  // Never strand a heading at the foot of a page.
  if (doc.y > PAGE_HEIGHT - m.margin - needs) doc.addPage();

  doc.moveDown(m.sectionGap);
  doc.x = m.margin;

  doc
    .font(theme.fonts.length ? "MonoBold" : theme.bodyBold)
    .fontSize(m.heading)
    .fillColor(theme.accent)
    .text(text.toUpperCase(), m.margin, doc.y, {
      width: m.contentWidth,
      characterSpacing: theme.id === "portfolio" ? 1.6 : 0.8,
    });

  const y = doc.y + (theme.compact ? 2.5 : 4);
  doc
    .moveTo(m.margin, y)
    .lineTo(PAGE_WIDTH - m.margin, y)
    .lineWidth(0.75)
    .strokeColor(theme.id === "portfolio" ? theme.rule : theme.accent)
    .stroke();

  doc.y = y + (theme.compact ? 3.5 : 5.5);
  doc.x = m.margin;
}

function bullets(doc: Doc, theme: ResumeTheme, m: Metrics, items: readonly string[]) {
  // Measured, not assumed: the marker glyph is a different width in Helvetica
  // and in the themed mono face, and both scale with the build's body size.
  doc.font(theme.body).fontSize(m.body);
  const indent = doc.widthOfString("\u2022") + BULLET_GUTTER;

  for (const item of items) {
    if (doc.y > PAGE_HEIGHT - m.margin - 30) doc.addPage();
    const top = doc.y;

    // Marker and text as two runs, so wrapped lines hang under the text
    // instead of returning to the margin.
    doc
      .font(theme.body)
      .fontSize(m.body)
      .fillColor(theme.accent)
      .text("\u2022", m.margin, top, { width: indent, lineBreak: false });

    doc
      .font(theme.body)
      .fontSize(m.body)
      .fillColor(theme.muted)
      .text(item, m.margin + indent, top, {
        width: m.contentWidth - indent,
        paragraphGap: m.bulletGap,
        lineGap: m.lineGap,
      });
  }
  doc.x = m.margin;
}

function roleBlock(
  doc: Doc,
  theme: ResumeTheme,
  m: Metrics,
  role: ResumeRole,
  showMeta: boolean,
) {
  // Needs the title, the meta line and at least two bullets below it —
  // otherwise the role's last bullet lands alone at the top of the next page
  // with no heading above it to say what it belongs to.
  if (doc.y > PAGE_HEIGHT - m.margin - 130) doc.addPage();
  doc.x = m.margin;

  doc
    .font(theme.bodyBold)
    .fontSize(m.roleTitle)
    .fillColor(theme.ink)
    .text(role.title, m.margin, doc.y, { width: m.contentWidth });

  if (showMeta) {
    // Org, location and dates on one line in compact mode — three stacked
    // lines per role is three lines the one-page budget cannot spare.
    if (theme.compact) {
      const meta = [role.org, role.location, role.dates].filter(Boolean).join(" | ");
      doc
        .font(theme.body)
        .fontSize(m.roleMeta)
        .fillColor(theme.muted)
        .text(meta, { width: m.contentWidth });
    } else {
      const meta = [role.org, role.location].filter(Boolean).join(" | ");
      doc
        .font(theme.body)
        .fontSize(m.roleMeta)
        .fillColor(theme.muted)
        .text(meta, { width: m.contentWidth });
      if (role.dates) {
        doc
          .font(theme.mono)
          .fontSize(theme.id === "portfolio" ? 7.5 : 9)
          .fillColor(theme.faint)
          .text(role.dates, { width: m.contentWidth });
      }
    }
  } else if (role.org) {
    doc
      .font(theme.mono)
      .fontSize(theme.compact ? 7.4 : 8)
      .fillColor(theme.accent)
      .text(role.org, { width: m.contentWidth });
  }

  doc.moveDown(theme.compact ? 0.12 : 0.3);
  bullets(doc, theme, m, role.bullets);
  doc.moveDown(m.blockGap);
}

function skills(doc: Doc, theme: ResumeTheme, m: Metrics, groups: ResumeSection[]) {
  for (const group of groups) {
    if (doc.y > PAGE_HEIGHT - m.margin - 55) doc.addPage();
    doc.x = m.margin;

    if (theme.compact) {
      // Label inline with the list. Costs nothing vertically, which is the
      // whole constraint on a one-page budget.
      doc
        .font(theme.bodyBold)
        .fontSize(m.body)
        .fillColor(theme.ink)
        .text(`${group.heading}: `, m.margin, doc.y, { continued: true });

      doc
        .font(theme.body)
        .fontSize(m.body)
        .fillColor(theme.muted)
        .text(group.items.join(", "), { width: m.contentWidth, lineGap: m.lineGap });

      doc.moveDown(0.12);
      continue;
    }

    // Label on its own line, list beneath it. The eye can jump between group
    // names without reading through the previous group's tail, which is the
    // thing a run-on "Heading: a, b, c, d, …" block makes impossible.
    doc
      .font(theme.bodyBold)
      .fontSize(m.body + 0.2)
      .fillColor(theme.ink)
      .text(group.heading, m.margin, doc.y, { width: m.contentWidth });

    doc.moveDown(0.12);

    // Still one flowing comma-separated run. Parsers split skills on commas;
    // a multi-column grid of tags gets read back as one mangled string, and a
    // narrow gutter between a label column and a value column gets read as two
    // columns entirely. Same reason the bullet gutter is kept tight.
    doc
      .font(theme.body)
      .fontSize(m.body)
      .fillColor(theme.muted)
      .text(group.items.join(", "), m.margin, doc.y, {
        width: m.contentWidth,
        lineGap: m.lineGap,
      });

    doc.moveDown(0.22);
  }
}

function education(doc: Doc, theme: ResumeTheme, m: Metrics) {
  doc.x = m.margin;
  doc
    .font(theme.bodyBold)
    .fontSize(theme.compact ? m.body + 0.6 : 10)
    .fillColor(theme.ink)
    .text(resumeEducation.degree, m.margin, doc.y, { width: m.contentWidth });
  doc
    .font(theme.body)
    .fontSize(m.roleMeta)
    .fillColor(theme.muted)
    .text(resumeEducation.specialisation, { width: m.contentWidth });
  doc
    .font(theme.mono)
    .fontSize(theme.id === "portfolio" ? 7.5 : theme.compact ? 7.8 : 9)
    .fillColor(theme.faint)
    .text(`${resumeEducation.institution}  |  ${resumeEducation.dates}`, {
      width: m.contentWidth,
    });
}
