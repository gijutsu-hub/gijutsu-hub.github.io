/**
 * Shared resume layout. One flow, two themes.
 *
 * Both PDFs are generated from `src/content/resume.ts` by this single
 * renderer, so the ATS file and the themed file can never say different
 * things — only look different.
 */

import { createWriteStream, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import PDFDocument from "pdfkit";

import {
  resumeAchievements,
  resumeCertifications,
  resumeEducation,
  resumeHeader,
  resumeProjects,
  resumeRoles,
  resumeSkills,
  resumeSummary,
  type ResumeRole,
} from "../../src/content/resume.js";
import { resolveTheme, type ResumeTheme } from "./theme.js";

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BULLET_INDENT = 11;

/**
 * Stamped into both PDFs so builds are byte-reproducible. Bump it only when
 * you want the documents to carry a new date.
 */
const BUILD_DATE = new Date("2026-11-07T00:00:00Z");

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "..", "public");

type Doc = InstanceType<typeof PDFDocument>;

export function renderResume(rawTheme: ResumeTheme): string {
  const theme = resolveTheme(rawTheme);
  const outPath = join(PUBLIC_DIR, theme.fileName);
  mkdirSync(PUBLIC_DIR, { recursive: true });

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    info: {
      Title: `${resumeHeader.name} - Resume`,
      Author: resumeHeader.name,
      Subject: resumeHeader.title,
      Keywords: [
        "penetration testing",
        "VAPT",
        "red team",
        "offensive security",
        "application security",
        "secure code review",
        "cloud security",
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

  header(doc, theme);

  sectionHeading(doc, theme, "Professional Summary");
  doc
    .font(theme.body)
    .fontSize(9)
    .fillColor(theme.muted)
    .text(resumeSummary, MARGIN, doc.y, { width: CONTENT_WIDTH, lineGap: 0.6 });

  sectionHeading(doc, theme, "Work Experience");
  resumeRoles.forEach((role) => roleBlock(doc, theme, role, true));

  sectionHeading(doc, theme, "Technical Skills");
  skills(doc, theme);

  sectionHeading(doc, theme, "Key Projects");
  resumeProjects.forEach((project) => roleBlock(doc, theme, project, false));

  sectionHeading(doc, theme, "Achievements and Recognition");
  bullets(doc, theme, resumeAchievements);

  sectionHeading(doc, theme, "Certifications");
  bullets(doc, theme, resumeCertifications);

  sectionHeading(doc, theme, "Education");
  education(doc, theme);

  doc.end();
  return outPath;
}

function header(doc: Doc, theme: ResumeTheme) {
  doc.font(theme.display).fontSize(theme.id === "portfolio" ? 26 : 21).fillColor(theme.ink);
  doc.text(resumeHeader.name, MARGIN, MARGIN, { width: CONTENT_WIDTH });

  doc.moveDown(0.2);
  doc
    .font(theme.body)
    .fontSize(10)
    .fillColor(theme.accent)
    .text(resumeHeader.title, { width: CONTENT_WIDTH });

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
    .fontSize(theme.id === "portfolio" ? 6.8 : 9)
    .fillColor(theme.faint)
    .text(contact.join(theme.id === "portfolio" ? " · " : "  |  "), {
      width: CONTENT_WIDTH,
      lineBreak: false,
    });

  const y = doc.y + 7;
  doc
    .moveTo(MARGIN, y)
    .lineTo(PAGE_WIDTH - MARGIN, y)
    .lineWidth(1.4)
    .strokeColor(theme.accent)
    .stroke();

  doc.y = y + 4;
  doc.x = MARGIN;
}

function sectionHeading(doc: Doc, theme: ResumeTheme, text: string) {
  // Never strand a heading at the foot of a page.
  if (doc.y > 690) doc.addPage();

  doc.moveDown(0.6);
  doc.x = MARGIN;

  doc
    .font(theme.fonts.length ? "MonoBold" : theme.bodyBold)
    .fontSize(theme.id === "portfolio" ? 8 : 10.5)
    .fillColor(theme.accent)
    .text(text.toUpperCase(), MARGIN, doc.y, {
      width: CONTENT_WIDTH,
      characterSpacing: theme.id === "portfolio" ? 1.6 : 0.8,
    });

  const y = doc.y + 4;
  doc
    .moveTo(MARGIN, y)
    .lineTo(PAGE_WIDTH - MARGIN, y)
    .lineWidth(0.75)
    .strokeColor(theme.id === "portfolio" ? theme.rule : theme.accent)
    .stroke();

  doc.y = y + 5.5;
  doc.x = MARGIN;
}

function bullets(doc: Doc, theme: ResumeTheme, items: string[]) {
  for (const item of items) {
    if (doc.y > 762) doc.addPage();
    const top = doc.y;

    // Marker and text as two runs, so wrapped lines hang under the text
    // instead of returning to the margin. They stay adjacent in the content
    // stream, so extraction order is unaffected.
    doc
      .font(theme.body)
      .fontSize(9)
      .fillColor(theme.accent)
      .text("•", MARGIN, top, { width: BULLET_INDENT, lineBreak: false });

    doc
      .font(theme.body)
      .fontSize(9)
      .fillColor(theme.muted)
      .text(item, MARGIN + BULLET_INDENT, top, {
        width: CONTENT_WIDTH - BULLET_INDENT,
        paragraphGap: 3,
        lineGap: 0.5,
      });
  }
  doc.x = MARGIN;
}

function roleBlock(doc: Doc, theme: ResumeTheme, role: ResumeRole, showMeta: boolean) {
  if (doc.y > 688) doc.addPage();
  doc.x = MARGIN;

  doc
    .font(theme.bodyBold)
    .fontSize(10.5)
    .fillColor(theme.ink)
    .text(role.title, MARGIN, doc.y, { width: CONTENT_WIDTH });

  if (showMeta) {
    const meta = [role.org, role.location].filter(Boolean).join(" | ");
    doc.font(theme.body).fontSize(9.5).fillColor(theme.muted).text(meta, { width: CONTENT_WIDTH });
    if (role.dates) {
      doc
        .font(theme.mono)
        .fontSize(theme.id === "portfolio" ? 7.5 : 9)
        .fillColor(theme.faint)
        .text(role.dates, { width: CONTENT_WIDTH });
    }
  } else if (role.org) {
    doc.font(theme.mono).fontSize(8).fillColor(theme.accent).text(role.org, { width: CONTENT_WIDTH });
  }

  doc.moveDown(0.3);
  bullets(doc, theme, role.bullets);
  doc.moveDown(0.45);
}

function skills(doc: Doc, theme: ResumeTheme) {
  for (const group of resumeSkills) {
    if (doc.y > 735) doc.addPage();
    doc.x = MARGIN;

    doc
      .font(theme.bodyBold)
      .fontSize(9)
      .fillColor(theme.ink)
      .text(`${group.heading}: `, MARGIN, doc.y, { continued: true });

    // One flowing comma-separated line. Parsers split skills on commas; a
    // multi-column grid of tags gets read back as one mangled string.
    doc
      .font(theme.body)
      .fontSize(9)
      .fillColor(theme.muted)
      .text(group.items.join(", "), { width: CONTENT_WIDTH, lineGap: 0.5 });

    doc.moveDown(0.3);
  }
}

function education(doc: Doc, theme: ResumeTheme) {
  doc.x = MARGIN;
  doc
    .font(theme.bodyBold)
    .fontSize(10)
    .fillColor(theme.ink)
    .text(resumeEducation.degree, MARGIN, doc.y, { width: CONTENT_WIDTH });
  doc
    .font(theme.body)
    .fontSize(9.5)
    .fillColor(theme.muted)
    .text(resumeEducation.specialisation, { width: CONTENT_WIDTH });
  doc
    .font(theme.mono)
    .fontSize(theme.id === "portfolio" ? 7.5 : 9)
    .fillColor(theme.faint)
    .text(`${resumeEducation.institution}  |  ${resumeEducation.dates}`, {
      width: CONTENT_WIDTH,
    });
}
