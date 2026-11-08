/**
 * Resume content — the ATS-facing document.
 *
 * Deliberately NOT the same prose as the CV sections. Applicant tracking
 * systems parse this, and they reward different writing than a human reader
 * does:
 *
 *   - Standard section headings ("Work Experience", not "Track record").
 *     Parsers match headings against a fixed vocabulary; a clever heading gets
 *     the whole section dropped.
 *   - Acronyms expanded on first use, because a recruiter filtering on
 *     "penetration testing" will not match a document that only says "VAPT".
 *   - Bullets that open with a verb and carry a number where one exists.
 *   - No tables, columns, text boxes, headers or footers. Parsers read those
 *     out of order or not at all.
 *
 * ON BULLET SHAPE
 * Bullets follow Google's published guidance: "Accomplished [X] as measured by
 * [Y], by doing [Z]." Every number here is one that exists — engagement
 * counts, CVE count, corpus sizes, participant counts. Nothing is estimated
 * into existence to fill the pattern. Where no honest metric exists, the
 * bullet carries concrete scope instead of a fabricated percentage.
 *
 * The site renders this same data at /resume, so the page and the PDF cannot
 * drift apart.
 */

import { citation, publications } from "./publications";

export interface ResumeRole {
  title: string;
  org: string;
  location: string;
  dates: string;
  bullets: string[];
}

export interface ResumeSection {
  heading: string;
  items: string[];
}

export const resumeHeader = {
  name: "Sumon Nath",
  /** Kept keyword-dense; this line is heavily weighted by most parsers. */
  title: "Offensive Security Engineer | Penetration Testing (VAPT) Lead | Red Team Operator",
  location: "Bengaluru, India",
  email: "snath2973@gmail.com",
  phone: "+91 8360207436",
  linkedin: "linkedin.com/in/gijutsu-hub",
  github: "github.com/gijutsu-hub",
} as const;

export const resumeSummary =
  "Offensive security engineer with 3+ years and 100+ penetration tests delivered across banking and financial services (BFSI), fintech, ecommerce, government and enterprise environments. Microsoft Most Valuable Security Researcher 2022 and 2023, with five assigned Common Vulnerabilities and Exposures (CVE) identifiers and vulnerabilities accepted by Microsoft, Google, Apple and NASA. Runs full lifecycle Vulnerability Assessment and Penetration Testing (VAPT) and MITRE ATT&CK-aligned red team operations against web, Application Programming Interface (API), mobile, thick-client and network targets — and builds the defensive counterpart: secure code review, Static Application Security Testing (SAST) tooling, Continuous Integration/Continuous Deployment (CI/CD) security gates and cloud security posture management on Amazon Web Services (AWS) and Google Cloud Platform (GCP).";

/** The one-page variant needs this to fit in roughly three lines. */
export const resumeSummaryShort =
  "Offensive security engineer with 3+ years and 100+ penetration tests delivered across banking and financial services (BFSI), fintech, government and enterprise environments. Microsoft Most Valuable Security Researcher 2022 and 2023, five assigned Common Vulnerabilities and Exposures (CVE) identifiers, and vulnerabilities accepted by Microsoft, Google, Apple and NASA. Full lifecycle Vulnerability Assessment and Penetration Testing (VAPT), MITRE ATT&CK red team operations, secure code review and cloud security engineering.";

/**
 * Sits directly under the summary.
 *
 * The rarest things in this document — a Microsoft award, assigned CVEs,
 * acceptances at four named vendors, a peer-reviewed publication — were
 * previously on page two under "Achievements", where a recruiter skimming for
 * eight seconds never reached them. Nothing here is new information; it is
 * the same facts, moved to where they get read.
 */
export const resumeHighlights: string[] = [
  "Microsoft Most Valuable Security Researcher (MVR), 2022 and 2023 — awarded for high-impact vulnerability submissions to Microsoft products.",
  "Five CVE identifiers assigned through coordinated vendor disclosure, plus a contribution to a MITRE Common Weakness Enumeration (CWE) entry.",
  "Vulnerabilities accepted by Microsoft, Google, Apple and NASA across 100+ public and private bug bounty programs.",
  "First-author peer-reviewed book chapter published by Springer Nature (879 accesses as of November 2026).",
];

