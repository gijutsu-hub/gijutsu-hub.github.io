# gijutsu-hub — portfolio

Personal site for Sumon Nath. Next.js 16 (App Router), React 19, Tailwind 4,
Three.js via react-three-fiber. Statically exported at build time — there is no
server runtime, no database and no API.

**Live:** https://gijutsu-hub.github.io

Deployed by `.github/workflows/pages.yml` on every push to `main`. The workflow
lints, typechecks, builds, and fails if the committed resume PDFs differ from
the build output.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (regenerates both resume PDFs first)
npm run resume  # regenerate both resume PDFs only
npm run lint
```

## Routing

The site is seven pages, not one scroll. `src/content/routes.ts` is the single
source for all of it — the primary nav, prev/next paging, per-page metadata and
the landing-page index all read from that array. Adding a page means an entry
there plus a route folder; nothing else needs touching, and the four places
that list pages cannot drift apart.

| Route | Contents |
| --- | --- |
| `/` | Hero and an index of everything else |
| `/capability` | Capability matrix and the six discipline blocks |
| `/method` | ATT&CK coverage and CVSS scoring |
| `/experience` | Roles, skills, frameworks, certifications, education |
| `/work` | Projects, disclosure record, events organised |
| `/concept` | Project World |
| `/contact` | Contact |
| `/resume` | Resume page and both PDF downloads |

Each content page gets a `loading.tsx` skeleton that mirrors the real
masthead's geometry, so nothing shifts when the content lands. `app/template.tsx`
replays a short enter animation per navigation, and nav links carry a pending
dot driven by `useLinkStatus`. On a static export those windows are
milliseconds — they exist for slow connections, where a click with no feedback
reads as a dead link.

## Where things live

```
src/
  content/        All site copy, as typed data. Edit the site here.
                  routes.ts  — the site map; nav, paging and metadata
                  attack.ts  — ATT&CK coverage, with depth per technique
                  cvss.ts    — CVSS metric defs and worked scoring examples
  components/
    hero/         Hero section and the WebGL scene
    sections/     One component per page section
    ui/           Nav, Footer, Section shell, Tag
  lib/
    graph.ts      Generates the 3D graph geometry
    hooks.ts      Media queries, in-view, active section, WebGL detection
    webgl.ts      WebGL capability probe
  app/
    globals.css   Design tokens and base styles
    layout.tsx    Metadata, fonts, JSON-LD
    page.tsx      Landing page
    <route>/      One folder per page, each with page.tsx + loading.tsx
    template.tsx  Per-navigation transition
scripts/
  build-resume-pdf.ts   Entry point: builds both PDFs
  resume/render.ts      Shared layout engine
  resume/theme.ts       ATS and portfolio themes
assets/
  fonts/                TTFs embedded in the themed PDF
