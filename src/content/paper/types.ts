/**
 * Structured representation of the Project World paper.
 *
 * The text is transcribed verbatim from the author's draft. Its epistemic
 * framing — what is proposed versus claimed versus merely hypothesised — is
 * the substance of the document, so nothing here paraphrases or tightens it.
 */

export type Block =
  | { type: "para"; text: string }
  | { type: "lead"; text: string }
  | { type: "quote"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "numbered"; items: string[] }
  | { type: "subhead"; text: string }
  | { type: "table"; headers: string[]; rows: string[][]; widths?: number[] }
  | { type: "formula"; lines: string[] }
  | { type: "figure" }
  | { type: "caption"; text: string }
  | { type: "note"; text: string };

export interface PaperSection {
  /** Section number, e.g. "1". Omitted for front matter. */
  n?: string;
  title: string;
  blocks: Block[];
}

export interface PaperMeta {
  title: string;
  subtitle: string;
  authors: string;
  affiliation: string;
  corresponding: string;
  version: string;
  status: string;
  keywords: string;
}
