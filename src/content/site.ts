import type { Stat } from "./types";

export const site = {
  name: "Sumon Nath",
  role: "Offensive Security Engineer",
  /** Rotated in the hero. Keep each under ~28 characters. */
  disciplines: [
    "Red Team Operator",
    "VAPT Lead",
    "Detection & Response",
    "Application Security",
  ],
  location: "Bengaluru, India",
  email: "snath2973@gmail.com",
  phone: "+91 8360207436",
  github: "https://github.com/gijutsu-hub",
  linkedin: "https://www.linkedin.com/in/gijutsu-hub/",
  handle: "gijutsu-hub",
  /** Used for <title>, Open Graph and the meta description. */
  tagline:
    "Offensive security engineer leading full-lifecycle VAPT and red team operations across 100+ engagements in BFSI, fintech and enterprise environments.",
  intro: [
    "I break production systems so the people who run them find out on my terms rather than an attacker's.",
    "Three years and 100+ engagements across BFSI, fintech, e-commerce, government and enterprise — scoping, exploitation, post-exploitation, reporting and revalidation. I hold sole sign-off authority on every VAPT report my team ships.",
    "The offensive work only pays off if defenders can act on it, so I spend as much time on the other side of the line: mapping what fired and what passed silently, feeding ATT&CK-tagged telemetry into EDR dashboards, and writing the detection logic that would have caught me.",
  ],
} as const;

export const stats: Stat[] = [
  { value: "100+", count: 100, suffix: "+", label: "Engagements delivered" },
  { value: "5", count: 5, label: "CVEs credited" },
  { value: "100+", count: 100, suffix: "+", label: "Bug bounty programs" },
  { value: "2×", count: 2, suffix: "×", label: "Microsoft MVR, 2022 & 2023" },
];
