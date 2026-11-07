/**
 * Fetches live data for the curated repositories into a committed snapshot.
 *
 * WHY A COMMITTED SNAPSHOT RATHER THAN A BUILD-TIME FETCH
 * A static export bakes everything in at build time, so this could just run
 * during `next build`. It does not, because that would make every deploy
 * depend on api.github.com being reachable and under its rate limit — an
 * unauthenticated runner gets 60 requests an hour shared across the whole
 * GitHub Actions IP range, which is not a dependency worth adding to a deploy.
 *
 * So: run `npm run github` when you want the numbers refreshed, commit the
 * result, and the build reads a local file. The snapshot carries its own
 * fetch date, which the page shows — stale data that admits it is stale beats
 * fresh data that sometimes fails the build.
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { curated, type GithubSnapshot, type RepoData } from "../src/content/github.js";

const USER = "gijutsu-hub";
const API = "https://api.github.com";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "src", "content", "github.generated.json");

/** GITHUB_TOKEN lifts the rate limit from 60/hr to 5000/hr when present. */
function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "gijutsu-hub-portfolio-build",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: headers() });
  if (!res.ok) {
    throw new Error(`GitHub ${res.status} on ${path}: ${await res.text().catch(() => "")}`);
  }
  return (await res.json()) as T;
}

interface ApiRepo {
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
  created_at: string;
  size: number;
  archived: boolean;
}

interface ApiUser {
  login: string;
  name: string;
  public_repos: number;
  followers: number;
  created_at: string;
}

async function main() {
  const profile = await api<ApiUser>(`/users/${USER}`);

  const repos: RepoData[] = [];
  for (const entry of curated) {
    const repo = await api<ApiRepo>(`/repos/${USER}/${entry.slug}`);
    const languages = await api<Record<string, number>>(
      `/repos/${USER}/${entry.slug}/languages`,
    );

    repos.push({
      slug: entry.slug,
      url: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      // Ordered by bytes, so the dominant language reads first.
      languages: Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .map(([name]) => name),
      pushedAt: repo.pushed_at,
      createdAt: repo.created_at,
      sizeKb: repo.size,
      archived: repo.archived,
    });

    console.log(`  ${entry.slug.padEnd(18)} ★${repo.stargazers_count}  ${repo.language ?? "-"}`);
  }

  const snapshot: GithubSnapshot = {
    fetchedAt: new Date().toISOString(),
    profile: {
      login: profile.login,
      name: profile.name,
      publicRepos: profile.public_repos,
      followers: profile.followers,
      createdAt: profile.created_at,
    },
    repos,
  };

  writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`\n[github] ${repos.length} repos -> ${OUT}`);
}

main().catch((err) => {
  console.error("[github] fetch failed:", err instanceof Error ? err.message : err);
  console.error("[github] the existing snapshot is left in place; the build will use it.");
  process.exit(1);
});
