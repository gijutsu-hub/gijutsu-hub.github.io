import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";
import StatusBar from "@/components/ui/StatusBar";
import { site } from "@/content/site";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  // Required for Open Graph and Twitter card URLs to resolve absolutely.
  // Without it Next emits relative URLs that no scraper can follow.
  metadataBase: new URL("https://gijutsu-hub.github.io"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  authors: [{ name: site.name, url: site.linkedin }],
  creator: site.name,
  keywords: [
    "penetration testing",
    "VAPT",
    "red team",
    "adversary emulation",
    "MITRE ATT&CK",
    "application security",
    "secure code review",
    "detection engineering",
    "cloud security",
    "offensive security",
  ],
  openGraph: {
    type: "profile",
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    siteName: site.name,
    locale: "en_IN",
    // Pointed at /og.png explicitly rather than relying on the
    // opengraph-image file convention. See the note in app/og.png/route.tsx:
    // the convention's extensionless path is served as octet-stream by
    // GitHub Pages, and scrapers will not render a preview from that.
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  colorScheme: "dark",
};

/** Structured data, so a search engine reads this as a person rather than a blob. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  description: site.tagline,
  email: `mailto:${site.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressCountry: "IN",
  },
  sameAs: [site.github, site.linkedin],
  knowsAbout: [
    "Penetration Testing",
    "Red Team Operations",
    "MITRE ATT&CK",
    "Application Security",
    "Secure Code Review",
    "Cloud Security",
    "Detection Engineering",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /*
     * The next/font variable classes go on <html>, not <body>.
     *
     * globals.css defines --font-display on :root as
     * `var(--font-space-grotesk), ...`. If --font-space-grotesk is only
     * declared on <body>, that var() is unresolvable at :root, which makes
     * --font-display invalid there — and custom properties inherit their
     * computed value, so every descendant inherits the invalid one rather
     * than re-resolving it. Everything silently falls back to system fonts
     * with no error anywhere.
     */
    <html
      lang="en"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <script
          type="application/ld+json"
          // Static, authored above — not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {/* Decorative texture; pointer-events:none, below all content. */}
        <div className="ambient" aria-hidden="true" />
        <Nav />
        <main id="main" className="relative z-10">
          {children}
        </main>
        <Footer />
        <StatusBar />
      </body>
    </html>
  );
}