export const resumeRoles: ResumeRole[] = [
  {
    title: "Senior Security Researcher, Team Lead",
    org: "Alphawave Technology Pvt Ltd (Mitigata Security)",
    location: "Bengaluru, India",
    dates: "Jan 2026 - Present",
    bullets: [
      "Delivered penetration testing across 100+ enterprise clients covering web, REST/GraphQL/SOAP APIs, mobile (iOS and Android), internal and external network, Active Directory and perimeter firewall scope, holding sole technical sign-off on every report released.",
      "Cut time-to-first-finding on every engagement by engineering a reconnaissance and attack-surface automation pipeline (Amass, httpx, nuclei) that performs continuous asset enumeration and vulnerability chaining in place of manual discovery.",
      "Executed MITRE ATT&CK-aligned adversary emulation end to end: stood up command-and-control (C2) infrastructure with redirectors and domain fronting, defeated antivirus and Endpoint Detection and Response (EDR) through AMSI/ETW patching and reflective loading, then chained Kerberos abuse, credential harvesting and lateral movement to controlled exfiltration.",
      "Restored testing coverage against EDR-protected estates by writing custom offensive tooling, payloads and loaders in Python, C and Go where signatured commercial tooling was blocked.",
      "Produced audit-grade deliverables accepted directly by regulated BFSI and fintech clients by mapping every finding to Common Vulnerability Scoring System (CVSS) 3.1 vectors, CWE classes and SEBI CSCRF, CERT-In and ISO 27001 controls.",
      "Extended assessment scope into cloud by running Cloud Security Posture Management (CSPM) across AWS and GCP — Identity and Access Management (IAM) privilege-escalation path analysis, storage exposure review and CIS Benchmark assessment — alongside Software Bill of Materials (SBOM) generation and Software Composition Analysis (SCA) for supply-chain risk.",
      "Led and mentored a team of security interns while owning report quality assurance, document control and the delivery pipeline end to end.",
    ],
  },
  {
    title: "Senior Software Engineer and Security Researcher",
    org: "Loginsoft Pvt Ltd",
    location: "Hyderabad, India",
    dates: "May 2024 - Nov 2025",
    bullets: [
      "Gave detection engineering a reproducible ground truth by reverse-engineering disclosed CVEs into working proof-of-concept exploits and shipping them as deterministic test cases in instrumented sandbox environments.",
      "Reduced false positives in SAST and SCA tooling (Checkmarx, Snyk) by authoring custom query rules with purpose-built sink and source definitions, widening true-positive detection coverage at the same time.",
      "Shifted security left across engineering teams by embedding automated scanning, dependency auditing and policy enforcement gates directly into CI/CD pipelines.",
      "Performed threat modeling, root-cause security debugging and vulnerability research across enterprise application stacks, aligned to CIS Benchmarks for server hardening.",
    ],
  },
  {
    title: "Security Intern",
    org: "Centre of Excellence in Cyber Security, VIT Bhopal",
    location: "Bhopal, India",
    dates: "Jan 2023 - Feb 2024",
    bullets: [
      "Designed and operated 20+ Capture The Flag (CTF) events in Jeopardy and Attack-Defense formats for 1,000+ participants, authoring challenges in web exploitation, binary exploitation, reverse engineering, cryptography and forensics, sponsored by Offensive Security, Bugcrowd and HackerOne.",
      "Hardened campus infrastructure through firewall rule design, network segmentation using VLANs and access control lists, and deployment of enterprise security appliances.",
      "Supported vulnerability assessments and research on network security protocols and defensive architecture.",
    ],
  },
];

