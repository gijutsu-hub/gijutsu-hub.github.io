/**
 * Renders the Project World paper to PDF, in both resume themes.
 *
 * Shares scripts/resume/theme.ts rather than defining its own palette, so the
 * paper and the resume are visibly the same family of document.
 *
 * ON THE TWO VARIANTS
 * The light one is the paper. An academic document is read at length, printed,
 * annotated and sometimes submitted; a dark background is wrong for all of
 * those. The dark one exists because it matches the site, for sending to
 * someone who already knows the brand. The light file is the default.
 *
 * ON WHAT IS NOT HERE
 * The source document contains exactly one figure, and the author says why:
 * there is no pilot data, so any chart would be invented. That constraint is
 * preserved — this renderer draws the architecture flow and nothing else.
 */

import { createWriteStream, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import PDFDocument from "pdfkit";

import {
  abstract,
  figureNodes,
  meta,
  references,
  sections,
} from "../../src/content/paper/projectWorld.js";
import type { Block } from "../../src/content/paper/types.js";
import { resolveTheme, type ResumeTheme } from "../resume/theme.js";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 56;
const CONTENT_W = PAGE_W - MARGIN * 2;

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "..", "public");

/** Fixed so the output is byte-reproducible and git stays quiet. */
const BUILD_DATE = new Date("2026-11-07T00:00:00Z");

type Doc = InstanceType<typeof PDFDocument>;

function space(doc: Doc, amount: number) {
  doc.y += amount;
  doc.x = MARGIN;
}

/** Starts a new page if less than `needed` points remain. */
function ensure(doc: Doc, needed: number) {
  if (doc.y + needed > PAGE_H - MARGIN) doc.addPage();
}

function drawFigure(doc: Doc, theme: ResumeTheme) {
  const boxW = 300;
  const boxH = 24;
  const gap = 13;
  const x = MARGIN + (CONTENT_W - boxW) / 2;

  ensure(doc, (boxH + gap) * figureNodes.length + 20);
  space(doc, 6);

  figureNodes.forEach((label, i) => {
    const y = doc.y;

    doc
      .rect(x, y, boxW, boxH)
      .lineWidth(0.6)
      .strokeColor(i === 0 ? theme.accent : theme.rule)
      .stroke();

    doc
      .font(theme.body)
      .fontSize(7.5)
      .fillColor(theme.ink)
      .text(label, x + 8, y + 8, { width: boxW - 16, align: "center", lineBreak: false });

    doc.y = y + boxH;

    if (i < figureNodes.length - 1) {
      const cx = x + boxW / 2;
      doc
        .moveTo(cx, doc.y)
        .lineTo(cx, doc.y + gap)
        .lineWidth(0.6)
        .strokeColor(theme.rule)
        .stroke();
      // Arrowhead.
      doc
        .moveTo(cx - 2.5, doc.y + gap - 3.5)
        .lineTo(cx, doc.y + gap)
        .lineTo(cx + 2.5, doc.y + gap - 3.5)
        .strokeColor(theme.rule)
        .stroke();
      doc.y += gap;
    }
  });

  // Feedback edge: the review step loops back to evidence.
  const loopX = x + boxW + 16;
  const topY = doc.y - (boxH + gap) * (figureNodes.length - 3) - boxH / 2;
  doc
    .moveTo(x + boxW, doc.y - boxH / 2)
    .lineTo(loopX, doc.y - boxH / 2)
    .lineTo(loopX, topY)
    .lineTo(x + boxW, topY)
    .lineWidth(0.6)
    .strokeColor(theme.accent)
    .dash(2, { space: 2 })
    .stroke()
    .undash();

  doc.x = MARGIN;
  space(doc, 10);
}

function drawTable(
  doc: Doc,
  theme: ResumeTheme,
  headers: string[],
  rows: string[][],
  widths?: number[],
) {
  const cols = headers.length;
  const w = (widths ?? Array(cols).fill(1 / cols)).map((f) => f * CONTENT_W);
  const pad = 6;

  const rowHeight = (cells: string[], font: string, size: number) => {
    doc.font(font).fontSize(size);
    return (
      Math.max(
        ...cells.map((c, i) => doc.heightOfString(c, { width: w[i] - pad * 2, lineGap: 0.5 })),
      ) +
      pad * 2
    );
  };

  const drawRow = (cells: string[], opts: { header?: boolean }) => {
    const font = opts.header ? theme.bodyBold : theme.body;
    const size = opts.header ? 7.5 : 7.5;
    const h = rowHeight(cells, font, size);

    ensure(doc, h + 4);
    const y = doc.y;
    let x = MARGIN;

    if (opts.header && theme.background) {
      doc.rect(MARGIN, y, CONTENT_W, h).fill(theme.rule);
    }

    cells.forEach((cell, i) => {
      doc
        .font(font)
        .fontSize(size)
        .fillColor(opts.header ? theme.accent : theme.muted)
        .text(cell, x + pad, y + pad, { width: w[i] - pad * 2, lineGap: 0.5 });
      x += w[i];
    });

    doc.y = y + h;
    doc
      .moveTo(MARGIN, doc.y)
      .lineTo(MARGIN + CONTENT_W, doc.y)
      .lineWidth(0.4)
      .strokeColor(theme.rule)
      .stroke();
    doc.x = MARGIN;
  };

  space(doc, 4);
  doc
    .moveTo(MARGIN, doc.y)
    .lineTo(MARGIN + CONTENT_W, doc.y)
    .lineWidth(0.7)
    .strokeColor(theme.accent)
    .stroke();

  drawRow(headers, { header: true });
  rows.forEach((r) => drawRow(r, {}));
  space(doc, 8);
}

