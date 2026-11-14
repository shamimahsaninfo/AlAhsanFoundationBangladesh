import { Link } from "@tanstack/react-router";
import { IdCard, ArrowRight, BadgeCheck } from "lucide-react";
import { useSettings } from "@/components/site/SettingsContext";
import { siteCopy } from "@/data/siteCopy";

export default function MembershipBanner() {
  const settings = useSettings();
  const t = (key) => siteCopy(settings, key);

  return (
    <section className="shell py-6">
      <div className="relative overflow-hidden rounded-[28px] bg-primary px-7 py-12 text-primary-foreground sm:px-14">
        <div
          className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
              {t("membership_eyebrow")}
            </p>
            <h2 className="mt-3 max-w-lg font-heading text-[28px] font-semibold leading-snug sm:text-[34px]">
              {t("membership_title")}
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-primary-foreground/70">
              {t("membership_description")}
            </p>
            <Link
              to="/membership"
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[14.5px] font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              {t("membership_button")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-[320px]">
            <div className="rotate-[-4deg] rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <IdCard className="h-6 w-6 text-accent" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">{t("membership_card_label")}</span>
              </div>
              <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-white/50">{t("membership_number")}</p>
              <p className="font-mono text-[17px] font-semibold tracking-wider text-white">AAF-M-001240</p>
              <div className="mt-4 flex items-center gap-2 text-[12px] text-accent">
                <BadgeCheck className="h-4 w-4" /> {t("membership_verified")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}