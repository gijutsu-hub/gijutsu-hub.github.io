import BookCall from "@/components/ui/BookCall";
import DownloadButton from "@/components/ui/DownloadButton";
import { site } from "@/content/site";

const CHANNELS = [
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "GitHub", value: `github.com/${site.handle}`, href: site.github },
  { label: "LinkedIn", value: `in/${site.handle}`, href: site.linkedin },
];

export default function Contact({ index }: { index: string }) {
  return (
    <section id="contact" className="scroll-mt-24 border-b border-line px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <p className="rule-label mb-5 flex items-center gap-3">
              <span className="text-accent">{index}</span>
              <span className="inline-block h-px w-6 bg-line-bright" />
              Contact
            </p>
            <h2 className="text-3xl leading-tight text-balance sm:text-4xl lg:text-[2.75rem]">
              Scoping an assessment, or hiring for one?
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-dim text-pretty">
              Open to engagement work, red team operations and security-engineering roles. For
              testing work, come with the asset list and the constraints — scoping conversations
              go faster when the boundaries are on the table first.
            </p>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-ink-faint">
              All work is authorised and scoped under written rules of engagement. I do not test
              systems without the owner&apos;s documented permission.
            </p>
          </div>

          <div className="border border-line bg-surface">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-line-bright" />
              <span className="h-2 w-2 rounded-full bg-line-bright" />
              <span className="h-2 w-2 rounded-full bg-line-bright" />
              <span className="ml-2 font-mono text-xs text-ink-faint">contact</span>
            </div>

            <div className="border-b border-line p-5">
              <p className="rule-label mb-3">Fastest route</p>
              <BookCall />
              <p className="mt-3 text-xs leading-relaxed text-ink-faint">
                Opens a scheduler here on the page. Pick a slot and it is booked — no email
                thread to agree a time.
              </p>
            </div>

            <dl className="divide-y divide-line">
              {CHANNELS.map((channel) => (
                <div key={channel.label} className="group">
                  <a
                    href={channel.href}
                    target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={channel.href.startsWith("mailto:") ? undefined : "noreferrer noopener"}
                    className="flex items-baseline justify-between gap-4 px-5 py-5 transition-colors hover:bg-raised"
                  >
                    <dt className="rule-label">{channel.label}</dt>
                    <dd className="font-mono text-sm text-ink transition-colors group-hover:text-accent">
                      {channel.value}
                    </dd>
                  </a>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 px-5 py-5">
                <dt className="rule-label">Based in</dt>
                <dd className="font-mono text-sm text-ink-dim">{site.location}</dd>
              </div>
            </dl>

            <div className="border-t border-line px-5 py-5">
              <DownloadButton />
            </div>

            <div className="border-t border-line px-5 py-4 font-mono text-xs text-ink-faint">
              <span className="text-accent">$</span> awaiting input
              <span className="ml-0.5 inline-block animate-[blink_1.1s_steps(1)_infinite]">_</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