function renderBlock(doc: Doc, theme: ResumeTheme, block: Block) {
  switch (block.type) {
    case "para":
      ensure(doc, 30);
      doc
        .font(theme.body)
        .fontSize(9)
        .fillColor(theme.muted)
        .text(block.text, MARGIN, doc.y, { width: CONTENT_W, align: "justify", lineGap: 1.2 });
      space(doc, 7);
      break;

    case "lead":
      doc
        .font(theme.body)
        .fontSize(10)
        .fillColor(theme.ink)
        .text(block.text, MARGIN, doc.y, { width: CONTENT_W, align: "justify", lineGap: 1.4 });
      space(doc, 9);
      break;

    case "quote": {
      ensure(doc, 40);
      const y = doc.y;
      doc
        .font(theme.body)
        .fontSize(9.5)
        .fillColor(theme.ink)
        .text(block.text, MARGIN + 16, y + 2, { width: CONTENT_W - 24, align: "left", lineGap: 1.4 });
      doc
        .moveTo(MARGIN + 4, y)
        .lineTo(MARGIN + 4, doc.y)
        .lineWidth(1.6)
        .strokeColor(theme.accent)
        .stroke();
      doc.x = MARGIN;
      space(doc, 9);
      break;
    }

    case "bullets":
    case "numbered":
      doc.font(theme.body).fontSize(9).fillColor(theme.muted);
      block.items.forEach((item, i) => {
        ensure(doc, 24);
        const marker = block.type === "numbered" ? `${i + 1}.` : "•";
        const top = doc.y;
        doc.fillColor(theme.accent).text(marker, MARGIN + 4, top, { width: 14, lineBreak: false });
        doc
          .fillColor(theme.muted)
          .text(item, MARGIN + 20, top, { width: CONTENT_W - 24, lineGap: 1, paragraphGap: 2.5 });
      });
      doc.x = MARGIN;
      space(doc, 7);
      break;

    case "subhead":
      ensure(doc, 34);
      space(doc, 4);
      doc
        .font(theme.bodyBold)
        .fontSize(9.5)
        .fillColor(theme.ink)
        .text(block.text, MARGIN, doc.y, { width: CONTENT_W });
      space(doc, 4);
      break;

    case "table":
      drawTable(doc, theme, block.headers, block.rows, block.widths);
      break;

    case "formula": {
      ensure(doc, 20 * block.lines.length + 12);
      space(doc, 4);
      block.lines.forEach((line) => {
        // Body face, not mono: Helvetica has no glyph for "\u2113", "\u2212" or
        // "\u2264", and DejaVu Sans Mono is missing "\u2113" too. pdfkit
        // substitutes silently, so a formula renders as punctuation soup with
        // no warning. Lato covers the set.
        doc
          .font(theme.body)
          .fontSize(9.5)
          .fillColor(theme.ink)
          .text(line, MARGIN, doc.y, { width: CONTENT_W, align: "center" });
        space(doc, 3);
      });
      space(doc, 5);
      break;
    }

    case "figure":
      drawFigure(doc, theme);
      break;

    case "caption":
      doc
        .font(theme.body)
        .fontSize(7.5)
        .fillColor(theme.faint)
        .text(block.text, MARGIN, doc.y, { width: CONTENT_W, align: "center" });
      space(doc, 10);
      break;

    case "note": {
      ensure(doc, 42);
      const y = doc.y;
      doc
        .font(theme.body)
        .fontSize(8.5)
        .fillColor(theme.faint)
        .text(block.text, MARGIN + 14, y + 4, { width: CONTENT_W - 20, lineGap: 1.2 });
      doc
        .rect(MARGIN, y, 2.5, doc.y - y + 4)
        .fill(theme.accent);
      doc.x = MARGIN;
      space(doc, 10);
      break;
    }
  }
}

