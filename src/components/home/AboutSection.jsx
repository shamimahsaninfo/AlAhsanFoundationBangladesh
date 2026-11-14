import { ShieldCheck, HeartHandshake, Eye, Sprout } from "lucide-react";
import { siteCopy } from "@/data/siteCopy";

const VALUE_ICONS = [ShieldCheck, HeartHandshake, Eye, Sprout];

export default function AboutSection({ settings }) {
  const t = (key) => siteCopy(settings, key);
  const values = VALUE_ICONS.map((icon, i) => ({
    icon,
    title: t(`value_${i + 1}_title`),
    text: t(`value_${i + 1}_text`),
  }));

  return (
    <section className="shell py-20">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="relative">
          <div className="overflow-hidden rounded-[26px]">
            <img
              src={settings.hero_poster_url}
              alt="আল আহসান ফাউন্ডেশনের কার্যক্রম"
              className="h-[380px] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-6 right-6 rounded-2xl bg-primary px-6 py-5 text-primary-foreground shadow-xl sm:right-auto sm:w-[290px]">
            <p className="font-heading text-[15px] leading-snug">{t("about_quote")}</p>
            <p className="mt-2 text-[11.5px] uppercase tracking-[0.16em] text-accent">{settings.short_name}</p>
          </div>
        </div>

        <div>
          <p className="eyebrow">{t("about_eyebrow")}</p>
          <h2 className="mt-3 font-heading text-[30px] font-semibold leading-tight text-primary sm:text-[36px]">
            {t("about_title")}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{settings.about_text}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-5">
                <v.icon className="h-5 w-5 text-accent-foreground" />
                <p className="mt-3 font-heading text-[15.5px] font-semibold text-foreground">{v.title}</p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}