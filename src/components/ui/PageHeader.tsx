import { routeIndex } from "@/content/routes";

/** The masthead every content page opens with. Keeps pages visually siblings. */
export default function PageHeader({
  href,
  eyebrow,
  title,
  lede,
}: {
  href: string;
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="border-b border-line px-6 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-36">
      <div className="mx-auto w-full max-w-6xl">
        <p className="rule-label mb-5 flex items-center gap-3">
          <span className="text-accent">{routeIndex(href)}</span>
          <span className="inline-block h-px w-6 bg-line-bright" />
          {eyebrow}
        </p>
        <h1 className="max-w-3xl text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-dim text-pretty">{lede}</p>
      </div>
    </header>
  );
}
