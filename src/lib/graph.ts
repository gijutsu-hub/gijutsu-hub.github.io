import * as THREE from "three";

/**
 * Geometry for the hero scene.
 *
 * The scene is an attack-surface graph: nodes distributed over a sphere, edges
 * between near neighbours, and packets travelling the edges. It is built from
 * scratch rather than loaded as a model so it stays a few KB and so the edge
 * topology is real — the pulses travel actual adjacency, not a baked animation.
 */

export interface GraphData {
  /** Node positions, flat xyz triples. */
  nodes: Float32Array;
  /** Per-node phase offset, so the twinkle is not synchronised. */
  phases: Float32Array;
  /** Per-node scale multiplier; hub nodes render larger. */
  scales: Float32Array;
  /** Edge endpoints as flat xyz pairs, ready for LineSegments. */
  edgePositions: Float32Array;
  /** Index pairs into `nodes`, used to drive packet travel. */
  edgePairs: Uint16Array;
  nodeCount: number;
  edgeCount: number;
}

/**
 * Fibonacci sphere. Gives near-uniform coverage without the pole clustering a
 * naive lat/long distribution produces.
 */
function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius,
      ),
    );
  }

  return points;
}

/** Deterministic PRNG so the layout is identical on every render and reload. */
function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildGraph(nodeCount: number, radius = 2.4): GraphData {
  const random = mulberry32(0x5ec);
  const base = fibonacciSphere(nodeCount, radius);

  // Push each node in or out a little so the result reads as a structure
  // rather than a perfect shell.
  const points = base.map((p) => p.multiplyScalar(0.82 + random() * 0.3));

  const nodes = new Float32Array(nodeCount * 3);
  const phases = new Float32Array(nodeCount);
  const scales = new Float32Array(nodeCount);

  points.forEach((p, i) => {
    nodes[i * 3] = p.x;
    nodes[i * 3 + 1] = p.y;
    nodes[i * 3 + 2] = p.z;
    phases[i] = random() * Math.PI * 2;
    // A minority of nodes are hubs. Uniform node sizes look synthetic.
    scales[i] = random() > 0.86 ? 1.9 + random() * 0.8 : 0.6 + random() * 0.5;
  });

  // Connect near neighbours. The threshold is tuned so the graph is connected
  // enough to read as a network but sparse enough to see through.
  const threshold = radius * 0.62;
  const pairs: number[] = [];

  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      if (points[i].distanceTo(points[j]) < threshold) {
        pairs.push(i, j);
      }
    }
  }

  const edgeCount = pairs.length / 2;
  const edgePositions = new Float32Array(edgeCount * 6);
  const edgePairs = new Uint16Array(pairs);

  for (let e = 0; e < edgeCount; e++) {
    const a = pairs[e * 2];
    const b = pairs[e * 2 + 1];
    edgePositions.set([nodes[a * 3], nodes[a * 3 + 1], nodes[a * 3 + 2]], e * 6);
    edgePositions.set([nodes[b * 3], nodes[b * 3 + 1], nodes[b * 3 + 2]], e * 6 + 3);
  }

  return { nodes, phases, scales, edgePositions, edgePairs, nodeCount, edgeCount };
}

export interface Packet {
  edge: number;
  t: number;
  speed: number;
}

/** Packets start spread across random edges so none of them move in lockstep. */
export function seedPackets(count: number, edgeCount: number): Packet[] {
  const random = mulberry32(0xf00d);
  return Array.from({ length: count }, () => ({
    edge: Math.floor(random() * edgeCount),
    t: random(),
    speed: 0.22 + random() * 0.5,
  }));
}
