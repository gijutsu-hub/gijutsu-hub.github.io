import type { Project } from "./types";

export const projects: Project[] = [
  {
    name: "CtrlSec",
    tagline: "AI-powered autonomous security operations platform",
    url: "https://ctrlsec.io",
    description:
      "A full-stack autonomous threat-detection platform built end to end — backend services, AI inference pipeline and the SOC-facing console — with a custom LLM-driven threat-logic layer at its centre.",
    highlights: [
      "Custom LLM-driven threat-logic and reasoning layer, an AI compliance engine, and integrated CTF and training modules.",
      "Fuses real-time threat-intelligence feeds, automated alert triage and correlation, and adversarial-simulation workflows into one console.",
      "Architecture designed independently across a polyglot stack.",
    ],
    stack: ["Python", "Node.js", "React", "Next.js", "Go", "LLM inference"],
  },
  {
    name: "AI-SAST Scanner",
    tagline: "Deep-learning cross-function vulnerability detection",
    description:
      "A static analysis engine that learns taint flow between functions rather than matching patterns within them — covering 35 vulnerability classes across 9 programming languages.",
    highlights: [
      "CNN + BiLSTM/Transformer architecture with multi-head attention, implemented in PyTorch.",
      "Synthetic training corpora scaled to 887K labeled entries, with an Ollama-based LLM supervision and validation framework.",
      "Benchmarked toward the OWASP Benchmark; formal IEEE-style paper prepared for a Black Hat India CFP submission.",
    ],
    stack: ["PyTorch", "Python", "Ollama", "Transformers"],
  },
  {
    name: "Recon & attack-surface automation",
    tagline: "Continuous external exposure monitoring",
    description:
      "Large-scale reconnaissance pipelines that give clients a live view of external exposure rather than a point-in-time snapshot.",
    highlights: [
      "Amass v5 → httpx → nuclei chaining for continuous subdomain enumeration, service fingerprinting and vulnerability detection.",
      "Dark-web monitoring feeding client threat intelligence and target selection.",
      "ATT&CK-mapped output routed into Sophos EDR SOC dashboards for defender consumption.",
    ],
    stack: ["Amass", "httpx", "nuclei", "Bash", "Go"],
  },
  {
    name: "Offensive tooling & exploit research",
    tagline: "Bespoke payloads, loaders and CVE reproduction",
    description:
      "In-house tradecraft developed for engagements where commercial tooling is detected or blocked, plus reproduction of disclosed CVEs as deterministic proof-of-concept exploits.",
    highlights: [
      "Custom payloads, loaders and technical modules for endpoint-defense bypass.",
      "CVE reverse-engineering into instrumented, regression-ready sandbox test cases.",
      "AMSI/ETW patching, API unhooking and reflective loading implementations.",
    ],
    stack: ["C", "C++", "Rust", "Go", "Python"],
  },
];
