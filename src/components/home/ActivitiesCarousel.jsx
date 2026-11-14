import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import { formatTaka, percent } from "@/lib/format";

export default function ActivitiesCarousel({ activities = [], settings }) {
  const trackRef = useRef(null);
  const indexRef = useRef(0);
  const enabled = settings?.carousel_enabled !== false;
  const interval = Math.max(2, Number(settings?.carousel_interval || 5)) * 1000;

  useEffect(() => {
    if (!enabled || activities.length < 2) return undefined;
    const timer = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      indexRef.current = (indexRef.current + 1) % activities.length;
      const card = track.children[indexRef.current];
      if (card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    }, interval);
    return () => clearInterval(timer);
  }, [enabled, interval, activities.length]);

  if (!activities.length) return null;

  return (
    <section data-color-key="home-activities" data-color-label="কার্যক্রম সেকশন" className="band-cream py-12 sm:py-16">
      <div className="shell">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">আমাদের কার্যক্রম</span>
            <h2 className="text-heading mt-2 font-heading text-[23px] font-bold sm:text-[30px]">আমাদের কার্যক্রম ওভারভিউ</h2>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
              প্রতিটি কার্যক্রমে আপনার অনুদান সরাসরি পৌঁছে যায়। আঙুল দিয়ে পাশে সোয়াইপ করে দেখুন।
            </p>
          </div>
          <Link to="/activities" className="hidden shrink-0 rounded-full border border-border px-4 py-2.5 text-[12.5px] font-medium text-primary hover:bg-card sm:inline-flex">
            সব কার্যক্রম
          </Link>
        </div>

        <div ref={trackRef} className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {activities.map((activity) => {
            const progress = percent(activity.raised_amount, activity.target_amount);
            return (
              <article key={activity.id} data-color-key={`activity-${activity.id}`} data-color-label="কার্যক্রমের কার্ড" className="w-[86%] shrink-0 snap-start overflow-hidden rounded-[22px] border border-border bg-card shadow-sm sm:w-[46%] lg:w-[31.5%]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={activity.image_url} alt={activity.title} className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10.5px] font-semibold text-white backdrop-blur">
                    {activity.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 font-heading text-[15.5px] font-semibold text-heading">{activity.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground">{activity.summary}</p>
                  <div className="mt-3 flex items-center justify-between text-[11.5px]">
                    <span className="font-semibold text-primary">{formatTaka(activity.raised_amount)}</span>
                    <span className="text-muted-foreground">লক্ষ্য {formatTaka(activity.target_amount)}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{progress}% পূর্ণ</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{activity.location}</span>
                  </div>
                  <Link to="/donate" search={{ activity: activity.id }} className="btn-donate mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12.5px] font-bold">
                    <Heart className="h-3.5 w-3.5" /> দান করুন
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}