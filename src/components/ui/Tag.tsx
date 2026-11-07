export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center border border-line bg-surface px-2.5 py-1 font-mono text-xs text-ink-dim transition-colors hover:border-accent/35 hover:text-ink">
      {children}
    </span>
  );
}
