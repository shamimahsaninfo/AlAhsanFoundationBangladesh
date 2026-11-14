import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ShieldCheck } from "lucide-react";
import { siteCopy } from "@/data/siteCopy";

export default function QuickDonation({ settings }) {
  const [amount, setAmount] = useState(1000);
  const t = (key) => siteCopy(settings, key);
  return <div className="animate-rise rounded-[var(--site-card-radius)] border border-white/15 bg-white/[0.07] p-5 backdrop-blur-xl">
    <p className="text-[11px] font-semibold text-accent">{t("quick_eyebrow")}</p>
    <h2 className="mt-2 text-xl font-semibold text-white">{t("quick_title")}</h2>
    <div className="mt-5 grid grid-cols-4 gap-2">{[500, 1000, 2500, 5000].map((value) => <button key={value} type="button" onClick={() => setAmount(value)} className={`rounded-xl py-3 text-sm font-bold ${amount === value ? "bg-white text-primary" : "border border-white/20 text-white"}`}>৳{value.toLocaleString("en-US")}</button>)}</div>
    <label className="mt-3 flex items-center gap-3 rounded-xl border border-white/20 px-4 py-3 text-sm text-white">
      {t("amount_label")}<input aria-label={t("amount_label")} type="number" min="50" max="1000000" value={amount} onChange={(event) => setAmount(event.target.value)} className="min-w-0 flex-1 bg-transparent text-right font-semibold outline-none" />৳
    </label>
    <Link to="/donate" search={{ amount: Math.max(50, Number(amount) || 1000) }} className="btn-gold-app mt-4"><Heart className="h-4 w-4" />{t("donate_button")}</Link>
    <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-white/65"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />{t("quick_note")}</p>
  </div>;
}