```

**Copy is not in the components.** Everything the page says lives in
`src/content` as typed objects. To change a job description, a capability row
or a skill list, edit the matching file there — the components only render it.

## The resumes

`src/content/resume.ts` is the single source for the `/resume` page and both
PDFs. `npm run resume` regenerates them; `prebuild` runs it automatically, so
the files cannot drift from the content.

| File | For | Build |
| --- | --- | --- |
| `Sumon-Nath-Resume.pdf` | Job portals and recruiters. **The default download.** | White, single column, Helvetica, no embedded fonts |
| `Sumon-Nath-Resume-Portfolio.pdf` | Sending to a person who already knows who you are | Dark, matches the site, embedded Lato and DejaVu Sans Mono |

Same content, same layout engine (`scripts/resume/render.ts`), different theme
(`scripts/resume/theme.ts`).

### Why the ATS file is not the site's theme

Applicant tracking systems extract the text layer and discard presentation,
but the humans downstream print and skim it.

| Choice | Reason |
| --- | --- |
| White background | Printing. A dark PDF either burns toner or prints white-on-white where the driver drops backgrounds. |
| Single column, no tables | Parsers read multi-column and table layouts out of order, or not at all. |
| Helvetica | One of the 14 standard PDF fonts: no embedding, no glyph-to-character mapping failures. |
| Standard headings | "Work Experience", not "Track record". Parsers match headings against a fixed vocabulary. |
| Acronyms expanded | A filter on "penetration testing" will not match a document that only says "VAPT". |
| Contact details in the body | Text in a real PDF header region is frequently dropped. |

Colour is safe either way — parsers read characters, not fills — so the teal
accent survives on both.

Verify any change with `pdftotext public/Sumon-Nath-Resume.pdf -`, which shows
roughly what a parser sees. Both files are checked this way; the themed one
extracts correctly too, because its embedded fonts carry proper character maps.

### Fonts

`assets/fonts/` holds the five TTFs the themed PDF embeds, committed rather
than read from the host so the build is reproducible on a CI runner or deploy
host with no system fonts. Both families are permissively licensed — see
`assets/fonts/README.md`. If they go missing the build falls back to Helvetica
with a warning rather than failing.

## The hero scene

`src/lib/graph.ts` generates an attack-surface graph at runtime: nodes on a
Fibonacci sphere, edges between near neighbours, and packets that travel real
edge adjacency rather than a baked path. Nothing is downloaded as a model, so
the scene costs a few KB of code instead of a few MB of asset.

It degrades in three stages:

| Condition | Result |
| --- | --- |
| No WebGL (disabled, blocklisted GPU, hardened browser) | Static CSS fallback |
| `prefers-reduced-motion: reduce` | Scene renders, frozen |
| Narrow viewport or coarse pointer | 90 nodes / 20 packets instead of 160 / 46 |

The scene is `aria-hidden` and `pointer-events: none`. It carries no
information, so nothing is lost when it does not render.

## YouTube

`npm run youtube` reads the channel's public RSS feed into
`src/content/youtube.generated.json` and downloads each thumbnail into
`public/yt/`. Both are committed; the build touches no third party.

The gallery uses a facade player. A real YouTube iframe pulls ~1MB of player
JavaScript and contacts Google on page load for every visitor, watching or
not — fourteen of those on one page is a performance problem and a privacy
one. So each card is a local thumbnail and a button, and the iframe is created
only on click, pointed at youtube-nocookie.com with autoplay set.

Verified: the page contacts zero third-party hosts until someone presses play.

Titles are overridden in `src/content/youtube.ts` where the upload title is
shouty. "ETHICALLY HACKED INDIAN GOVERNMENT WEBSITE n*times" describes a
responsibly disclosed access-control bug and is a poor thing to put in front
of a hiring manager; the video is unchanged, the framing is not.

## GitHub data

`npm run github` fetches live figures for the curated repositories into
`src/content/github.generated.json`, which is committed. The build reads that
file rather than calling the API.

That is deliberate: fetching during `next build` would make every deploy depend
on api.github.com being reachable and under its rate limit, and an
unauthenticated Actions runner gets 60 requests an hour shared across GitHub's
whole IP range. The snapshot carries its own fetch date, which the page shows —
stale data that admits it is stale beats fresh data that sometimes fails the
deploy.

The account has 70 public repos; `src/content/github.ts` lists the 7 worth a
reader's time. Curation is the feature.

## Claims and evidence

Two sections make checkable claims, so both are written to survive being
checked by someone who knows the field:

- **ATT&CK matrix** (`src/content/attack.ts`) grades each technique Core,
  Applied or Assessed against what the engagement record actually supports.
  Tactics with thin coverage are left thin — Collection and Impact especially.
  A matrix with every cell lit reads as a lie to anyone who has filled one in
  honestly.
- **CVSS examples** (`src/content/cvss.ts`) are vulnerability *classes*, not
  engagement findings, and the page says so. Publishing a real finding, even
  anonymised, is how a consultancy loses a client.

## Gotchas worth knowing

**Do not re-add the Turbopack CSS rule.** `create-next-app` scaffolds
`turbopack.rules` applying the Tailwind loader to `"*.css"`. That glob also
matches the stylesheet `next/font` generates, and running it through the loader
strips the `@font-face` rules — fonts silently fall back to the system stack
with no build error. Tailwind runs through `postcss.config.mjs` instead.

**Font variable classes belong on `<html>`, not `<body>`.** `globals.css`
defines `--font-display` on `:root` as `var(--font-space-grotesk), …`. If that
inner variable is only declared on `<body>`, the `var()` is unresolvable at
`:root`, making `--font-display` invalid there — and custom properties inherit
their *computed* value, so descendants inherit the invalid one rather than
re-resolving it.

Check both after touching fonts, Tailwind or `next.config.ts`:

```bash
npm run build && grep -rc "@font-face" out/_next/static/chunks/*.css
```

Three is correct. Zero means the fonts are broken again.

## Still open

- **Client names.** `src/content/experience.ts` describes clients by sector
  rather than naming them. Most engagement contracts forbid publishing a client
  list. Confirm the MSAs before swapping names in.
- **Open Graph image.** `layout.tsx` declares `summary_large_image` but no image
  exists yet. Add `src/app/opengraph-image.png` (1200×630) and Next wires it up
  automatically.
- **Speaking engagement.** `src/content/research.ts` says "including by
  Microsoft" without naming the event. A named event and year is stronger.

CVE and CWE identifiers are intentionally not listed — see the note at the top
of `src/content/research.ts`. The counts render without them.

## Known advisory

`npm audit` reports 8 moderate findings, all one root cause: a `minimatch` ReDoS
reachable only through `typescript-eslint`, a devDependency. It is not in the
shipped bundle. `npm audit fix --force` downgrades `eslint-config-next` to v15,
which is a worse trade. Revisit when the upstream chain updates.
