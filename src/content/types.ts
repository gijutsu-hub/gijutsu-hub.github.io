/**
 * Content model for the portfolio.
 *
 * All site copy lives in `src/content` as typed data, never inline in JSX.
 * Components render this; they do not own it. Editing the site means editing
 * these files.
 */

export type Depth = "Lead" | "Strong" | "Working";

export interface Capability {
  /** Discipline name as it appears in the matrix. */
  discipline: string;
  depth: Depth;
  /** Concrete evidence. Claims without evidence do not belong here. */
  evidence: string;
  /** Anchor id of the section that expands on this capability, if any. */
  href?: string;
}

export interface Discipline {
  id: string;
  /** Short label used in navigation. */
  label: string;
  title: string;
  /** One sentence framing the discipline. Leads with the point. */
  lede: string;
  points: DisciplinePoint[];
}

export interface DisciplinePoint {
  heading: string;
  body: string;
}

export interface Role {
  title: string;
  org: string;
  location: string;
  start: string;
  end: string;
  /** Rendered as the opening paragraph of the role. */
  summary?: string;
  highlights: string[];
}

export interface Project {
  name: string;
  tagline: string;
  url?: string;
  description: string;
  highlights: string[];
  stack: string[];
}

export interface Award {
  title: string;
  detail: string;
  period?: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface StandardRef {
  framework: string;
  appliedTo: string;
}

export interface Stat {
  value: string;
  label: string;
}
