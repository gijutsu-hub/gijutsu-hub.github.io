/**
 * Snapshots the YouTube channel feed and downloads thumbnails locally.
 *
 * Two deliberate choices:
 *
 * 1. The feed is read at author time, not build time. Same reasoning as the
 *    GitHub snapshot — a deploy should not fail because a third party is
 *    unreachable. Run `npm run youtube` to refresh, commit the result.
 *
 * 2. Thumbnails are downloaded into public/yt/ rather than hot-linked from
 *    i.ytimg.com. Hot-linking means every visitor to the page is reported to
 *    Google before they have asked to watch anything. Serving them from this
 *    origin means the page makes zero third-party requests until someone
 *    actually presses play.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { videoMeta, type Video, type YoutubeSnapshot } from "../src/content/youtube.js";

const CHANNEL_ID = "UClrxfywedQYylYcOQy6-Hhg";
const HANDLE = "@gijutsu_hub";
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_JSON = join(__dirname, "..", "src", "content", "youtube.generated.json");
const THUMB_DIR = join(__dirname, "..", "public", "yt");

const UA = "Mozilla/5.0 (X11; Linux x86_64) portfolio-build";

function text(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  if (!m) return "";
  return m[1]
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

/**
 * maxres exists only for videos uploaded with a large enough thumbnail, so
 * fall back down the ladder rather than shipping a broken image.
 */
async function downloadThumb(id: string): Promise<{ path: string; w: number; h: number } | null> {
  const candidates = [
    { name: "maxresdefault", w: 1280, h: 720 },
    { name: "sddefault", w: 640, h: 480 },
    { name: "hqdefault", w: 480, h: 360 },
  ];

  for (const c of candidates) {
    const url = `https://i.ytimg.com/vi/${id}/${c.name}.jpg`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) continue;

    const buf = Buffer.from(await res.arrayBuffer());
    // YouTube answers 200 with a tiny grey placeholder when a size is absent.
    if (buf.byteLength < 3000) continue;

    writeFileSync(join(THUMB_DIR, `${id}.jpg`), buf);
    return { path: `/yt/${id}.jpg`, w: c.w, h: c.h };
  }

  return null;
}

async function main() {
  mkdirSync(THUMB_DIR, { recursive: true });

  const res = await fetch(FEED, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`feed ${res.status}`);
  const xml = await res.text();

  const entries = xml.split("<entry>").slice(1);
  const videos: Video[] = [];

  for (const entry of entries) {
    const id = text(entry, "yt:videoId");
    if (!id) continue;
    if (videoMeta[id]?.hidden) {
      console.log(`  ${id}  skipped (hidden)`);
      continue;
    }

    const viewsMatch = entry.match(/views="(\d+)"/);
    const thumb = await downloadThumb(id);

    videos.push({
      id,
      title: text(entry, "title"),
      published: text(entry, "published").slice(0, 10),
      views: viewsMatch ? Number(viewsMatch[1]) : null,
      description: text(entry, "media:description").slice(0, 400),
      thumb: thumb?.path ?? "",
      width: thumb?.w ?? 0,
      height: thumb?.h ?? 0,
    });

    console.log(`  ${id}  ${thumb ? "thumb ok" : "NO THUMB"}  ${text(entry, "title").slice(0, 50)}`);
  }

  const snapshot: YoutubeSnapshot = {
    fetchedAt: new Date().toISOString(),
    channel: {
      id: CHANNEL_ID,
      handle: HANDLE,
      name: "gijutsu_hub",
      url: `https://www.youtube.com/${HANDLE}`,
    },
    videos,
  };

  writeFileSync(OUT_JSON, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`\n[youtube] ${videos.length} videos -> ${OUT_JSON}`);
}

main().catch((err) => {
  console.error("[youtube] fetch failed:", err instanceof Error ? err.message : err);
  console.error("[youtube] existing snapshot left in place; the build will use it.");
  process.exit(1);
});
