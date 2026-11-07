/**
 * Curated GitHub repositories.
 *
 * The account has 70 public repos; most are scratch work. Listing all of them
 * would bury the few that are worth a reader's time, so the set is an explicit
 * allowlist here and the live numbers (stars, language mix, last push) are
 * fetched at build time into github.generated.json.
 *
 * Add a repo by adding its slug below and re-running `npm run github`.
 */

export type RepoKind = "research" | "tooling" | "training" | "platform";

export interface CuratedRepo {
  slug: string;
  /** Overrides the GitHub description where that is thin or absent. */
  blurb: string;
  kind: RepoKind;
  /** Vulnerability classes or techniques the repo actually covers. */
  tags: string[];
}

export const KIND_LABEL: Record<RepoKind, string> = {
  research: "Research",
  tooling: "Tooling",
  training: "Training",
  platform: "Platform",
};

export const curated: CuratedRepo[] = [
  {
    slug: "firex",
    kind: "tooling",
    blurb:
      "A Linux network security appliance: VLAN segmentation, deep packet inspection, threat-feed ingestion, an enforced air gap, and signed A/B firmware updates so a bad image cannot brick the device.",
    tags: ["Network security", "DPI", "VLAN segmentation", "Firmware signing", "C"],
  },
  {
    slug: "aisastscanner",
    kind: "research",
    blurb:
      "The deep-learning static analysis engine — cross-function taint detection across 35 vulnerability classes and 9 languages, built from scratch rather than wrapped around an existing scanner.",
    tags: ["SAST", "Taint analysis", "PyTorch", "Vulnerability detection"],
  },
  {
    slug: "mitigata-python",
    kind: "training",
    blurb:
      "Deliberately vulnerable Python/Flask application used as a CTF target. Authorised training only.",
    tags: ["Web exploitation", "Python", "Flask", "CTF"],
  },
  {
    slug: "mitigata-java",
    kind: "training",
    blurb:
      "Deliberately vulnerable Java/Spring Boot application used as a CTF target. Authorised training only.",
    tags: ["Web exploitation", "Java", "Spring Boot", "CTF"],
  },
  {
    slug: "mitigata-php",
    kind: "training",
    blurb:
      "Deliberately vulnerable PHP application used as a CTF target. Authorised training only.",
    tags: ["Web exploitation", "PHP", "CTF"],
  },
  {
    slug: "CTF-PLATFROM",
    kind: "platform",
    blurb:
      "The scoring and challenge-hosting platform behind the CTF events — the infrastructure a thousand concurrent participants actually hit.",
    tags: ["CTF infrastructure", "Scoring engine", "PHP"],
  },
  {
    slug: "pushtoprod",
    kind: "platform",
    blurb:
      "ClubGPU — a distributed ML training platform with a Go control plane, a from-scratch training engine and parameter-server coordination.",
    tags: ["Distributed systems", "Go", "ML infrastructure"],
  },
];

/** Shape written by scripts/fetch-github.ts. */
export interface RepoData {
  slug: string;
  url: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  languages: string[];
  pushedAt: string;
  createdAt: string;
  sizeKb: number;
  archived: boolean;
}

export interface GithubSnapshot {
  fetchedAt: string;
  profile: {
    login: string;
    name: string;
    publicRepos: number;
    followers: number;
    createdAt: string;
  };
  repos: RepoData[];
}
