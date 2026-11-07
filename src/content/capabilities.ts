import type { Capability } from "./types";

/**
 * Depth is stated against evidence, not aspiration. If a row cannot name what
 * backs it, the row does not ship.
 */
export const capabilities: Capability[] = [
  {
    discipline: "VAPT",
    depth: "Lead",
    evidence:
      "Sole sign-off on 100+ client engagements; owns scoping through revalidation",
    href: "#vapt",
  },
  {
    discipline: "Red Team & Adversary Emulation",
    depth: "Lead",
    evidence:
      "ATT&CK-aligned operations; custom C2, loaders and EDR bypass tradecraft",
    href: "#red-team",
  },
  {
    discipline: "Application Security",
    depth: "Strong",
    evidence: "SAST/DAST/SCA tooling built and embedded; threat modeling; CI/CD gates",
    href: "#appsec",
  },
  {
    discipline: "Secure Code Review",
    depth: "Strong",
    evidence:
      "Custom Checkmarx and Snyk rules, sink-source modeling, false-positive reduction",
    href: "#appsec",
  },
  {
    discipline: "Cloud Security",
    depth: "Strong",
    evidence: "CSPM audits, IAM privilege-escalation paths, CIS benchmark review",
    href: "#cloud",
  },
  {
    discipline: "Security Research & Tooling",
    depth: "Strong",
    evidence: "CVE reproduction and PoC development; CtrlSec; deep-learning SAST engine",
    href: "#projects",
  },
  {
    discipline: "Cyber Drills & Simulation",
    depth: "Working",
    evidence: "20+ CTF events designed and operated; adversary simulation for clients",
    href: "#drills",
  },
  {
    discipline: "SOC & Detection Engineering",
    depth: "Working",
    evidence: "ATT&CK-mapped telemetry into EDR dashboards; triage and correlation design",
    href: "#detection",
  },
  {
    discipline: "Incident Response",
    depth: "Working",
    evidence: "EDR-driven investigation, log analysis, root-cause security debugging",
    href: "#detection",
  },
];
