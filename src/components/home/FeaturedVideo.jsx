import { PlayCircle } from "lucide-react";
import { Image } from "@/components/ui/image";
import { text } from "@/lib/copy";

function embedUrl(url) {
  if (!url) return "";
  const youtube = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  if (/^https:\/\/[\w.-]+\/.*\.(mp4|webm)$/i.test(url)) return "";
  return url.startsWith("https://") ? url : "";
}

export default function FeaturedVideo({ settings }) {
  const url = settings.featured_video_url || "";
  const source = embedUrl(url);
  const isFile = /\.(mp4|webm)(\?|$)/i.test(url);
  if (!url) return null;

  return (
    <section data-color-key="home-video" data-color-label="ভিডিও সেকশন" className="py-10 sm:py-14">
      <div className="shell">
        <div className="text-center">
          <span className="eyebrow">ফিচারড ভিডিও</span>
          <h2 className="text-heading mt-2 font-heading text-[23px] font-bold sm:text-[30px]">
            {text(settings, "video_title", "আমাদের কাজ দেখুন")}
          </h2>
        </div>
        <div className="mt-6 overflow-hidden rounded-[26px] border border-border bg-card">
          {isFile ? (
            <video src={url} controls playsInline poster={settings.campaign_image_url} className="aspect-video w-full bg-black object-cover" />
          ) : source ? (
            <iframe src={source} title="ফিচারড ভিডিও" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="aspect-video w-full" />
          ) : (
            <div className="relative">
              <Image src={settings.campaign_image_url || settings.hero_poster_url} alt="ফিচারড ভিডিও" className="aspect-video w-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center">
                <PlayCircle className="h-14 w-14 text-white/90" />
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}