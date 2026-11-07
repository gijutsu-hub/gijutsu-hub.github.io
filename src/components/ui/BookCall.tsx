"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from "react";

/**
 * Cal.com booking trigger.
 *
 * The embed is loaded lazily and the button works as a plain link until it is
 * ready, so a blocked or slow third-party script degrades to "opens cal.com in
 * a tab" rather than a dead button. Plenty of this audience runs script
 * blockers, and a booking control that silently does nothing is worse than one
 * that navigates.
 */

const NAMESPACE = "30min";
const CAL_LINK = "sumon-nath-bugxploit-2irckn/30min";

export default function BookCall({
  variant = "primary",
  className = "",
}: {
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const cal = await getCalApi({ namespace: NAMESPACE });
        if (cancelled) return;
        cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
        setReady(true);
      } catch {
        // Leave `ready` false: the anchor href still works.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const base =
    "group inline-flex items-center gap-2 px-5 py-2.5 font-mono text-sm transition-colors";
  const styles =
    variant === "primary"
      ? "border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
      : "border border-line-bright text-ink-dim hover:border-accent/40 hover:text-ink";

  return (
    <a
      href={`https://cal.com/${CAL_LINK}`}
      target="_blank"
      rel="noreferrer noopener"
      // These attributes are what the embed binds to. Until it loads, the
      // href above carries the click instead.
      data-cal-namespace={ready ? NAMESPACE : undefined}
      data-cal-link={ready ? CAL_LINK : undefined}
      data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
      className={`${base} ${styles} ${className}`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <rect x="1.5" y="2.5" width="11" height="10" stroke="currentColor" strokeWidth="1.3" />
        <path d="M1.5 5.5h11M4.5 1v3M9.5 1v3" stroke="currentColor" strokeWidth="1.3" />
      </svg>
      Book a 30-minute call
    </a>
  );
}
