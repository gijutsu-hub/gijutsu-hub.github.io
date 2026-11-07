import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * GitHub Pages serves static files only — there is no Node runtime to render
   * a request. `export` writes the whole site to out/ at build time.
   *
   * This site is already fully prerendered, so nothing is lost. It does rule
   * out, from here on: server components that read a request, route handlers,
   * middleware, ISR and on-demand revalidation. If any of those are ever
   * needed, move to a host that runs Node (Vercel, Netlify, Cloudflare) and
   * drop this line.
   */
  output: "export",

  /**
   * next/image's default loader optimises on a server that does not exist in a
   * static export. Nothing uses next/image today; this is here so that adding
   * an <Image> later degrades to a plain <img> instead of breaking the build.
   */
  images: {
    unoptimized: true,
  },

  /**
   * DO NOT re-add the `turbopack.rules` block that create-next-app scaffolds:
   *
   *   turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"] } } }
   *
   * That glob matches every stylesheet, including the one next/font generates
   * for its downloaded families. Running it through the Tailwind loader strips
   * the @font-face rules, so the fonts silently never load and everything
   * falls back to the system stack — with no build error to tell you.
   *
   * Tailwind 4 works without it here. Verify after any change to this file:
   *
   *   npm run build && grep -rc "@font-face" out/_next/static/chunks/*.css
   *
   * Three is correct (Inter, Space Grotesk, JetBrains Mono). Zero means the
   * fonts are broken again.
   */
};

export default nextConfig;
