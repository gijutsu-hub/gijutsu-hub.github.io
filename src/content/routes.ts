/**
 * The site map, as data.
 *
 * Navigation, prev/next paging, page metadata and the landing-page index all
 * read from this one array. Adding a page means adding an entry here and a
 * route folder — nothing else needs touching, and the four places that list
 * pages cannot fall out of step with each other.
 */

export interface RouteDef {
  /** URL path. "/" is the landing page. */
  href: string;
  /** Short label for the primary nav. */
  label: string;
  /** Page <h1> and <title>. */
  title: string;
  /** Meta description, and the blurb on the landing-page index. */
  description: string;
  /** Monospace kicker above the page title. */
  eyebrow: string;
  /** Excluded from prev/next paging and the landing index. */
  standalone?: boolean;
}

export const routes: RouteDef[] = [
  {
    href: "/",
    label: "Home",
    title: "Sumon Nath",
    eyebrow: "Index",
    description:
      "Offensive security engineer leading full-lifecycle VAPT and red team operations across 100+ engagements.",
    standalone: true,
  },
  {
    href: "/capability",
    label: "Capability",
    title: "Capability",
    eyebrow: "What I do",
    description:
      "Depth stated against evidence across VAPT, red teaming, detection and incident response, application security, cloud and exercise design.",
  },
  {
    href: "/method",
    label: "Method",
    title: "Method",
    eyebrow: "How I work",
    description:
      "MITRE ATT&CK coverage graded by depth, and the CVSS scoring discipline carried on every finding.",
  },
  {
    href: "/experience",
    label: "Experience",
    title: "Experience",
    eyebrow: "Track record",
    description:
      "Roles, skills inventory, frameworks, certifications and education.",
  },
  {
    href: "/work",
    label: "Work",
    title: "Work & research",
    eyebrow: "Build",
    description:
      "A peer-reviewed Springer chapter, platforms and tooling built end to end, and the disclosure record.",
  },
  {
    href: "/concept",
    label: "Concept",
    title: "Project World",
    eyebrow: "Concept",
    description:
      "A white paper on a physics-bound economy — and, more usefully, what would break if anyone tried it.",
  },
  {
    href: "/research",
    label: "Research",
    title: "Research & source",
    eyebrow: "Open source",
    description:
      "Curated repositories, the CVE register, and charts drawn from the site's own data rather than invented statistics.",
  },
  {
    href: "/contact",
    label: "Contact",
    title: "Contact",
    eyebrow: "Get in touch",
    description: "Scoping an assessment, or hiring for one.",
  },
  {
    href: "/resume",
    label: "Resume",
    title: "Resume",
    eyebrow: "Download",
    description: "Two-page resume, ATS-friendly, with a themed version alongside.",
    standalone: true,
  },
];

/** Pages that take part in prev/next paging, in order. */
export const pagedRoutes = routes.filter((r) => !r.standalone);

export function routeByHref(href: string): RouteDef | undefined {
  return routes.find((r) => r.href === href);
}

export function siblings(href: string): { prev?: RouteDef; next?: RouteDef } {
  const i = pagedRoutes.findIndex((r) => r.href === href);
  if (i === -1) return {};
  return { prev: pagedRoutes[i - 1], next: pagedRoutes[i + 1] };
}

/** Zero-padded position, used as the kicker number on each page. */
export function routeIndex(href: string): string {
  const i = pagedRoutes.findIndex((r) => r.href === href);
  return i === -1 ? "00" : String(i + 1).padStart(2, "0");
}
