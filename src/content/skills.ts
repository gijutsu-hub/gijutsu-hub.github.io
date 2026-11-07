import type { SkillGroup, StandardRef } from "./types";

export const skillGroups: SkillGroup[] = [
  {
    group: "Red Team & Adversary Emulation",
    items: [
      "MITRE ATT&CK TTPs",
      "C2 infrastructure",
      "Redirectors & domain fronting",
      "Malleable profiles",
      "Payload & loader development",
      "AMSI / ETW / EDR bypass",
      "Reflective loading",
      "Privilege escalation",
      "Lateral movement",
      "Kerberos abuse",
      "Credential harvesting",
      "Exfiltration",
    ],
  },
  {
    group: "Penetration Testing",
    items: [
      "OWASP Top 10 / ASVS",
      "REST / GraphQL / SOAP",
      "iOS & Android",
      "Thick client",
      "Internal & external network",
      "Active Directory",
      "Firewall & perimeter",
      "Wireless",
    ],
  },
  {
    group: "Detection & Response",
    items: [
      "ATT&CK-mapped telemetry",
      "Sophos EDR",
      "SOC dashboarding",
      "Alert triage & correlation",
      "Threat-intelligence integration",
      "Dark-web monitoring",
      "Log & traffic analysis",
    ],
  },
  {
    group: "AppSec & Supply Chain",
    items: [
      "SAST",
      "DAST",
      "SCA",
      "SBOM",
      "Secure code review",
      "Threat modeling (CIA / STRIDE)",
      "Shift-left CI/CD",
      "Server hardening",
    ],
  },
  {
    group: "Cloud Security",
    items: [
      "AWS",
      "GCP",
      "CSPM",
      "IAM privilege escalation",
      "Bucket exposure",
      "Security-group review",
      "CIS cloud benchmarks",
    ],
  },
  {
    group: "Tools & Platforms",
    items: [
      "Burp Suite",
      "Metasploit",
      "Cobalt Strike-style C2",
      "Nmap",
      "Amass v5",
      "nuclei",
      "httpx",
      "MobSF",
      "Nessus Pro",
      "Checkmarx",
      "Snyk",
      "PyTorch",
      "Ollama",
    ],
  },
  {
    group: "Languages",
    items: [
      "C",
      "C++",
      "Go",
      "Rust",
      "Python",
      "SQL",
      "JavaScript",
      "TypeScript",
      "Node.js",
      "React / Next.js",
      "Solidity",
      "Bash",
    ],
  },
];

export const standards: StandardRef[] = [
  {
    framework: "MITRE ATT&CK",
    appliedTo: "Operation planning, emulation scoping, detection-coverage mapping",
  },
  {
    framework: "OWASP Top 10 / ASVS / API Top 10",
    appliedTo: "Web, API and application assessment methodology",
  },
  { framework: "CVSS 3.1 & CWE", appliedTo: "Severity scoring and classification on every finding" },
  { framework: "SEBI CSCRF", appliedTo: "BFSI client reporting and audit readiness" },
  { framework: "CERT-In", appliedTo: "Regulatory reporting alignment for Indian entities" },
  { framework: "ISO 27001", appliedTo: "Control mapping in client deliverables" },
  { framework: "NIST CSF", appliedTo: "Programme-level security posture framing" },
  { framework: "CIS Benchmarks", appliedTo: "Cloud posture, server hardening, configuration review" },
];


export const certifications = [
  { name: "Certified Ethical Hacker (CEH)", issuer: "EC-Council", status: "Certified" },
  {
    name: "Offensive Security Certified Professional (OSCP)",
    issuer: "Offensive Security",
    status: "In progress",
  },
] as const;

export const education = {
  degree: "Integrated M.Tech, Computer Science & Engineering",
  specialisation: "Specialisation in Cybersecurity",
  institution: "Vellore Institute of Technology (VIT), Bhopal",
  period: "2020–2025",
} as const;
