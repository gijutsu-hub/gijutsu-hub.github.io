"use client";

import { useReveal } from "@/components/charts/useReveal";

export interface Segment {
  value: number;
  className: string;
  label: string;
}

export interface BarRow {
  label: string;
  /** Rendered right-aligned beside the label. */
  meta?: string;
  segments: Segment[];
}

/**
 * Stacked horizontal bars.
 *
 * Horizontal because the category labels are words, not dates — vertical bars
 * would turn fourteen tactic names into rotated text nobody reads. Bars grow
 * from zero on reveal, staggered down the list so the eye follows the order.
 *
 * The underlying numbers are also rendered as a visually-hidden table, so the
 * chart is readable by a screen reader rather than being an unlabelled shape.
 */
export default function BarChart({
  rows,
  max,
  caption,
}: {
  rows: BarRow[];
  /** Shared scale across rows. Defaults to the largest row total. */
  max?: number;
  caption: string;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const scale = max ?? Math.max(...rows.map((r) => r.segments.reduce((s, x) => s + x.value, 0)));

  return (
    <div ref={ref}>
      <table className="sr-only">
        <caption>{caption}</caption>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {row.segments.map((seg) => (
                <td key={seg.label}>
                  {seg.label}: {seg.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="space-y-2.5" aria-hidden="true">
        {rows.map((row, i) => {
          const total = row.segments.reduce((s, x) => s + x.value, 0);
          return (
            <li key={row.label} className="grid grid-cols-[9.5rem_1fr_2.5rem] items-center gap-3">
              <span className="truncate font-mono text-[0.6875rem] text-ink-dim" title={row.label}>
                {row.label}
              </span>

              <span className="flex h-4 w-full overflow-hidden bg-surface">
                {row.segments.map((seg) => (
                  <span
                    key={seg.label}
                    className={`h-full transition-[width] duration-700 ease-out ${seg.className}`}
                    style={{
                      width: shown ? `${(seg.value / scale) * 100}%` : "0%",
                      transitionDelay: `${i * 45}ms`,
                    }}
                  />
                ))}
              </span>

              <span className="text-right font-mono text-[0.6875rem] text-ink-faint tabular-nums">
                {total}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
