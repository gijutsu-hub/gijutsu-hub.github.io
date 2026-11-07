/**
 * YouTube channel content.
 *
 * Videos come from the channel's public RSS feed, snapshotted at build time
 * by scripts/fetch-youtube.ts — same reasoning as the GitHub snapshot: a
 * deploy should not depend on a third party being reachable.
 *
 * Thumbnails are downloaded into public/yt/ rather than hot-linked from
 * i.ytimg.com. That is the difference between a page that quietly reports
 * every visitor to Google and one that does not, which is worth caring about
 * on a site whose audience runs blockers and reads network tabs.
 */

export type VideoTopic =
  | "Web exploitation"
  | "Recon"
  | "Exploit analysis"
  | "Malware"
  | "Infrastructure"
  | "Talk";

export interface VideoMeta {
  id: string;
  topic: VideoTopic;
  /** Replaces the YouTube title where that is shouty or vague. */
  title?: string;
  /** One line of our own framing, shown under the title. */
  note?: string;
  /** Excluded from the gallery. */
  hidden?: boolean;
}

/**
 * Per-video curation. Anything not listed still appears, under "Other" —
 * new uploads show up without needing an edit here.
 */
export const videoMeta: Record<string, VideoMeta> = {
  "WukNDSScHps": {
    id: "WukNDSScHps",
    topic: "Web exploitation",
    note: "Template engines evaluating attacker input, and how that becomes code execution.",
  },
  "eALnpi-jVtI": {
    id: "eALnpi-jVtI",
    topic: "Web exploitation",
    note: "Path traversal into file disclosure, and the escalation routes from there.",
  },
  "KUvGkJA3hGc": {
    id: "KUvGkJA3hGc",
    title: "Access control failure on a government portal",
    topic: "Web exploitation",
    note: "A broken access-control finding, disclosed and redacted. Reported, not published raw.",
  },
  "TXPYUCr3vmU": {
    id: "TXPYUCr3vmU",
    title: "MSDT Follina (CVE-2022-30190) walkthrough",
    topic: "Exploit analysis",
    note: "Reproducing the Microsoft Support Diagnostic Tool zero-day while it was still fresh.",
  },
  "W9nVKAsHzNc": { id: "W9nVKAsHzNc", topic: "Recon", note: "Finding exposed services with Shodan." },
  "YoSxFc5h164": {
    id: "YoSxFc5h164",
    topic: "Recon",
    note: "Operator-grade search syntax for finding what a target left indexed.",
  },
  "Y6jrvix8DJM": { id: "Y6jrvix8DJM", topic: "Recon", note: "Automating secret discovery across repositories." },
  "9vO-A4XEnQ0": { id: "9vO-A4XEnQ0", topic: "Recon", note: "Manual GitHub recon: what to grep for and why." },
  "p2_ZodFy-DY": { id: "p2_ZodFy-DY", topic: "Recon", note: "Recon methodology carried through to a live finding." },
  "tyOBrIwXXwQ": { id: "tyOBrIwXXwQ", topic: "Recon", note: "Live hunting against in-scope targets." },
  "o2IA-BLtjWY": {
    id: "o2IA-BLtjWY",
    topic: "Malware",
    note: "Writing a small sample to understand detection from the other side. Lab use only.",
  },
  "Vz7355vAKbo": { id: "Vz7355vAKbo", topic: "Talk", note: "How the common crypto scam patterns actually work." },
  "Sgl3ZkgDH80": { id: "Sgl3ZkgDH80", topic: "Infrastructure", note: "Self-hosted storage, and the trade-offs against a managed provider." },
  "wKPu26AUqA4": { id: "wKPu26AUqA4", topic: "Talk", note: "Q&A on CTF design, bug hunting and getting into the field." },
  // Off-topic for a security portfolio.
  "J5gnx753UHU": { id: "J5gnx753UHU", topic: "Talk", hidden: true },
};

export const TOPICS: VideoTopic[] = [
  "Web exploitation",
  "Exploit analysis",
  "Recon",
  "Malware",
  "Infrastructure",
  "Talk",
];

/** Shape written by scripts/fetch-youtube.ts. */
export interface Video {
  id: string;
  title: string;
  published: string;
  views: number | null;
  description: string;
  /** Local path under public/. */
  thumb: string;
  width: number;
  height: number;
}

export interface YoutubeSnapshot {
  fetchedAt: string;
  channel: {
    id: string;
    handle: string;
    name: string;
    url: string;
  };
  videos: Video[];
}

export const CHANNEL_URL = "https://www.youtube.com/@gijutsu_hub";

/** Privacy-preserving embed host: no cookie until playback starts. */
export function embedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}

export function watchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}
