import type { Role } from "./types";

/**
 * NOTE ON CLIENT NAMES
 * The CV names clients directly. A public site is a different risk surface:
 * most MSAs forbid naming engagement clients without written consent, and a
 * published list is discoverable by anyone. Sectors are used here instead.
 * Swap in names only after confirming the contracts permit it.
 */
export const roles: Role[] = [
  {
    title: "Senior Security Researcher, Team Lead",
    org: "Alphawave Technology Pvt Ltd — Mitigata Security",
    location: "Bengaluru, India",
    start: "Jan 2026",
    end: "Present",
    summary:
      "Owns the end-to-end VAPT delivery lifecycle for 100+ clients, from pre-engagement scoping through threat modeling, exploitation, patch verification, revalidation and remediation advisory.",
    highlights: [
      "Holds sole sign-off authority on all VAPT reports; assigns document IDs, enforces report QA, manages the delivery pipeline, and technically leads and mentors a team of security interns.",
      "Runs adversary emulation aligned to MITRE ATT&CK: resilient C2 infrastructure with redirectors, domain fronting and malleable profiles; initial-access payloads; AV/EDR evasion via AMSI/ETW patching, unhooking and reflective loading; then lateral movement, Kerberos abuse and credential harvesting through to controlled exfiltration.",
      "Develops custom offensive tooling and tradecraft — bespoke payloads, loaders and technical modules — to extend coverage where off-the-shelf tooling is signatured or blocked.",
      "Delivers assessments across BFSI, capital markets, e-commerce, aviation, fintech infrastructure, venture-capital and fund-management platforms, and Government of India entities.",
      "Produces audit-grade deliverables with CVSS 3.1 vectors, CWE classification, PoC exploitation chains and business-impact narratives mapped to SEBI CSCRF, CERT-In and ISO 27001 controls.",
      "Performs CSPM across AWS and GCP multi-cloud estates: IAM policy audit, privilege-escalation paths, bucket exposure, security groups and misconfiguration review against CIS benchmarks.",
      "Conducts SBOM generation and software supply-chain analysis — transitive dependency enumeration, CVE-mapped components, and license and integrity risk.",
      "Engineers large-scale recon and attack-surface automation (Amass v5 → httpx → nuclei) for continuous enumeration and vulnerability chaining; runs dark-web monitoring and feeds ATT&CK-mapped telemetry into Sophos EDR SOC dashboards.",
    ],
  },
  {
    title: "Senior Software Engineer & Security Researcher",
    org: "Loginsoft Pvt Ltd",
    location: "Hyderabad, India",
    start: "May 2024",
    end: "Nov 2025",
    highlights: [
      "Reverse-engineered and reproduced recently disclosed CVEs into weaponized proof-of-concept exploits, with deterministic test cases deployed into isolated, instrumented sandbox environments for validation and regression.",
      "Built and integrated SAST and SCA tooling (Checkmarx, Snyk), authoring custom query rules, sink/source definitions and payload libraries to cut false positives and widen detection coverage.",
      "Embedded security gates into CI/CD pipelines — automated SAST/SCA scanning, dependency auditing and policy enforcement — alongside firewall configuration and CIS-aligned server hardening.",
      "Performed CIA-triad threat modeling, root-cause security debugging and vulnerability research across enterprise application stacks.",
    ],
  },
  {
    title: "Security Intern",
    org: "Secure — Centre of Excellence in Cyber Security, VIT Bhopal",
    location: "Bhopal, India",
    start: "Jan 2023",
    end: "Feb 2024",
    highlights: [
      "Designed, developed and operated 20+ CTF events in Jeopardy and Attack-Defense formats, authoring challenges across web exploitation, binary/pwn, reverse engineering, cryptography and forensics — sponsored by Offensive Security, Bugcrowd and HackerOne, engaging 1000+ participants.",
      "Hardened campus infrastructure: firewall rule design, network segmentation with VLANs and ACLs, access control, and deployment of enterprise network and security appliances.",
      "Supported vulnerability assessments and internal research on network security protocols and defensive architecture.",
    ],
  },
];
