/**
 * Peer-reviewed publications.
 *
 * Metadata is taken from Crossref against the DOI rather than retyped from
 * the landing page, so the citation matches the publisher's record exactly.
 * Anything here is checkable: a DOI resolves or it does not.
 */

export interface Publication {
  title: string;
  /** Authors in published order. `self` marks which one is this site's owner. */
  authors: Array<{ name: string; self?: boolean }>;
  venue: string;
  series?: string;
  publisher: string;
  year: number;
  pages?: string;
  doi: string;
  type: "Book chapter" | "Journal article" | "Conference paper";
  abstract: string;
  /** Topic chips. */
  tags: string[];
  /** Reader count from the publisher, with the date it was read. */
  accesses?: { count: number; asOf: string };
}

export const publications: Publication[] = [
  {
    title:
      "Blockchain-Based Knowledge Repository for Training Artificial Intelligence Models: Bridging AIML with Decentralized Data",
    authors: [
      { name: "Sumon Nath", self: true },
      { name: "H. Azath" },
      { name: "Subhash Chandra Patel" },
      { name: "Maram Y. Al-Safarini" },
      { name: "Hemraj Shobharam Lamkuche" },
      { name: "Sadi Irziqat" },
    ],
    venue: "Studies in Systems, Decision and Control, vol. 587",
    series: "SSDC",
    publisher: "Springer Nature Switzerland",
    year: 2025,
    pages: "1723–1733",
    doi: "10.1007/978-3-031-87584-7_126",
    type: "Book chapter",
    abstract:
      "A Blockchain-Based Knowledge Repository for the secure storage and management of AI/ML training data. Built on Ethereum smart contracts, it addresses data integrity, decentralised access control and scalable transaction handling — treating the training corpus itself as an asset with an audit trail rather than an unversioned pile of files.",
    tags: ["Blockchain", "Smart contracts", "Data integrity", "Access control", "AI/ML"],
    accesses: { count: 879, asOf: "2026-11-07" },
  },
];

export function doiUrl(doi: string): string {
  return `https://doi.org/${doi}`;
}

/** "Nath, S., Azath, H., …" — surname-first, as a citation is normally read. */
export function citation(pub: Publication): string {
  const names = pub.authors
    .map((a) => {
      const parts = a.name.trim().split(/\s+/);
      const last = parts.pop()!;
      const initials = parts.map((p) => `${p[0]}.`).join(" ");
      return initials ? `${last}, ${initials}` : last;
    })
    .join(", ");

  const pages = pub.pages ? `, pp. ${pub.pages}` : "";
  return `${names} (${pub.year}). ${pub.title}. ${pub.venue}${pages}. ${pub.publisher}.`;
}