export function renderPaper(rawTheme: ResumeTheme, fileName: string): string {
  const theme = resolveTheme(rawTheme);
  const outPath = join(PUBLIC_DIR, fileName);
  mkdirSync(PUBLIC_DIR, { recursive: true });

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    info: {
      Title: meta.title,
      Author: meta.authors,
      Subject: meta.subtitle,
      Keywords: meta.keywords,
      Creator: "gijutsu-hub portfolio build",
      CreationDate: BUILD_DATE,
      ModDate: BUILD_DATE,
    },
  });

  for (const [name, path] of theme.fonts) doc.registerFont(name, path);
  doc.pipe(createWriteStream(outPath));

  const paint = () => {
    if (!theme.background) return;
    doc.save();
    doc.rect(0, 0, PAGE_W, PAGE_H).fill(theme.background);
    if (theme.edgeBar) doc.rect(0, 0, 3, PAGE_H).fill(theme.accent);
    doc.restore();
  };
  doc.on("pageAdded", paint);
  paint();

  // ── Title block ──────────────────────────────────────────────────────────
  doc
    .font(theme.mono)
    .fontSize(7.5)
    .fillColor(theme.accent)
    .text("CONCEPTUAL PROPOSAL · NOT AN IMPLEMENTATION REPORT", MARGIN, MARGIN, {
      width: CONTENT_W,
      characterSpacing: 1.1,
    });
  space(doc, 10);

  doc
    .font(theme.display)
    .fontSize(17)
    .fillColor(theme.ink)
    .text(meta.title, MARGIN, doc.y, { width: CONTENT_W, lineGap: 1.5 });
  space(doc, 6);

  doc
    .font(theme.body)
    .fontSize(11)
    .fillColor(theme.accent)
    .text(meta.subtitle, MARGIN, doc.y, { width: CONTENT_W });
  space(doc, 12);

  const metaRows: Array<[string, string]> = [
    ["Author", meta.authors],
    ["Affiliation", meta.affiliation],
    ["Corresponding", meta.corresponding],
    ["Version", meta.version],
    ["Status", meta.status],
  ];
  metaRows.forEach(([k, v]) => {
    const top = doc.y;
    doc.font(theme.mono).fontSize(7.5).fillColor(theme.faint).text(k, MARGIN, top, { width: 78 });
    doc
      .font(theme.body)
      .fontSize(8.5)
      .fillColor(theme.muted)
      .text(v, MARGIN + 82, top, { width: CONTENT_W - 82 });
  });

  space(doc, 8);
  doc
    .moveTo(MARGIN, doc.y)
    .lineTo(MARGIN + CONTENT_W, doc.y)
    .lineWidth(1.2)
    .strokeColor(theme.accent)
    .stroke();
  space(doc, 12);

  // ── Abstract ─────────────────────────────────────────────────────────────
  doc
    .font(theme.fonts.length ? "MonoBold" : theme.bodyBold)
    .fontSize(8)
    .fillColor(theme.accent)
    .text("ABSTRACT", MARGIN, doc.y, { characterSpacing: 1.4 });
  space(doc, 6);

  abstract.forEach((p) => {
    doc
      .font(theme.body)
      .fontSize(9)
      .fillColor(theme.muted)
      .text(p, MARGIN, doc.y, { width: CONTENT_W, align: "justify", lineGap: 1.2 });
    space(doc, 7);
  });

  space(doc, 2);
  const kwTop = doc.y;
  doc.font(theme.bodyBold).fontSize(8.5).fillColor(theme.ink).text("Keywords:", MARGIN, kwTop, {
    width: 54,
  });
  doc
    .font(theme.body)
    .fontSize(8.5)
    .fillColor(theme.muted)
    .text(meta.keywords, MARGIN + 56, kwTop, { width: CONTENT_W - 56 });
  space(doc, 12);

  // ── Sections ─────────────────────────────────────────────────────────────
  sections.forEach((section) => {
    ensure(doc, 60);
    space(doc, 8);

    const top = doc.y;
    if (section.n) {
      doc
        .font(theme.mono)
        .fontSize(10)
        .fillColor(theme.accent)
        .text(section.n, MARGIN, top + 1, { width: 22, lineBreak: false });
    }
    doc
      .font(theme.display)
      .fontSize(12.5)
      .fillColor(theme.ink)
      .text(section.title, MARGIN + (section.n ? 24 : 0), top, {
        width: CONTENT_W - (section.n ? 24 : 0),
      });

    space(doc, 3);
    doc
      .moveTo(MARGIN, doc.y)
      .lineTo(MARGIN + CONTENT_W, doc.y)
      .lineWidth(0.5)
      .strokeColor(theme.rule)
      .stroke();
    space(doc, 8);

    section.blocks.forEach((block) => renderBlock(doc, theme, block));
  });

  // ── References ───────────────────────────────────────────────────────────
  ensure(doc, 80);
  space(doc, 10);
  doc
    .font(theme.display)
    .fontSize(12.5)
    .fillColor(theme.ink)
    .text("References", MARGIN, doc.y, { width: CONTENT_W });
  space(doc, 3);
  doc
    .moveTo(MARGIN, doc.y)
    .lineTo(MARGIN + CONTENT_W, doc.y)
    .lineWidth(0.5)
    .strokeColor(theme.rule)
    .stroke();
  space(doc, 8);

  references.forEach((ref, i) => {
    ensure(doc, 28);
    const top = doc.y;
    doc
      .font(theme.mono)
      .fontSize(7.5)
      .fillColor(theme.accent)
      .text(`[${i + 1}]`, MARGIN, top + 0.5, { width: 20, lineBreak: false });
    doc
      .font(theme.body)
      .fontSize(8)
      .fillColor(theme.muted)
      .text(ref, MARGIN + 22, top, { width: CONTENT_W - 22, lineGap: 0.8, paragraphGap: 3 });
  });

  doc.end();
  return outPath;
}
