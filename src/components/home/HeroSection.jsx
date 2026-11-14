import { Link } from "@tanstack/react-router";
import { Heart, ShieldCheck, PlayCircle, Sparkles } from "lucide-react";
import QuickDonation from "@/components/home/QuickDonation";
import { formatCompact } from "@/lib/format";
import { siteCopy } from "@/data/siteCopy";

export default function HeroSection({ settings, totalRaised = 0 }) {
  const t = (key) => siteCopy(settings, key);
  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${settings.hero_poster_url})` }}
        aria-hidden="true"
      />
      {settings.hero_video_url && (
        <iframe
          src={settings.hero_video_url}
          title="আল আহসান ফাউন্ডেশনের কার্যক্রম"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      )}
      <div className="band-deep absolute inset-0 -z-10 opacity-95" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[hsl(var(--deep-end))] via-[hsl(var(--deep-end))]/40 to-transparent" />

      <div className="shell relative py-12 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11.5px] font-medium text-white/85 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              {settings.tagline}
            </span>

            <h1 className="mt-5 font-heading text-[30px] font-bold leading-[1.28] text-white sm:text-[42px] lg:text-[52px]">
              {settings.hero_title}
            </h1>
            <div className="gold-line mt-4 h-[3px] w-24 rounded-full" />
            <p className="mt-4 max-w-xl text-[14.5px] leading-[1.75] text-white/75 sm:text-[16px]">
              {settings.hero_subtitle}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/donate" className="cta-gold group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14.5px] font-bold shadow-lg transition-transform hover:-translate-y-0.5">
                <Heart className="h-4 w-4" strokeWidth={2.6} />
                {t("donate_now")}
              </Link>
              <Link
                to="/activities"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-3.5 text-[14.5px] font-medium text-white/90 backdrop-blur transition-colors hover:border-accent hover:text-accent"
              >
                <PlayCircle className="h-4 w-4" />
                {t("view_activities")}
              </Link>
            </div>

            <div className="mt-8 grid max-w-lg grid-cols-2 gap-2.5 text-white/75 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, label: t("hero_receipt") },
                { icon: ShieldCheck, label: t("hero_accounts") },
                { icon: Heart, label: `${formatCompact(totalRaised)} ${t("hero_raised")}` },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.06] px-3 py-2.5 text-[11.5px] backdrop-blur">
                  <t.icon className="h-3.5 w-3.5 shrink-0 text-accent" />
                  <span className="leading-tight">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          <QuickDonation settings={settings} />
        </div>
      </div>
    </section>
  );
}