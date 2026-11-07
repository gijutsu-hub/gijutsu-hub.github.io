"use client";

/* eslint-disable react-hooks/immutability -- See "ON THE DISABLED LINT RULE" below. */

/**
 * Hero scene: an attack-surface graph.
 *
 * Nodes are distributed over a sphere, edges connect near neighbours, and
 * packets travel the real edge adjacency rather than a baked animation path.
 * Geometry is generated at runtime, so the whole scene costs a few KB instead
 * of a model download.
 *
 * ON THE DISABLED LINT RULE
 * The react-hooks immutability rule models React's render phase. `useFrame` is
 * not render — it is a 60fps imperative callback on the WebGL render loop, and
 * writing into GPU-bound typed arrays there is the documented react-three-fiber
 * pattern, not a render-phase mutation. The rule cannot distinguish the two and
 * there is no narrower way to express the exemption. The real hazard it would
 * otherwise catch here — leaked GPU resources — is handled explicitly by the
 * disposal effect below.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { buildGraph, seedPackets, type Packet } from "@/lib/graph";

const NODE_VERTEX = /* glsl */ `
  attribute float phase;
  attribute float scale;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vGlow;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    // Each node breathes on its own offset so the field never pulses as one.
    float twinkle = 0.6 + 0.4 * sin(uTime * 1.1 + phase);
    vGlow = twinkle;
    gl_PointSize = scale * 5.5 * twinkle * uPixelRatio * (90.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const NODE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vGlow;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    float core = smoothstep(0.5, 0.0, dist);
    gl_FragColor = vec4(uColor, pow(core, 2.4) * vGlow);
  }
`;

const PACKET_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vGlow;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    float core = smoothstep(0.5, 0.0, dist);
    // Hot white centre falling off into the accent colour.
    vec3 tint = mix(uColor, vec3(1.0), pow(core, 3.0) * 0.75);
    gl_FragColor = vec4(tint, pow(core, 1.8) * vGlow);
  }
