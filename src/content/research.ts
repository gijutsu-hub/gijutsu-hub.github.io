/**
 * Vulnerability research credits and events organised.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ON THE EMPTY `cves` AND `cwe` FIELDS — THIS IS DELIBERATE
 *
 * The site states CVE and CWE counts without listing identifiers. That is a
 * decision, not an unfinished task: naming individual CVEs invites scrutiny of
 * each one, and the aggregate claim carries the credential just as well for a
 * portfolio audience.
 *
 * If that changes, populate `cves` and `cwe` below and the detailed table and
 * card render automatically — no component changes needed. Each entry links to
 * its NVD or MITRE record, so only real, verifiable identifiers belong here.
 * ────────────────────────────────────────────────────────────────────────────
 */

export interface CveCredit {
  /** e.g. "CVE-2024-31337" */
  id: string;
  /** Affected vendor or product. */
  vendor: string;
  /** One line on the vulnerability class and impact. */
  summary: string;
  /** Defaults to the NVD record if omitted. */
  url?: string;
}

export interface CweCredit {
  /** e.g. "CWE-502" */
  id: string;
  name: string;
  note: string;
  url?: string;
}

export const research = {
  /** Assigned CVEs. Counts are stated even while the list is empty. */
  cveCount: 5,
  cves: [] as CveCredit[],

  /** CWE contribution. Set to null until the entry is confirmed. */
  cwe: null as CweCredit | null,

  /**
   * Example shape, kept so the format is obvious when the IDs arrive:
   *
   * cves: [
   *   {
   *     id: "CVE-2024-12345",
   *     vendor: "Example Vendor",
   *     summary: "Unauthenticated deserialisation leading to remote code execution.",
   *   },
   * ],
   * cwe: {
   *   id: "CWE-502",
   *   name: "Deserialization of Untrusted Data",
   *   note: "Contributed observed-example and detection guidance.",
   * },
   */
} as const;

/** Builds the NVD link for a CVE when no explicit URL is given. */
export function cveUrl(credit: CveCredit): string {
  return credit.url ?? `https://nvd.nist.gov/vuln/detail/${credit.id}`;
}

export interface OrganisedEvent {
  name: string;
  role: string;
  detail: string;
  editions?: string;
  url?: string;
  /** CTFtime event page, where one exists. */
  ctftime?: string;
  weight?: string;
}

export const events: OrganisedEvent[] = [
  {
    name: "Damncon",
    role: "Organiser & challenge author",
    editions: "2021, 2022",
    detail:
      "A 24-hour CTF spanning web, binary exploitation, reverse engineering, shell exploitation and applied general challenges — built to reward lateral thinking rather than tool familiarity. Both editions rated 17.54 on CTFtime.",
    url: "https://damncon.dsph.org/",
    ctftime: "https://ctftime.org/ctf/684",
    weight: "17.54",
  },
  {
    name: "VIT Bhopal CTF programme",
    role: "Designer & operator",
    editions: "2023–2024",
    detail:
      "20+ events in Jeopardy and Attack-Defense formats, authoring challenges across web exploitation, binary/pwn, reverse engineering, cryptography and forensics. Sponsored by Offensive Security, Bugcrowd and HackerOne; 1000+ participants.",
  },
  {
    name: "Community events",
    role: "Challenge author & contributor",
    detail:
      "Challenge contributions to cyhunt, BSides and other community security events.",
  },
];

export interface RecognitionItem {
  title: string;
  period?: string;
  detail: string;
}

/**
 * Recognition, as distinct from output. The CVE, CWE, programme and event
 * numbers live in `research` and `events` above; this is only what other
 * people have said about the work.
 */
export const recognition: RecognitionItem[] = [
  {
    title: "Microsoft MSRC Most Valuable Security Researcher",
    period: "2022 & 2023",
    detail:
      "Named on Microsoft's annual Most Valuable Security Researcher list in two consecutive years, awarded on the volume, accuracy and impact of vulnerability submissions to Microsoft products.",
  },
  {
    title: "Invited speaker",
    detail:
      "Invited to present at security events on research contributions, including by Microsoft.",
  },
];

/** Programmes where valid vulnerabilities have been reported and accepted. */
export const disclosureTargets = [
  "Microsoft",
  "Google",
  "Apple",
  "NASA",
] as const;
