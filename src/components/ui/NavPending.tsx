"use client";

import { useLinkStatus } from "next/link";

/**
 * Pending indicator for a nav link.
 *
 * Must be rendered *inside* a <Link>: useLinkStatus reads the pending state of
 * its nearest Link ancestor. It reports true from the click until the target
 * route's payload has arrived.
 *
 * On a static export that window is usually a few milliseconds, so this is
 * mostly invisible — which is correct. It exists for the slow-connection case,
 * where a nav click with no feedback reads as a dead link and gets clicked
 * again.
 */
export default function NavPending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;

  return (
    <span
      className="absolute -right-0.5 top-1/2 inline-block h-1 w-1 -translate-y-1/2 animate-ping rounded-full bg-accent"
      aria-hidden="true"
    />
  );
}
