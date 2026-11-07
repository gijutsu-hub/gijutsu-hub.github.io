"use client";

import { useState } from "react";

import { embedUrl, watchUrl, type Video } from "@/content/youtube";

/**
 * Facade video player.
 *
 * A normal YouTube iframe loads ~1MB of player JavaScript and contacts Google
 * on page load, for every visitor, whether or not anyone watches. Fourteen of
 * them on one page is both a performance problem and a privacy one.
 *
 * So the card is a local thumbnail and a button. The iframe is created only
 * after a click, pointed at youtube-nocookie.com, with autoplay set so the
 * click that revealed the player also starts it — otherwise people press play
 * twice.
 *
 * Net effect: zero third-party requests until someone asks to watch.
 */
export default function LiteVideo({
  video,
  title,
  note,
}: {
  video: Video;
  title: string;
  note?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="group relative aspect-video w-full overflow-hidden border border-line bg-surface">
      {playing ? (
        <iframe
          src={embedUrl(video.id)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="absolute inset-0 h-full w-full cursor-pointer text-left"
          aria-label={`Play: ${title}`}
        >
          {video.thumb ? (
            /* Plain <img>: next/image's optimiser does not exist in a static
               export, and these are already correctly sized local files. */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.thumb}
              alt=""
              width={video.width}
              height={video.height}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-90"
            />
          ) : (
            <span className="absolute inset-0 bg-raised" />
          )}

          <span className="absolute inset-0 bg-gradient-to-t from-void via-void/35 to-transparent" />

          <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-accent/50 bg-void/70 backdrop-blur-sm transition-colors group-hover:border-accent group-hover:bg-accent/20">
            <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
              <path d="M2 1.5v13L13 8z" fill="currentColor" className="text-accent" />
            </svg>
          </span>

          <span className="absolute inset-x-0 bottom-0 p-4">
            <span className="block font-display text-sm leading-snug text-ink">{title}</span>
            {note && (
              <span className="mt-1 block text-xs leading-relaxed text-ink-faint">{note}</span>
            )}
          </span>
        </button>
      )}

      {!playing && (
        <a
          href={watchUrl(video.id)}
          target="_blank"
          rel="noreferrer noopener"
          onClick={(e) => e.stopPropagation()}
          className="absolute right-2 top-2 z-10 border border-line bg-void/80 px-2 py-1 font-mono text-[0.5625rem] text-ink-faint opacity-0 backdrop-blur-sm transition-opacity hover:text-accent focus:opacity-100 group-hover:opacity-100"
        >
          YouTube ↗
        </a>
      )}
    </div>
  );
}