export const resumeProjects: ResumeRole[] = [
  {
    title: "CtrlSec - AI-Powered Autonomous Security Operations Platform",
    org: "ctrlsec.io",
    location: "",
    dates: "",
    bullets: [
      "Architected and built a full-stack autonomous threat-detection platform single-handedly — backend services, Large Language Model (LLM) inference pipeline, threat-logic layer, compliance engine and frontend console — across Python, Go, Node.js, React and Next.js.",
      "Unified real-time threat-intelligence ingestion, automated alert triage and correlation, and adversarial-simulation workflows into one security operations centre (SOC) console.",
    ],
  },
  {
    title: "AI-SAST Scanner - Deep-Learning Vulnerability Detection",
    org: "",
    location: "",
    dates: "",
    bullets: [
      "Built a deep-learning static analysis engine in PyTorch (Convolutional Neural Network with Bidirectional Long Short-Term Memory and Transformer attention) performing cross-function taint analysis over 35 vulnerability classes across 9 programming languages.",
      "Trained it on a synthetic corpus of 887,000 labeled entries generated by an LLM-based supervision and validation framework, benchmarked against the OWASP Benchmark.",
    ],
  },
];

export const resumeSkills: ResumeSection[] = [
  {
    heading: "Penetration Testing and Red Teaming",
    items: [
      "Vulnerability Assessment and Penetration Testing (VAPT)",
      "Web Application Penetration Testing",
      "API Security Testing (REST, GraphQL, SOAP)",
      "Mobile Application Penetration Testing (iOS, Android)",
      "Network Penetration Testing",
      "Internal and External Infrastructure Testing",
      "Active Directory Security",
      "Kerberos Attacks",
      "Red Team Operations",
      "Adversary Emulation",
      "Command and Control (C2) Infrastructure",
      "Initial Access",
      "Privilege Escalation",
      "Lateral Movement",
      "EDR and Antivirus Evasion",
      "Thick Client Testing",
      "Wireless Security",
      "Firewall and Perimeter Assessment",
    ],
  },
  {
    heading: "Vulnerability Research and Reverse Engineering",
    items: [
      "Vulnerability Research",
      "Reverse Engineering",
      "Binary Exploitation",
      "Exploit Development",
      "CVE Research and Reproduction",
      "Proof of Concept (PoC) Development",
      "Coordinated Vulnerability Disclosure",
      "Bug Bounty Hunting",
      "Offensive Tooling Development",
      "Cryptography",
      "Digital Forensics",
    ],
  },
  {
    heading: "Application and Cloud Security",
    items: [
      "Secure Code Review",
      "Static Application Security Testing (SAST)",
      "Dynamic Application Security Testing (DAST)",
      "Software Composition Analysis (SCA)",
      "Software Bill of Materials (SBOM)",
      "Supply Chain Security",
      "Threat Modeling (STRIDE)",
      "Secure Software Development Lifecycle (SDLC)",
      "DevSecOps and CI/CD Security",
      "Cloud Security Posture Management (CSPM)",
      "Amazon Web Services (AWS)",
      "Google Cloud Platform (GCP)",
      "Identity and Access Management (IAM) Security",
      "Container Security",
    ],
  },
  {
    heading: "Detection and Response",
    items: [
      "Security Operations Centre (SOC)",
      "Endpoint Detection and Response (EDR)",
      "Detection Engineering",
      "MITRE ATT&CK Mapping",
      "Threat Intelligence",
      "Incident Response",
      "Log Analysis",
      "Purple Teaming",
    ],
  },
  {
    heading: "Security Engineering and Automation",
    items: [
      "Security Automation",
      "Attack Surface Management",
      "Reconnaissance Pipelines",
      "Machine Learning for Security",
      "Large Language Model (LLM) Integration",
      "Full-Stack Development",
      "REST API Design",
      "Linux System Hardening",
      "Technical Report Writing",
      "Team Leadership and Mentoring",
    ],
  },
  {
    heading: "Frameworks and Standards",
    items: [
      "MITRE ATT&CK",
      "OWASP Top 10",
      "OWASP Application Security Verification Standard (ASVS)",
      "OWASP API Security Top 10",
      "OWASP Mobile Top 10",
      "Common Vulnerability Scoring System (CVSS) 3.1",
      "Common Weakness Enumeration (CWE)",
      "NIST Cybersecurity Framework",
      "NIST SP 800-115",
      "Penetration Testing Execution Standard (PTES)",
      "ISO 27001",
      "SEBI CSCRF",
      "CERT-In",
      "CIS Benchmarks",
    ],
  },
  {
    // Ordered strongest-first: the compact build takes the top
    // `compactPlan.skillItemsPerGroup` of each group, so the order here is
    // what survives onto the one-page version.
    heading: "Offensive Security Tooling",
    items: [
      "Burp Suite",
      "Nmap",
      "Metasploit",
      "Cobalt Strike",
      "BloodHound",
      "Impacket",
      "nuclei",
      "ffuf",
      "sqlmap",
      "Amass",
      "subfinder",
      "httpx",
      "CrackMapExec",
      "Rubeus",
      "Mimikatz",
      "Hashcat",
      "Sliver",
      "MobSF",
      "Frida",
      "jadx",
      "Ghidra",
      "Wireshark",
      "Nessus",
    ],
  },
  {
    heading: "Security Engineering and Analysis Tooling",
    items: [
      "Checkmarx",
      "Snyk",
      "Semgrep",
      "Trivy",
      "Syft",
      "Grype",
      "ScoutSuite",
      "Prowler",
      "Pacu",
      "Sophos EDR",
      "Docker",
      "Git",
      "GitHub Actions",
      "PyTorch",
    ],
  },
  {
    heading: "Programming and Scripting",
    items: [
      "Python",
      "C",
      "C++",
      "Go",
      "Rust",
      "PowerShell",
      "Bash",
      "JavaScript",
      "TypeScript",
      "SQL",
      "Solidity",
      "Node.js",
      "React",
    ],
  },
];

