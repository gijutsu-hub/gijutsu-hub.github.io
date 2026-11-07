/**
 * Command-and-control topologies, as small network diagrams.
 *
 * These are the shapes the red team work actually uses, drawn rather than
 * described: node coordinates are on a 0–100 grid and the components scale
 * them to whatever box they land in.
 *
 * Illustrative of technique, not of any client's network.
 */

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  /** Drives size and colour. */
  role: "operator" | "relay" | "victim" | "defended";
}

export interface Topology {
  id: string;
  name: string;
  /** ATT&CK technique this shape corresponds to, where one does. */
  technique?: { id: string; name: string };
  summary: string;
  /** What a defender sees, or fails to see. */
  defenderNote: string;
  nodes: GraphNode[];
  /** Index pairs into `nodes`. */
  edges: Array<[number, number]>;
}

export const topologies: Topology[] = [
  {
    id: "direct",
    name: "Direct C2",
    technique: { id: "T1071", name: "Application Layer Protocol" },
    summary:
      "Implants beacon straight to the team server. Simple, fast to stand up, and the first thing a competent SOC blocks.",
    defenderNote:
      "One hostile IP in the egress logs, shared by every implant. Block it and the whole operation stops.",
    nodes: [
      { id: "op", x: 50, y: 12, role: "operator" },
      { id: "v1", x: 18, y: 82, role: "victim" },
      { id: "v2", x: 40, y: 88, role: "victim" },
      { id: "v3", x: 62, y: 88, role: "victim" },
      { id: "v4", x: 84, y: 80, role: "victim" },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ],
  },
  {
    id: "redirector",
    name: "Redirector chain",
    technique: { id: "T1090", name: "Proxy" },
    summary:
      "Traffic passes through disposable relays before reaching the team server. Burning a relay costs an afternoon, not the engagement.",
    defenderNote:
      "Blocking what you can see removes a relay, not the operator. The real infrastructure was never in your logs.",
    nodes: [
      { id: "op", x: 50, y: 10, role: "operator" },
      { id: "r1", x: 26, y: 42, role: "relay" },
      { id: "r2", x: 50, y: 48, role: "relay" },
      { id: "r3", x: 74, y: 42, role: "relay" },
      { id: "v1", x: 16, y: 86, role: "victim" },
      { id: "v2", x: 40, y: 90, role: "victim" },
      { id: "v3", x: 62, y: 90, role: "victim" },
      { id: "v4", x: 86, y: 86, role: "victim" },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 4],
      [1, 5],
      [2, 5],
      [2, 6],
      [3, 6],
      [3, 7],
    ],
  },
  {
    id: "fronted",
    name: "Domain fronting",
    technique: { id: "T1090", name: "Proxy" },
    summary:
      "Beacons address a reputable CDN edge; the request is re-routed inside to the operator. On the wire it resembles ordinary traffic to a trusted host.",
    defenderNote:
      "TLS SNI names a domain nobody will block. Catching it means inspecting what the connection does, not where it claims to go.",
    nodes: [
      { id: "op", x: 50, y: 10, role: "operator" },
      { id: "cdn", x: 50, y: 45, role: "relay" },
      { id: "v1", x: 18, y: 84, role: "victim" },
      { id: "v2", x: 38, y: 90, role: "victim" },
      { id: "v3", x: 62, y: 90, role: "victim" },
      { id: "v4", x: 82, y: 84, role: "victim" },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
    ],
  },
  {
    id: "peer",
    name: "Peer-to-peer mesh",
    technique: { id: "T1570", name: "Lateral Tool Transfer" },
    summary:
      "Only one host egresses; the rest relay internally over SMB or named pipes. Segmented networks are crossed from the inside.",
    defenderNote:
      "Perimeter telemetry shows a single quiet connection. The rest is east-west traffic most estates do not inspect at all.",
    nodes: [
      { id: "op", x: 50, y: 10, role: "operator" },
      { id: "v1", x: 50, y: 40, role: "victim" },
      { id: "v2", x: 24, y: 62, role: "victim" },
      { id: "v3", x: 76, y: 62, role: "victim" },
      { id: "v4", x: 34, y: 88, role: "victim" },
      { id: "v5", x: 66, y: 88, role: "victim" },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [2, 3],
      [2, 4],
      [3, 5],
      [4, 5],
    ],
  },
  {
    id: "segmented",
    name: "Segmented estate",
    summary:
      "What the defence is supposed to look like: VLAN boundaries and access control lists stopping a foothold from reaching anything that matters.",
    defenderNote:
      "Segmentation is the control that converts one compromised host into one compromised host, instead of a domain.",
    nodes: [
      { id: "op", x: 50, y: 10, role: "operator" },
      { id: "v1", x: 24, y: 44, role: "victim" },
      { id: "d1", x: 52, y: 58, role: "defended" },
      { id: "d2", x: 78, y: 44, role: "defended" },
      { id: "d3", x: 38, y: 88, role: "defended" },
      { id: "d4", x: 70, y: 88, role: "defended" },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [2, 4],
      [3, 5],
    ],
  },
];
