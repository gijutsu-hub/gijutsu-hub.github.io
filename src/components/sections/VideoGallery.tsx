"use client";

import { useMemo, useState } from "react";

import LiteVideo from "@/components/ui/LiteVideo";
import Section from "@/components/ui/Section";
import snapshot from "@/content/youtube.generated.json";
import { CHANNEL_URL, TOPICS, videoMeta, type Video, type VideoTopic } from "@/content/youtube";

/**
 * Channel gallery.
 *
 * Titles are overridden where the upload title is shouty — "ETHICALLY HACKED
 * INDIAN GOVERNMENT WEBSITE n*times" is an accurate description of a
 * responsibly disclosed access-control bug and a terrible thing to put in
 * front of a hiring manager. The video is unchanged; the framing is not.
 */

type Filter = VideoTopic | "all";

function topicOf(id: string): VideoTopic {
  return videoMeta[id]?.topic ?? "Talk";
}

function titleOf(video: Video): string {
  return videoMeta[video.id]?.title ?? video.title;
}

export default function VideoGallery({ index }: { index: string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const videos = snapshot.videos as Video[];

  const shown = useMemo(
    () => (filter === "all" ? videos : videos.filter((v) => topicOf(v.id) === filter)),
    [filter, videos],
  );

  const counts = useMemo(() => {
    const m = new Map<Filter, number>([["all", videos.length]]);
    for (const t of TOPICS) m.set(t, videos.filter((v) => topicOf(v.id) === t).length);
    return m;
  }, [videos]);

  const totalViews = videos.reduce((s, v) => s + (v.views ?? 0), 0);

  return (
    <Section
      id="videos"
      index={index}
      eyebrow="Channel"
      title="Video walkthroughs"
      lede="Technique walkthroughs and live hunting from the YouTube channel — vulnerability classes explained by exploiting them, in a lab or against an in-scope target."
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {(["all", ...TOPICS] as Filter[])
            .filter((t) => (counts.get(t) ?? 0) > 0)
            .map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilter(t)}
                aria-pressed={filter === t}
                className={`border px-3.5 py-1.5 font-mono text-xs transition-colors ${
                  filter === t
                    ? "border-accent/50 bg-accent/15 text-accent"
                    : "border-line bg-surface text-ink-dim hover:border-accent/30 hover:text-ink"
                }`}
              >
                {t === "all" ? "All" : t}
                <span className="ml-2 text-ink-faint">{counts.get(t)}</span>
              </button>
            ))}
        </div>

        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="font-mono text-xs text-ink-faint transition-colors hover:text-accent"
        >
          {snapshot.channel.handle} ↗
        </a>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((video, i) => (
          <div
            key={video.id}
            style={{ animationDelay: `${i * 50}ms` }}
            className="animate-[revealUp_520ms_var(--ease-out-expo)_both]"
          >
            <LiteVideo
              video={video}
              title={titleOf(video)}
              note={videoMeta[video.id]?.note}
            />
            <div className="mt-2 flex items-center justify-between font-mono text-[0.625rem] text-ink-faint">
              <span>{topicOf(video.id)}</span>
              <span>
                {video.published}
                {video.views !== null && ` · ${video.views.toLocaleString()} views`}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 font-mono text-xs text-ink-faint">
        {videos.length} videos · {totalViews.toLocaleString()} views · thumbnails served from this
        origin, so nothing reaches YouTube until you press play
      </p>
    </Section>
  );
}
