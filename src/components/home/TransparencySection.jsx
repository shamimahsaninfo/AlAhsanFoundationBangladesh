import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ShieldCheck, TrendingDown, TrendingUp, QrCode, Wallet } from "lucide-react";
import { formatCompact } from "@/lib/format";
import { useSettings } from "@/components/site/SettingsContext";
import { siteCopy } from "@/data/siteCopy";

export default function TransparencySection({ income = 0, expense = 0 }) {
  const settings = useSettings();
  const t = (key) => siteCopy(settings, key);
  const utilization = income ? Math.round((expense / income) * 100) : 0;
  const balance = Math.max(income - expense, 0);

  return (
    <section data-color-key="home-transparency" data-color-label="স্বচ্ছতার হিসাব" className="band-deep relative overflow-hidden py-14 text-white sm:py-20">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[hsl(var(--deep-glow))]/20 blur-3xl" />
      <div className="shell relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              <ShieldCheck className="h-3.5 w-3.5" /> {t("transparency_eyebrow")}
            </span>
            <h2 className="mt-4 font-heading text-[27px] font-bold leading-[1.32] sm:text-[36px]">
              {t("transparency_title")} <span className="text-gold">{t("transparency_highlight")}</span>
            </h2>
            <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-white/65 sm:text-[14.5px]">
              {t("transparency_description")}
            </p>

            <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
              {[
                { icon: TrendingUp, label: t("income_label"), value: formatCompact(income) },
                { icon: TrendingDown, label: t("expense_label"), value: formatCompact(expense) },
                { icon: Wallet, label: t("balance_label"), value: formatCompact(balance) },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/12 bg-white/[0.06] p-3.5 backdrop-blur">
                  <s.icon className="h-4 w-4 text-accent" />
                  <p className="mt-2 font-heading text-[17px] font-bold text-white">{s.value}</p>
                  <p className="text-[10.5px] text-white/50">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/12 bg-white/[0.05] p-4">
              <div className="flex items-center justify-between text-[11.5px]">
                <span className="text-white/60">{t("utilization_label")}</span>
                <span className="font-semibold text-accent">{utilization}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/12">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-[hsl(var(--accent-end))]"
                  style={{ width: `${Math.min(utilization, 100)}%` }}
                />
              </div>
            </div>

            <Link
              to="/transparency"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[13.5px] font-bold text-primary"
            >
              {t("accounts_button")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <p className="sr-only">{t("accounts_button")}</p>
          </div>

          <div className="relative mx-auto w-full max-w-sm animate-float">
            <div className="absolute inset-x-6 -bottom-3 h-full rounded-3xl bg-white/10" />
            <div className="relative rounded-3xl bg-background p-5 text-foreground shadow-[0_40px_80px_-40px_hsl(var(--shade)/0.6)]">
              <div className="flex items-start justify-between border-b border-border pb-3.5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{t("receipt_example_title")}</p>
                  <p className="mt-1 font-mono text-[14px] font-bold text-primary">AAF-2026-000482</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card">
                  <QrCode className="h-7 w-7 text-primary" />
                </div>
              </div>
              <div className="space-y-2.5 py-3.5 text-[12px]">
                {[
                  ["খাত", "শীতবস্ত্র বিতরণ"],
                  ["ধরন", "ব্যয় (Expense)"],
                  ["পরিমাণ", "৳ ১৮,৪০০"],
                  ["তারিখ", "18 Jan 2026"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-semibold text-foreground">{v}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-primary/8 px-3.5 py-2.5 text-[10.5px] leading-relaxed text-primary">
                {t("receipt_example_note")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}