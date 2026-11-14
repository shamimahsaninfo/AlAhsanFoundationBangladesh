import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, HandCoins, UserPlus, ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react";
import { Image } from "@/components/ui/image";
import { safeLink } from "@/lib/copy";

export default function HeroBanner({ settings }) {
  const slides = (settings.hero_slides || []).filter((slide) => slide.enabled !== false && slide.image_url);
  const enabled = settings.hero_slides_enabled !== false && slides.length > 0;
  const [index, setIndex] = useState(0);
  const interval = Math.max(2, Number(settings.hero_interval || 6)) * 1000;
  const slideEffect = settings.hero_effect === "slide";

  useEffect(() => {
    if (!enabled || slides.length < 2) return undefined;
    const timer = setInterval(() => setIndex((current) => (current + 1) % slides.length), interval);
    return () => clearInterval(timer);
  }, [enabled, interval, slides.length]);

  useEffect(() => { if (index > slides.length - 1) setIndex(0); }, [index, slides.length]);

  const current = slides[index] || {};
  const total = slides.length || 1;

  return (
    <section data-color-key="home-hero" data-color-label="হিরো ব্যানার" className="hero-banner relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {enabled ? slides.map((slide, i) => (
          <div
            key={`${slide.image_url}-${i}`}
            className="absolute inset-0 transition-all duration-1000 ease-out"
            style={{
              opacity: i === index ? 1 : 0,
              transform: slideEffect ? `translateX(${(i - index) * 12}%)` : "none",
            }}
          >
            <Image src={slide.image_url} alt={slide.title || settings.site_name} className="h-full w-full object-cover" />
          </div>
        )) : (
          <Image src={settings.hero_poster_url} alt={settings.site_name} className="h-full w-full object-cover" />
        )}
        <div data-color-backdrop="true" className="hero-banner absolute inset-0" />
      </div>

      <div className="shell relative flex min-h-[520px] flex-col justify-center py-14 sm:min-h-[560px] sm:py-20">
        <span className="hero-accent text-[11px] font-semibold uppercase tracking-[0.22em]">{settings.site_name}</span>
        <h1 className="hero-title mt-3 max-w-3xl font-heading text-[27px] font-bold leading-[1.28] sm:text-[38px] lg:text-[46px]">
          {current.title || settings.hero_title}
        </h1>
        <p className="hero-subtitle mt-3 max-w-xl text-[13.5px] leading-relaxed sm:text-[15.5px]">
          {current.subtitle || settings.hero_subtitle}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <Link to="/membership" className="btn-member inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-[13.5px] font-semibold shadow-sm transition-transform hover:-translate-y-0.5">
            <UserPlus className="h-4 w-4" /> {settings.hero_button_member || "সদস্য হন"}
          </Link>
          <Link to="/auto-donation" className="btn-auto inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-[13.5px] font-semibold shadow-sm transition-transform hover:-translate-y-0.5">
            <HandCoins className="h-4 w-4" /> {settings.hero_button_auto || "অটো ডোনেশন"}
          </Link>
          <Link to="/donate" className="btn-donate inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-[13.5px] font-bold shadow-sm transition-transform hover:-translate-y-0.5">
            <Heart className="h-4 w-4" /> দান করুন
          </Link>
          <Link to={safeLink(settings.donor_link, "/verify")} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-4 py-3 text-[12.5px] font-medium text-white/85 transition-colors hover:border-white/50">
            <LayoutDashboard className="h-4 w-4" /> {settings.donor_label || "ডোনার ড্যাশবোর্ড"}
          </Link>
        </div>

        {slides.length > 1 && (
          <div className="mt-8 flex items-center gap-3">
            <button type="button" onClick={() => setIndex((index - 1 + total) % total)} aria-label="আগের ছবি" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/80 hover:border-white/60">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5">
              {slides.map((slide, i) => (
                <button key={i} type="button" aria-label={`ছবি ${i + 1}`} onClick={() => setIndex(i)} className="h-1.5 rounded-full transition-all" style={{ width: i === index ? 26 : 10, background: i === index ? "hsl(var(--banner-accent))" : "rgba(255,255,255,0.4)" }} />
              ))}
            </div>
            <button type="button" onClick={() => setIndex((index + 1) % total)} aria-label="পরের ছবি" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/80 hover:border-white/60">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}