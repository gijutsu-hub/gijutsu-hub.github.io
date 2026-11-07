import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/content/site";

export const alt = `${site.name} — ${site.role}`;

/**
 * With `output: "export"` there is no server to render this on request, so
 * the route must declare itself static. Next then renders the PNG once at
 * build time and writes it into out/.
 */
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Link preview card, rendered to PNG at build time.
 *
 * Type comes from assets/fonts rather than next/font: this runs in Satori,
 * which needs raw font buffers and cannot read a CSS variable. Those files are
 * already vendored for the themed resume PDF, so the two offline artifacts
 * share a family and no new dependency appears.
 *
 * Satori supports a subset of CSS — flexbox only, no grid, and every element
 * needs an explicit `display`. The network motif below is plain positioned
 * divs, not the WebGL scene, which cannot run here.
 */

const FONT_DIR = join(process.cwd(), "assets", "fonts", "og");

/** Decorative nodes echoing the hero graph. Hand-placed; Satori has no canvas. */
const NODES = [
  { x: past(0.70), y: past(0.16), r: 5, o: 0.9 },
  { x: past(0.82), y: past(0.30), r: 3, o: 0.55 },
  { x: past(0.63), y: past(0.38), r: 7, o: 1 },
  { x: past(0.90), y: past(0.52), r: 4, o: 0.7 },
  { x: past(0.74), y: past(0.60), r: 3, o: 0.45 },
  { x: past(0.86), y: past(0.74), r: 5, o: 0.8 },
  { x: past(0.66), y: past(0.82), r: 3, o: 0.5 },
  { x: past(0.95), y: past(0.20), r: 3, o: 0.4 },
];

function past(fraction: number): number {
  return Math.round(fraction * 1000) / 1000;
}

export default async function Image() {
  const [latoBlack, latoRegular, mono] = [
    readFileSync(join(FONT_DIR, "Lato-Black.ttf")),
    readFileSync(join(FONT_DIR, "Lato-Regular.ttf")),
    readFileSync(join(FONT_DIR, "DejaVuSansMono.ttf")),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#080B10",
          position: "relative",
          padding: "68px 72px",
        }}
      >
        {/* Accent edge, matching the themed resume PDF. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 8,
            height: "100%",
            backgroundColor: "#45E0C8",
            display: "flex",
          }}
        />

        {/* Network motif, right side. Decorative. */}
        {NODES.map((node, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: node.x * 1200 - node.r,
              top: node.y * 630 - node.r,
              width: node.r * 2,
              height: node.r * 2,
              borderRadius: node.r,
              backgroundColor: "#45E0C8",
              opacity: node.o,
              display: "flex",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: 120,
            width: 420,
            height: 420,
            borderRadius: 210,
            border: "1px solid #1F2836",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -40,
            top: 200,
            width: 260,
            height: 260,
            borderRadius: 130,
            border: "1px solid #16202C",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{ width: 34, height: 2, backgroundColor: "#45E0C8", display: "flex" }}
            />
            <div
              style={{
                fontFamily: "Mono",
                fontSize: 19,
                color: "#64717F",
                letterSpacing: 3,
                marginLeft: 16,
                display: "flex",
              }}
            >
              {site.location.toUpperCase()}
            </div>
          </div>

          <div
            style={{
              fontFamily: "Display",
              fontSize: 104,
              color: "#E8EEF5",
              lineHeight: 1.05,
              marginTop: 26,
              display: "flex",
            }}
          >
            {site.name}
          </div>

          <div
            style={{
              fontFamily: "Body",
              fontSize: 34,
              color: "#45E0C8",
              marginTop: 14,
              display: "flex",
            }}
          >
            {site.role}
          </div>

          <div
            style={{
              fontFamily: "Body",
              fontSize: 25,
              color: "#9AA8B8",
              marginTop: 10,
              display: "flex",
            }}
          >
            Red Team Operator · VAPT Lead · Application Security
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #1F2836",
            paddingTop: 22,
          }}
        >
          <div style={{ fontFamily: "Mono", fontSize: 21, color: "#64717F", display: "flex" }}>
            github.com/{site.handle}
          </div>
          <div style={{ fontFamily: "Mono", fontSize: 21, color: "#45E0C8", display: "flex" }}>
            gijutsu-hub.github.io
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Display", data: latoBlack, style: "normal", weight: 900 },
        { name: "Body", data: latoRegular, style: "normal", weight: 400 },
        { name: "Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
