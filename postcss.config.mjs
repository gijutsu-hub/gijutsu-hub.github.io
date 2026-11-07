/**
 * Tailwind 4 via PostCSS.
 *
 * create-next-app wires Tailwind through a Turbopack rule instead:
 *
 *   turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"] } } }
 *
 * That glob matches every stylesheet in the graph, including the one
 * next/font generates for its downloaded families, and running that file
 * through the Tailwind loader strips its @font-face rules. The fonts then
 * silently fall back to the system stack with no build error.
 *
 * PostCSS only processes the stylesheets actually imported by the app, so
 * Tailwind compiles and next/font is left alone.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
