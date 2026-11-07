/**
 * MITRE ATT&CK Enterprise coverage.
 *
 * Depth is claimed only where the engagement work backs it:
 *
 *   3 "core"     — named explicitly in the engagement record. Operated
 *                  routinely, with custom tooling where needed.
 *   2 "applied"  — exercised as part of delivering the above, but not a
 *                  specialism.
 *   1 "assessed" — tested for and reported on from the defensive side rather
 *                  than operated offensively.
 *
 * A tactic with no cells at depth 3 is not padded to look complete. Columns
 * are the fourteen Enterprise tactics in kill-chain order, so the gaps are
 * visible — which is the honest way to show coverage.
 */

export type Depth = 0 | 1 | 2 | 3;

export interface Technique {
  /** ATT&CK technique ID, e.g. "T1059". Links to attack.mitre.org. */
  id: string;
  name: string;
  depth: Depth;
  /** Shown on hover. Ties the technique to the actual work. */
  note?: string;
}

export interface Tactic {
  id: string;
  name: string;
  /** Short label for the narrow column header. */
  short: string;
  techniques: Technique[];
}

export const DEPTH_LABEL: Record<Exclude<Depth, 0>, string> = {
  3: "Core",
  2: "Applied",
  1: "Assessed",
};

export const tactics: Tactic[] = [
  {
    id: "TA0043",
    name: "Reconnaissance",
    short: "Recon",
    techniques: [
      { id: "T1595", name: "Active Scanning", depth: 3, note: "Amass, httpx and nuclei pipelines run continuously, not once per engagement." },
      { id: "T1592", name: "Gather Victim Host Information", depth: 3, note: "Service fingerprinting across the external estate." },
      { id: "T1589", name: "Gather Victim Identity Information", depth: 2, note: "OSINT and dark-web monitoring for credential exposure." },
      { id: "T1590", name: "Gather Victim Network Information", depth: 2, note: "Subdomain enumeration and attack-surface mapping." },
    ],
  },
  {
    id: "TA0042",
    name: "Resource Development",
    short: "Resource Dev",
    techniques: [
      { id: "T1583", name: "Acquire Infrastructure", depth: 3, note: "Redirectors and domain-fronted C2 stood up per engagement." },
      { id: "T1587", name: "Develop Capabilities", depth: 3, note: "Bespoke payloads and loaders where commercial tooling is signatured." },
      { id: "T1588", name: "Obtain Capabilities", depth: 2 },
    ],
  },
  {
    id: "TA0001",
    name: "Initial Access",
    short: "Initial Access",
    techniques: [
      { id: "T1190", name: "Exploit Public-Facing Application", depth: 3, note: "Primary route on web and API engagements." },
      { id: "T1566", name: "Phishing", depth: 2, note: "Initial-access payload delivery under agreed rules of engagement." },
      { id: "T1078", name: "Valid Accounts", depth: 3, note: "Harvested or exposed credentials replayed against the estate." },
      { id: "T1133", name: "External Remote Services", depth: 2 },
    ],
  },
  {
    id: "TA0002",
    name: "Execution",
    short: "Execution",
    techniques: [
      { id: "T1059", name: "Command and Scripting Interpreter", depth: 3 },
      { id: "T1203", name: "Exploitation for Client Execution", depth: 2, note: "Reproduced from disclosed CVEs as instrumented PoCs." },
      { id: "T1106", name: "Native API", depth: 2, note: "Direct syscalls and unhooked API use in custom loaders." },
    ],
  },
  {
    id: "TA0003",
    name: "Persistence",
    short: "Persistence",
    techniques: [
      { id: "T1053", name: "Scheduled Task/Job", depth: 2 },
      { id: "T1547", name: "Boot or Logon Autostart Execution", depth: 2 },
      { id: "T1078", name: "Valid Accounts", depth: 2 },
    ],
  },
  {
    id: "TA0004",
    name: "Privilege Escalation",
    short: "Priv Esc",
    techniques: [
      { id: "T1068", name: "Exploitation for Privilege Escalation", depth: 3 },
      { id: "T1134", name: "Access Token Manipulation", depth: 2 },
      { id: "T1548", name: "Abuse Elevation Control Mechanism", depth: 2 },
      { id: "T1484", name: "Domain Policy Modification", depth: 1 },
    ],
  },
  {
    id: "TA0005",
    name: "Defense Evasion",
    short: "Defense Evasion",
    techniques: [
      { id: "T1562", name: "Impair Defenses", depth: 3, note: "AMSI and ETW patching to blind inline telemetry." },
      { id: "T1620", name: "Reflective Code Loading", depth: 3, note: "In-memory execution that never touches disk." },
      { id: "T1055", name: "Process Injection", depth: 3 },
      { id: "T1027", name: "Obfuscated Files or Information", depth: 3 },
      { id: "T1070", name: "Indicator Removal", depth: 2 },
      { id: "T1574", name: "Hijack Execution Flow", depth: 2, note: "API unhooking to restore clean syscall paths." },
    ],
  },
  {
    id: "TA0006",
    name: "Credential Access",
    short: "Cred Access",
    techniques: [
      { id: "T1003", name: "OS Credential Dumping", depth: 3 },
      { id: "T1558", name: "Steal or Forge Kerberos Tickets", depth: 3, note: "Kerberoasting and delegation abuse against Active Directory." },
      { id: "T1555", name: "Credentials from Password Stores", depth: 2 },
      { id: "T1110", name: "Brute Force", depth: 2 },
    ],
  },
  {
    id: "TA0007",
    name: "Discovery",
    short: "Discovery",
    techniques: [
      { id: "T1087", name: "Account Discovery", depth: 3 },
      { id: "T1482", name: "Domain Trust Discovery", depth: 3 },
      { id: "T1046", name: "Network Service Discovery", depth: 3 },
      { id: "T1018", name: "Remote System Discovery", depth: 2 },
      { id: "T1526", name: "Cloud Service Discovery", depth: 2, note: "IAM and storage enumeration during CSPM work." },
    ],
  },
  {
    id: "TA0008",
    name: "Lateral Movement",
    short: "Lateral Movement",
    techniques: [
      { id: "T1021", name: "Remote Services", depth: 3 },
      { id: "T1550", name: "Use Alternate Authentication Material", depth: 3, note: "Pass-the-ticket and pass-the-hash through the estate." },
      { id: "T1570", name: "Lateral Tool Transfer", depth: 2 },
    ],
  },
  {
    id: "TA0009",
    name: "Collection",
    short: "Collection",
    techniques: [
      { id: "T1005", name: "Data from Local System", depth: 2 },
      { id: "T1560", name: "Archive Collected Data", depth: 2 },
      { id: "T1213", name: "Data from Information Repositories", depth: 1 },
    ],
  },
  {
    id: "TA0011",
    name: "Command and Control",
    short: "C2",
    techniques: [
      { id: "T1071", name: "Application Layer Protocol", depth: 3, note: "Malleable profiles shaped to blend with legitimate traffic." },
      { id: "T1090", name: "Proxy", depth: 3, note: "Redirector chains and domain fronting to survive takedown." },
      { id: "T1572", name: "Protocol Tunneling", depth: 2 },
      { id: "T1573", name: "Encrypted Channel", depth: 2 },
    ],
  },
  {
    id: "TA0010",
    name: "Exfiltration",
    short: "Exfiltration",
    techniques: [
      { id: "T1041", name: "Exfiltration Over C2 Channel", depth: 3, note: "Controlled, to demonstrate impact without disruption." },
      { id: "T1567", name: "Exfiltration Over Web Service", depth: 2 },
      { id: "T1030", name: "Data Transfer Size Limits", depth: 1 },
    ],
  },
  {
    id: "TA0040",
    name: "Impact",
    short: "Impact",
    techniques: [
      { id: "T1486", name: "Data Encrypted for Impact", depth: 1, note: "Assessed and reported on; never executed against a client estate." },
      { id: "T1498", name: "Network Denial of Service", depth: 1, note: "Explicitly out of scope on every engagement." },
    ],
  },
];

export function techniqueUrl(id: string): string {
  // Sub-technique IDs use a dot; ATT&CK URLs use a slash.
  return `https://attack.mitre.org/techniques/${id.replace(".", "/")}/`;
}

/** Totals for the legend, computed rather than hardcoded so they stay true. */
export function coverageSummary() {
  const all = tactics.flatMap((t) => t.techniques);
  return {
    tactics: tactics.length,
    techniques: all.length,
    core: all.filter((t) => t.depth === 3).length,
    applied: all.filter((t) => t.depth === 2).length,
    assessed: all.filter((t) => t.depth === 1).length,
  };
}