`;

interface SceneObjects {
  nodeGeometry: THREE.BufferGeometry;
  edgeGeometry: THREE.BufferGeometry;
  packetGeometry: THREE.BufferGeometry;
  nodeMaterial: THREE.ShaderMaterial;
  packetMaterial: THREE.ShaderMaterial;
  edgeMaterial: THREE.LineBasicMaterial;
  packets: Packet[];
  nodes: Float32Array;
  edgePairs: Uint16Array;
  edgeCount: number;
}

function buildScene(nodeCount: number, packetCount: number): SceneObjects {
  const graph = buildGraph(nodeCount);

  const nodeGeometry = new THREE.BufferGeometry();
  nodeGeometry.setAttribute("position", new THREE.BufferAttribute(graph.nodes, 3));
  nodeGeometry.setAttribute("phase", new THREE.BufferAttribute(graph.phases, 1));
  nodeGeometry.setAttribute("scale", new THREE.BufferAttribute(graph.scales, 1));

  const edgeGeometry = new THREE.BufferGeometry();
  edgeGeometry.setAttribute("position", new THREE.BufferAttribute(graph.edgePositions, 3));

  const packetGeometry = new THREE.BufferGeometry();
  packetGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(packetCount * 3), 3),
  );
  packetGeometry.setAttribute(
    "phase",
    new THREE.BufferAttribute(new Float32Array(packetCount), 1),
  );
  packetGeometry.setAttribute(
    "scale",
    new THREE.BufferAttribute(new Float32Array(packetCount).fill(1.6), 1),
  );

  const nodeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color("#45e0c8") },
    },
    vertexShader: NODE_VERTEX,
    fragmentShader: NODE_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const packetMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color("#7c8cff") },
    },
    vertexShader: NODE_VERTEX,
    fragmentShader: PACKET_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color("#2ba894"),
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  });

  return {
    nodeGeometry,
    edgeGeometry,
    packetGeometry,
    nodeMaterial,
    packetMaterial,
    edgeMaterial,
    packets: seedPackets(packetCount, graph.edgeCount),
    nodes: graph.nodes,
    edgePairs: graph.edgePairs,
    edgeCount: graph.edgeCount,
  };
}

/**
 * Three.js allocates GPU buffers and compiled shader programs that React knows
 * nothing about. Without this they leak on every quality change.
 */
function disposeScene(scene: SceneObjects) {
  scene.nodeGeometry.dispose();
  scene.edgeGeometry.dispose();
  scene.packetGeometry.dispose();
  scene.nodeMaterial.dispose();
  scene.packetMaterial.dispose();
  scene.edgeMaterial.dispose();
}

interface GraphProps {
  nodeCount: number;
  packetCount: number;
  animate: boolean;
}

function Graph({ nodeCount, packetCount, animate }: GraphProps) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const scene = useMemo(() => buildScene(nodeCount, packetCount), [nodeCount, packetCount]);

  useEffect(() => () => disposeScene(scene), [scene]);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    const dpr = Math.min(state.gl.getPixelRatio(), 2);

    scene.nodeMaterial.uniforms.uPixelRatio.value = dpr;
    scene.packetMaterial.uniforms.uPixelRatio.value = dpr;

    if (!animate) {
      scene.nodeMaterial.uniforms.uTime.value = 0;
      return;
    }

    scene.nodeMaterial.uniforms.uTime.value = elapsed;
    scene.packetMaterial.uniforms.uTime.value = elapsed;

    if (group.current) {
      group.current.rotation.y += delta * 0.055;
      // Pointer parallax, damped and clamped hard so the structure never swings
      // far enough to collide with the headline beside it.
      const targetX = state.pointer.y * 0.16;
      const targetZ = state.pointer.x * 0.06;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.03;
      group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.03;
    }

    // Advance each packet along its edge; on arrival, hand it a new one.
    const positions = scene.packetGeometry.getAttribute("position") as THREE.BufferAttribute;
    const phases = scene.packetGeometry.getAttribute("phase") as THREE.BufferAttribute;
    const posArray = positions.array as Float32Array;
    const phaseArray = phases.array as Float32Array;

    for (let i = 0; i < scene.packets.length; i++) {
      const packet = scene.packets[i];
      packet.t += delta * packet.speed;

      if (packet.t >= 1) {
        packet.t = 0;
        packet.edge = Math.floor(Math.random() * scene.edgeCount);
      }

      const a = scene.edgePairs[packet.edge * 2];
      const b = scene.edgePairs[packet.edge * 2 + 1];
      const e = packet.t;

      posArray[i * 3] = scene.nodes[a * 3] + (scene.nodes[b * 3] - scene.nodes[a * 3]) * e;
      posArray[i * 3 + 1] =
        scene.nodes[a * 3 + 1] + (scene.nodes[b * 3 + 1] - scene.nodes[a * 3 + 1]) * e;
      posArray[i * 3 + 2] =
        scene.nodes[a * 3 + 2] + (scene.nodes[b * 3 + 2] - scene.nodes[a * 3 + 2]) * e;

      // Fade in and out at the ends of the run so packets do not pop.
      phaseArray[i] = Math.sin(e * Math.PI) * 2.2;
    }

    positions.needsUpdate = true;
    phases.needsUpdate = true;
  });

  // Scale the structure down on narrow viewports so it stays inside frame.
  const scale = Math.min(1, Math.max(0.62, viewport.width / 11));

  return (
    <group ref={group} scale={scale}>
      <lineSegments geometry={scene.edgeGeometry} material={scene.edgeMaterial} />
      <points geometry={scene.nodeGeometry} material={scene.nodeMaterial} />
      <points geometry={scene.packetGeometry} material={scene.packetMaterial} />
    </group>
  );
}

export interface NetworkSceneProps {
  /** False for reduced-motion users; the structure still renders, frozen. */
  animate?: boolean;
  /** Lower on small screens and touch devices. */
  quality?: "low" | "high";
}

export default function NetworkScene({ animate = true, quality = "high" }: NetworkSceneProps) {
  const nodeCount = quality === "high" ? 160 : 90;
  const packetCount = quality === "high" ? 46 : 20;

  return (
    <Canvas
      camera={{ position: [0, 0, 6.4], fov: 46 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Graph nodeCount={nodeCount} packetCount={packetCount} animate={animate} />
    </Canvas>
  );
}
