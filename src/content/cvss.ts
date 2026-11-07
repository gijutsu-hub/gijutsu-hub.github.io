/**
 * CVSS 3.1 scoring, shown as method rather than as a client finding.
 *
 * The worked examples below are illustrative vulnerability classes, not
 * findings from any engagement. Every real finding is under NDA; publishing
 * one, even anonymised, is how consultancies lose clients. What is shown here
 * is the scoring discipline — the vector, how each metric lands, and why the
 * number comes out where it does.
 */

export type MetricKey = "AV" | "AC" | "PR" | "UI" | "S" | "C" | "I" | "A";

export interface MetricDef {
  key: MetricKey;
  name: string;
  /** Possible values, keyed by the vector abbreviation. */
  values: Record<string, string>;
}

export const METRICS: MetricDef[] = [
  { key: "AV", name: "Attack Vector", values: { N: "Network", A: "Adjacent", L: "Local", P: "Physical" } },
  { key: "AC", name: "Attack Complexity", values: { L: "Low", H: "High" } },
  { key: "PR", name: "Privileges Required", values: { N: "None", L: "Low", H: "High" } },
  { key: "UI", name: "User Interaction", values: { N: "None", R: "Required" } },
  { key: "S", name: "Scope", values: { U: "Unchanged", C: "Changed" } },
  { key: "C", name: "Confidentiality", values: { H: "High", L: "Low", N: "None" } },
  { key: "I", name: "Integrity", values: { H: "High", L: "Low", N: "None" } },
  { key: "A", name: "Availability", values: { H: "High", L: "Low", N: "None" } },
];

export type Severity = "Critical" | "High" | "Medium" | "Low";

export interface ScoredExample {
  title: string;
  /** CWE classification carried on every finding alongside the vector. */
  cwe: string;
  cweName: string;
  vector: string;
  score: number;
  severity: Severity;
  /** Why the number is what it is — the part a client actually reads. */
  rationale: string;
  impact: string;
}

export const examples: ScoredExample[] = [
  {
    title: "Unauthenticated deserialisation in an exposed API endpoint",
    cwe: "CWE-502",
    cweName: "Deserialization of Untrusted Data",
    vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
    score: 10.0,
    severity: "Critical",
    rationale:
      "Reachable from the internet with no credentials and no user action, and the payload executes as the service account. Scope is Changed because the compromise crosses from the application into the host and the wider segment.",
    impact:
      "Full compromise of the application tier and a foothold for lateral movement into the internal estate.",
  },
  {
    title: "Broken object-level authorisation on a customer records endpoint",
    cwe: "CWE-639",
    cweName: "Authorization Bypass Through User-Controlled Key",
    vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:L/A:N",
    score: 8.5,
    severity: "High",
    rationale:
      "Any authenticated customer can enumerate identifiers and read other customers' records. Confidentiality is High across the dataset; integrity is Low because the endpoint permits limited writes; availability is untouched.",
    impact:
      "Bulk disclosure of personal data, with the regulatory exposure that follows under India's data-protection regime.",
  },
  {
    title: "Stored cross-site scripting in an administrative console",
    cwe: "CWE-79",
    cweName: "Improper Neutralization of Input During Web Page Generation",
    vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:L/A:N",
    score: 7.6,
    severity: "High",
    rationale:
      "Requires a low-privileged account to plant the payload and an administrator to view the page, so User Interaction is Required. Scope is Changed because execution lands in the victim's browser context, not the vulnerable component.",
    impact:
      "Session theft against administrators, escalating a low-privileged account to full console control.",
  },
  {
    title: "Overly permissive cloud storage bucket policy",
    cwe: "CWE-732",
    cweName: "Incorrect Permission Assignment for Critical Resource",
    vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N",
    score: 7.5,
    severity: "High",
    rationale:
      "Public read with no authentication. Integrity and availability are None because the policy grants read only — a write grant would push this to Critical.",
    impact: "Disclosure of everything held in the bucket, discoverable by routine internet-wide scanning.",
  },
];

export const SEVERITY_BANDS: Array<{ name: Severity; min: number; max: number }> = [
  { name: "Low", min: 0.1, max: 3.9 },
  { name: "Medium", min: 4.0, max: 6.9 },
  { name: "High", min: 7.0, max: 8.9 },
  { name: "Critical", min: 9.0, max: 10.0 },
];

/** Splits "CVSS:3.1/AV:N/..." into ordered [key, value] pairs, dropping the prefix. */
export function parseVector(vector: string): Array<{ key: MetricKey; value: string; label: string }> {
  return vector
    .split("/")
    .slice(1)
    .map((part) => {
      const [key, value] = part.split(":") as [MetricKey, string];
      const def = METRICS.find((m) => m.key === key);
      return { key, value, label: def?.values[value] ?? value };
    });
}
