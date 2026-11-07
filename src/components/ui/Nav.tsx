"use client";

import { useEffect, useState } from "react";

import { site } from "@/content/site";
import { useActiveSection } from "@/lib/hooks";

const LINKS = [
  { id: "capability", label: "Capability" },
  { id: "vapt", label: "VAPT" },
  { id: "red-team", label: "Red Team" },
  { id: "detection", label: "Detection" },
  { id: "appsec", label: "AppSec" },
  { id: "projects", label: "Work" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];

const SECTION_IDS = LINKS.map((link) => link.id);

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-accent focus:bg-void focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-accent"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? "border-b border-line bg-void/85 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 lg:px-10"
        >
          <a href="#top" className="group flex items-center gap-2.5 font-mono text-sm">
            <span className="inline-block h-1.5 w-1.5 bg-accent" />
            <span className="text-ink transition-colors group-hover:text-accent">
              {site.handle}
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? "true" : undefined}
                  className={`px-3 py-2 font-mono text-[0.8125rem] transition-colors ${
                    active === link.id
                      ? "text-accent"
                      : "text-ink-faint hover:text-ink"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="/resume"
            className="ml-3 hidden border border-accent/40 bg-accent/10 px-3.5 py-1.5 font-mono text-[0.8125rem] text-accent transition-colors hover:bg-accent/20 md:inline-block"
          >
            Resume
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-9 w-9 items-center justify-center border border-line-bright text-ink-dim md:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              {open ? (
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" />
              ) : (
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </nav>
      </header>

      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-40 bg-void/97 pt-16 backdrop-blur-md md:hidden"
        >
          <ul className="flex flex-col px-6 py-6">
            {LINKS.map((link) => (
              <li key={link.id} className="border-b border-line">
                <a
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-mono text-lg text-ink-dim"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="px-6 pt-6">
            <a
              href="/resume"
              onClick={() => setOpen(false)}
              className="inline-block border border-accent/40 bg-accent/10 px-4 py-2.5 font-mono text-sm text-accent"
            >
              Resume
            </a>
          </div>
          <div className="flex gap-3 px-6 pt-4">
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer noopener"
              className="border border-line-bright px-4 py-2 font-mono text-sm text-ink-dim"
            >
              GitHub
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="border border-line-bright px-4 py-2 font-mono text-sm text-ink-dim"
            >
              LinkedIn
            </a>
          </div>
        </div>
      )}
    </>
  );
}
