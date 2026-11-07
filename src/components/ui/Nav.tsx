"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import NavPending from "@/components/ui/NavPending";
import { site } from "@/content/site";
import { routes } from "@/content/routes";

/**
 * Primary navigation.
 *
 * Active state comes from the pathname rather than a scroll observer — the
 * site is routed now, so "where am I" is a fact rather than a guess about
 * which section is most visible.
 */

const NAV = routes.filter((r) => r.href !== "/");

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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
          scrolled
            ? "border-b border-line bg-void/85 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 lg:px-10"
        >
          <Link href="/" className="group flex items-center gap-2.5 font-mono text-sm">
            <span className="inline-block h-1.5 w-1.5 bg-accent" />
            <span className="text-ink transition-colors group-hover:text-accent">
              {site.handle}
            </span>
          </Link>

          <ul className="hidden items-center gap-0.5 md:flex">
            {NAV.filter((r) => r.href !== "/resume").map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  aria-current={isActive(route.href) ? "page" : undefined}
                  className={`relative px-3 py-2 font-mono text-[0.8125rem] transition-colors ${
                    isActive(route.href) ? "text-accent" : "text-ink-faint hover:text-ink"
                  }`}
                >
                  {route.label}
                  <NavPending />
                  {isActive(route.href) && (
                    <span
                      className="absolute inset-x-3 -bottom-px h-px bg-accent"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            ))}

            <li className="ml-3">
              <Link
                href="/resume"
                aria-current={isActive("/resume") ? "page" : undefined}
                className="relative border border-accent/40 bg-accent/10 px-3.5 py-1.5 font-mono text-[0.8125rem] text-accent transition-colors hover:bg-accent/20"
              >
                Resume
                <NavPending />
              </Link>
            </li>
          </ul>

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
          className="fixed inset-0 z-40 overflow-y-auto bg-void/97 pt-16 backdrop-blur-md md:hidden"
        >
          <ul className="flex flex-col px-6 py-6">
            {NAV.map((route) => (
              <li key={route.href} className="border-b border-line">
                <Link
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-baseline justify-between py-4 font-mono text-lg ${
                    isActive(route.href) ? "text-accent" : "text-ink-dim"
                  }`}
                >
                  {route.label}
                  {isActive(route.href) && <span className="font-mono text-xs">current</span>}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex gap-3 px-6 pb-10">
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