/**
 * Taken from `publications.ts` rather than retyped, so the resume citation and
 * the site's research page can never disagree about what was published where.
 */
export const resumePublications: string[] = publications.map(
  (pub) => `${citation(pub)} DOI: ${pub.doi}`,
);

/** Same record, "et al." form — the full author list costs two lines. */
export const resumePublicationsShort: string[] = publications.map(
  (pub) =>
    `Nath, S. et al. (${pub.year}). ${pub.title}. ${pub.venue}. ${pub.publisher}. DOI: ${pub.doi}`,
);

export const resumeAchievements: string[] = [
  "Organiser and challenge author for Damncon 2021 and 2022, a 24-hour Capture The Flag event rated 17.54 on CTFtime; challenge contributor to cyhunt and BSides.",
  "Invited speaker at security events for research contributions, including by Microsoft.",
];

export const resumeCertifications: string[] = [
  "Certified Ethical Hacker (CEH) - EC-Council",
  "Offensive Security Certified Professional (OSCP) - In Progress",
];

export const resumeEducation = {
  degree: "Integrated Master of Technology (M.Tech), Computer Science and Engineering",
  specialisation: "Specialisation in Cybersecurity",
  institution: "Vellore Institute of Technology (VIT), Bhopal, India",
  dates: "2020 - 2025",
} as const;

/**
 * The one-page build.
 *
 * Google's own hiring guidance is one page per ten years of experience, so the
 * full two-page document is a mild negative there while being fine at
 * Microsoft and most job portals. Rather than maintain a second copy of the
 * prose — which would drift — the compact variant is a set of limits applied
 * to the same arrays. Bullets are already ordered strongest-first, so taking
 * the top N is a truthful cut, not a rewrite.
 */
export const compactPlan = {
  summary: resumeSummaryShort,
  highlights: 4,
  /** Per role, in `resumeRoles` order. */
  roleBullets: [4, 2, 1],
  /** Per project, in `resumeProjects` order. */
  projectBullets: 1,
  /** Skill groups to keep, by heading. The rest fold into these. */
  skillGroups: [
    "Penetration Testing and Red Teaming",
    "Vulnerability Research and Reverse Engineering",
    "Application and Cloud Security",
    "Offensive Security Tooling",
    "Programming and Scripting",
  ],
  /**
   * Items kept per skill group. The arrays are ordered with the strongest
   * first, so this is a truthful cut in the same way the bullet limits are.
   */
  skillItemsPerGroup: 10,
  /** Dropped entirely — the same facts are already in Highlights. */
  achievements: 0,
} as const;
