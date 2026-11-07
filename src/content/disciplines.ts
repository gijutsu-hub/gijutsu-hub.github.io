import type { Discipline } from "./types";

export const disciplines: Discipline[] = [
  {
    id: "vapt",
    label: "VAPT",
    title: "Vulnerability Assessment & Penetration Testing",
    lede: "100+ engagements delivered end to end, with sole report sign-off authority.",
    points: [
      {
        heading: "Lifecycle owned",
        body: "Pre-engagement scoping and rules of engagement, threat modeling, black/grey/white-box testing, exploitation and chaining, post-exploitation, reporting, patch verification, revalidation, remediation advisory.",
      },
      {
        heading: "Asset classes",
        body: "Web (OWASP Top 10, ASVS), REST/GraphQL/SOAP APIs, mobile on iOS and Android, thick-client, internal and external network, Active Directory, firewall and perimeter, wireless.",
      },
      {
        heading: "Delivery standard",
        body: "Every finding carries a CVSS 3.1 vector, CWE classification, a reproducible PoC chain and a business-impact narrative written for a non-technical reader.",
      },
      {
        heading: "Audit alignment",
        body: "Reports map to SEBI CSCRF, CERT-In and ISO 27001 controls, supporting client audit readiness and security empanelment.",
      },
      {
        heading: "Closing the loop",
        body: "Patch verification and revalidation confirm remediation rather than assuming it. Report QA and the delivery pipeline are personally managed; nothing ships without sign-off.",
      },
    ],
  },
  {
    id: "red-team",
    label: "Red Team",
    title: "Red Team Operations & Adversary Emulation",
    lede: "Full-kill-chain operations aligned to MITRE ATT&CK, run against production environments under formal rules of engagement.",
    points: [
      {
        heading: "Reconnaissance & resource development",
        body: "OSINT-driven recon and attack-surface mapping; large-scale automated enumeration through Amass v5 → httpx → nuclei. Dark-web monitoring for credential exposure feeds target selection.",
      },
      {
        heading: "Command & control",
        body: "Stands up and operates resilient C2: redirectors, domain fronting and malleable profiles designed to survive takedown and blend with legitimate traffic.",
      },
      {
        heading: "Initial access & execution",
        body: "Bespoke initial-access payloads and loaders, built in-house where commercial tooling is signatured or blocked.",
      },
      {
        heading: "Defense evasion",
        body: "AV/EDR evasion through AMSI and ETW patching, API unhooking, and in-memory and reflective loading that avoids touching disk.",
      },
      {
        heading: "Escalation & lateral movement",
        body: "Local and domain privilege escalation, lateral movement through the estate, Kerberos abuse and credential harvesting against Active Directory, then controlled exfiltration demonstrating realised impact without operational disruption.",
      },
      {
        heading: "Reporting",
        body: "Each operation is reported as an ATT&CK-mapped narrative: the technique chain used, what the defensive stack caught, what it missed, and the changes that close each gap.",
      },
    ],
  },
  {
    id: "detection",
    label: "Detection & IR",
    title: "Detection Engineering, SOC & Incident Response",
    lede: "Detection measured from the attacker's side: coverage is what the exercise did or did not trigger.",
    points: [
      {
        heading: "ATT&CK-mapped telemetry",
        body: "Feeds technique-tagged telemetry from live engagements into Sophos EDR SOC dashboards, so observed behaviour is attributable to a specific technique rather than an opaque alert.",
      },
      {
        heading: "Coverage assessment",
        body: "Establishes which techniques produce signal and which evade it — AMSI/ETW patching, unhooking, reflective loading, Kerberos abuse, credential harvesting — and documents the blind spots as actionable gaps.",
      },
      {
        heading: "Triage & correlation",
        body: "Designed automated alert triage and correlation into CtrlSec's unified SOC-facing console, fusing real-time threat-intelligence feeds with adversarial-simulation output.",
      },
      {
        heading: "Investigation",
        body: "Root-cause security debugging across enterprise application stacks; reverse-engineers disclosed CVEs and reproduces them as deterministic, instrumented test cases.",
      },
      {
        heading: "Artefact knowledge",
        body: "Having built the loaders, in-memory execution and evasion tradecraft used in engagements, brings direct knowledge of what those techniques leave behind — and what they do not.",
      },
    ],
  },
  {
    id: "appsec",
    label: "AppSec",
    title: "Application Security & Secure Code Review",
    lede: "Programme-level AppSec — building the tooling and the gates, not only reporting findings against them.",
    points: [
      {
        heading: "Tooling built and embedded",
        body: "Built and integrated SAST and SCA tooling (Checkmarx, Snyk) into enterprise workflows, authoring the custom query rules, sink/source definitions and payload libraries that make the output usable.",
      },
      {
        heading: "Shift-left gates",
        body: "Security gates embedded directly into CI/CD — automated scanning, dependency auditing and policy enforcement — so failures surface at commit time rather than at assessment time.",
      },
      {
        heading: "Taint-flow analysis",
        body: "Engineered a deep-learning SAST engine performing cross-function taint-style detection across 35 vulnerability classes and 9 languages, which meant modeling how data actually flows between functions, not just within them.",
      },
      {
        heading: "Threat modeling",
        body: "CIA-triad and STRIDE threat modeling across enterprise stacks. Threat models drive engagement scoping rather than following it.",
      },
      {
        heading: "Supply chain",
        body: "SBOM generation and SCA analysis: transitive dependency enumeration, CVE-mapped known-vulnerable components, and license and integrity risk.",
      },
      {
        heading: "Developer enablement",
        body: "Findings ship with the fix, the pattern to avoid and the detection rule that catches recurrences, so the same defect class does not return next release.",
      },
    ],
  },
  {
    id: "cloud",
    label: "Cloud",
    title: "Cloud & Infrastructure Security",
    lede: "Posture work across AWS and GCP multi-cloud estates, down to the network and the host.",
    points: [
      {
        heading: "Posture management",
        body: "CSPM across AWS and GCP, with continuous misconfiguration review against CIS cloud benchmarks.",
      },
      {
        heading: "Identity & access",
        body: "IAM policy auditing and privilege-escalation path analysis — mapping which roles can reach which, and how an attacker chains them.",
      },
      {
        heading: "Exposure",
        body: "S3 and bucket exposure review, security-group analysis, public-surface assessment.",
      },
      {
        heading: "Network & perimeter",
        body: "Internal and external network penetration testing, firewall and perimeter assessment, firewall rule design, segmentation with VLANs and ACLs.",
      },
      {
        heading: "Hardening",
        body: "Server configuration hardening aligned to CIS Benchmarks, integrated into deployment pipelines rather than applied after the fact.",
      },
    ],
  },
  {
    id: "drills",
    label: "Drills",
    title: "Cyber Drills & Adversary Simulation",
    lede: "Exercise design and operation, from competitive attack-defense events to client-facing simulation.",
    points: [
      {
        heading: "Exercise operation",
        body: "Designed, built and ran 20+ CTF events across Jeopardy and Attack-Defense formats — authoring challenges in web exploitation, binary/pwn, reverse engineering, cryptography and forensics, standing up infrastructure and running live scoring for 1000+ participants. Sponsored by Offensive Security, Bugcrowd and HackerOne.",
      },
      {
        heading: "Client simulation",
        body: "Scenario-based emulation against live client estates, aligned to ATT&CK TTPs and scoped under formal rules of engagement.",
      },
      {
        heading: "Control validation",
        body: "Simulation results test whether deployed controls actually fire: EDR detection coverage, segmentation boundaries, privilege-escalation paths and credential-exposure routes are each probed, and gaps recorded against the technique that exposed them.",
      },
      {
        heading: "Purple-team loop",
        body: "ATT&CK-mapped telemetry from emulation runs goes back to defenders, turning each offensive exercise into detection-coverage evidence.",
      },
    ],
  },
];
