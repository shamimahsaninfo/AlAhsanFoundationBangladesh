import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clapperboard, Image as ImageIcon, Pause, Play } from "lucide-react";
import { Image } from "@/components/ui/image";
import { isDirectVideo, isVideoLink, videoEmbedUrl } from "@/lib/media";

function MediaFrame({ item }) {
  const embed = videoEmbedUrl(item.url);
  if (embed) {
    return (
      <iframe
        src={embed}
        title={item.title || "ভিডিও"}
        className="h-full w-full"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    );
  }
  if (isDirectVideo(item.url)) {
    return <video src={item.url} className="h-full w-full object-cover" autoPlay muted loop playsInline />;
  }
  return <Image src={item.url} alt={item.title || "কার্যক্রমের ছবি"} className="h-full w-full object-cover" />;
}

function Thumb({ item, active, onClick }) {
  const video = isVideoLink(item.url) || isDirectVideo(item.url);
  return (
    <button type="button" onClick={onClick} data-active={active} className="thumb-card min-w-[220px] text-left lg:min-w-0">
      <span className="relative flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary">
        {video ? (
          <Clapperboard className="h-5 w-5 text-primary" />
        ) : (
          <Image src={item.url} alt={item.title || "মিডিয়া"} className="h-full w-full object-cover" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-heading text-[13px] font-semibold text-heading">
          {item.title || (video ? "ভিডিও" : "ছবি")}
        </span>
        <span className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
          {video ? <Clapperboard className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
          {item.caption || (video ? "ভিডিও" : "ছবি")}
        </span>
      </span>
    </button>
  );
}

export default function OverviewCarousel({ settings }) {
  const items = useMemo(
    () => (settings?.overview_media || []).filter((item) => item?.url && item.enabled !== false),
    [settings?.overview_media]
  );
  const interval = Math.max(2, Number(settings?.overview_interval || 6)) * 1000;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    setIndex(0);
  }, [items.length]);

  useEffect(() => {
    if (!playing || items.length < 2) return undefined;
    const timer = setInterval(() => setIndex((current) => (current + 1) % items.length), interval);
    return () => clearInterval(timer);
  }, [items.length, interval, playing]);

  if (settings?.overview_enabled === false || !items.length) return null;

  const active = items[Math.min(index, items.length - 1)];
  const video = isVideoLink(active.url);

  return (
    <section
      data-color-key="home-overview"
      data-color-label="কার্যক্রম ওভারভিউ"
      className="band-canvas relative overflow-hidden py-14 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--accent))]/70 to-transparent" />

      <div className="shell relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow inline-flex items-center gap-2">
              <span className="h-px w-7 bg-accent" /> আমাদের কাজ
            </span>
            <h2 className="text-heading mt-3 font-heading text-[24px] font-bold leading-tight sm:text-[32px]">
              {settings?.overview_title || "আমাদের কার্যক্রম ওভারভিউ"}
            </h2>
            {settings?.overview_subtitle && (
              <p className="mt-2.5 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
                {settings.overview_subtitle}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => setPlaying((value) => !value)}
                aria-label={playing ? "অটো চলা থামান" : "অটো চালু করুন"}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-primary transition-colors hover:border-accent"
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            )}
            <Link
              to="/activities"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-3 text-[12.5px] font-semibold text-primary transition-all hover:-translate-y-0.5 hover:border-accent"
            >
              সব কার্যক্রম <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <div className="media-frame">
            <div className="media-inner">
              <div className="relative aspect-[16/11] w-full sm:aspect-[16/9]">
                <div key={`${active.url}-${index}`} className="absolute inset-0 animate-rise">
                  <MediaFrame item={active} />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <span className="glass-panel absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                  {video ? <Clapperboard className="h-3.5 w-3.5 text-accent" /> : <ImageIcon className="h-3.5 w-3.5 text-accent" />}
                  {video ? "ভিডিও" : "ছবি"} · {index + 1}/{items.length}
                </span>

                {(active.title || active.caption) && (
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                    <div className="glass-panel rounded-2xl px-4 py-3 text-white">
                      {active.title && (
                        <p className="font-heading text-[15px] font-semibold leading-snug sm:text-[19px]">{active.title}</p>
                      )}
                      {active.caption && <p className="mt-1 text-[11.5px] leading-relaxed text-white/80 sm:text-[12.5px]">{active.caption}</p>}
                    </div>
                  </div>
                )}

                {items.length > 1 && playing && (
                  <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/20">
                    <div
                      key={`${index}-${playing}`}
                      className="h-full bg-accent"
                      style={{ animation: `grow ${interval}ms linear forwards` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1 lg:max-h-[430px] lg:flex-col lg:overflow-y-auto lg:pb-0">
            {items.map((item, i) => (
              <Thumb key={`${item.url}-${i}`} item={item} active={i === index} onClick={() => setIndex(i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}