"use client";

import { useId } from "react";

import { useReveal } from "@/components/charts/useReveal";
import type { Topology } from "@/content/topologies";

/**
 * Small animated network diagram.
 *
 * Inline SVG on a 0–100 viewBox, so it scales to any tile without a second
 * asset and stays sharp. Edges draw themselves in with a dash offset, nodes
 * fade up after them, and a packet runs each edge on a loop — the motion is
 * the point of the diagram, since what distinguishes these topologies is
 * where traffic goes, not where boxes sit.
 *
 * Decorative in the accessibility sense: the caption beside it carries the
 * meaning, so the figure is hidden from assistive tech rather than read out
 * as a list of unlabelled circles.
 */

const ROLE = {
  operator: { r: 4.2, fill: "var(--color-signal)", glow: 0.35 },
  relay: { r: 3.2, fill: "var(--color-indigo)", glow: 0.3 },
  victim: { r: 2.6, fill: "var(--color-accent)", glow: 0.25 },
  defended: { r: 2.6, fill: "var(--color-ink-faint)", glow: 0.12 },
} as const;

export default function NetworkGraph({
  topology,
  animate = true,
}: {
  topology: Topology;
  animate?: boolean;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const uid = useId().replace(/:/g, "");

  return (
    <div ref={ref} className="w-full">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        role="presentation"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`glow-${uid}`}>
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Edges, drawn in on reveal. */}
        {topology.edges.map(([a, b], i) => {
          const from = topology.nodes[a];
          const to = topology.nodes[b];
          const len = Math.hypot(to.x - from.x, to.y - from.y);

          return (
            <line
              key={`e-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="var(--color-line-bright)"
              strokeWidth="0.5"
              strokeDasharray={len}
              strokeDashoffset={shown ? 0 : len}
              style={{
                transition: "stroke-dashoffset 620ms ease-out",
                transitionDelay: `${i * 70}ms`,
              }}
            />
          );
        })}

        {/* One packet per edge, travelling from source to target on a loop. */}
        {animate &&
          shown &&
          topology.edges.map(([a, b], i) => {
            const from = topology.nodes[a];
            const to = topology.nodes[b];
            return (
              <circle key={`p-${i}`} r="0.9" fill="var(--color-accent)">
                <animate
                  attributeName="cx"
                  values={`${from.x};${to.x}`}
                  dur="2.4s"
                  begin={`${0.35 + i * 0.22}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={`${from.y};${to.y}`}
                  dur="2.4s"
                  begin={`${0.35 + i * 0.22}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.15;0.8;1"
                  dur="2.4s"
                  begin={`${0.35 + i * 0.22}s`}
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}

        {/* Nodes. */}
        {topology.nodes.map((node, i) => {
          const spec = ROLE[node.role];
          return (
            <g
              key={node.id}
              style={{
                opacity: shown ? 1 : 0,
                transition: "opacity 420ms ease-out",
                transitionDelay: `${260 + i * 55}ms`,
              }}
            >
              <circle cx={node.x} cy={node.y} r={spec.r * 2.6} fill={`url(#glow-${uid})`} />
              <circle
                cx={node.x}
                cy={node.y}
                r={spec.r}
                fill={spec.fill}
                opacity={node.role === "defended" ? 0.55 : 1}
              />
              {node.role === "defended" && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={spec.r + 1.6}
                  fill="none"
                  stroke="var(--color-line-bright)"
                  strokeWidth="0.4"
                  strokeDasharray="1.2 1.2"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
