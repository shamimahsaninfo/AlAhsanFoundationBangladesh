import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Heart, Loader2, PhoneCall, Repeat } from "lucide-react";
import { getGatewayStatus, startDonation } from "@/lib/gateway-fns";
import { formatTaka } from "@/lib/format";
import { siteCopy } from "@/data/siteCopy";
import GatewayNotice from "@/components/donate/GatewayNotice";
import FrequencyPicker from "@/components/donate/FrequencyPicker";
import { frequencyDays, frequencyLabel } from "@/lib/recurring";

const PRESETS = [500, 1000, 2500, 5000];
const EMPTY = { full_name: "", email: "", phone: "", message: "" };

export default function DonateForm({ settings, activity, project, initialAmount }) {
  const t = (key) => siteCopy(settings, key);
  const status = useServerFn(getGatewayStatus);
  const pay = useServerFn(startDonation);
  const [gateway, setGateway] = useState(null);
  const [amount, setAmount] = useState(Number(initialAmount) || 1000);
  const [donor, setDonor] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");
  const [customDays, setCustomDays] = useState(15);

  useEffect(() => { status().then(setGateway).catch(() => setGateway({ enabled: false })); }, []);
  const set = (key, value) => setDonor((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (busy || !gateway?.enabled) return;
    setError(""); setBusy(true);
    try {
      const result = await pay({
        data: {
          ...donor,
          amount: Number(amount),
          activity_id: activity?.id || "",
          project_id: project?.id || "",
          is_monthly: recurring,
          frequency: recurring ? frequency : "one_time",
          interval_days: recurring ? frequencyDays(frequency, customDays) : 30,
        },
      });
      window.location.href = result.payment_url;
    } catch (err) {
      setError(err?.message || "পেমেন্ট শুরু করা যায়নি। আবার চেষ্টা করুন।");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card-elev relative mx-auto max-w-2xl overflow-hidden">
      <div className="band-deep relative px-6 py-6 text-white">
        <p className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-accent">
          <span className="h-px w-6 bg-[hsl(var(--accent))]" />
          {project?.title || activity?.title || "সাধারণ তহবিল"}
        </p>
        <h2 className="mt-2 font-heading text-[22px] font-semibold leading-snug sm:text-[26px]">{t("donate_button")}</h2>
        <p className="mt-1 text-[11.5px] text-white/65">নিরাপদ অনলাইন পেমেন্ট · যাচাইযোগ্য ডিজিটাল রসিদ</p>
      </div>

      <div className="space-y-5 p-5 sm:p-7">
        <div>
          <p className="text-[12.5px] font-semibold text-heading">{t("amount_label")}</p>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {PRESETS.map((value) => (
              <button
                key={value}
                type="button"
                data-active={Number(amount) === value}
                onClick={() => setAmount(value)}
                className="amount-card"
              >
                <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] opacity-70">পরিমাণ</span>
                <span className="flex w-full items-center justify-between">
                  <span className="font-heading text-[19px] font-bold leading-none">৳{value.toLocaleString("en-US")}</span>
                  {Number(amount) === value && <Check className="h-4 w-4 text-accent" />}
                </span>
              </button>
            ))}
          </div>
        </div>

        <label className="block text-[12.5px] font-semibold text-heading">
          অন্য পরিমাণ (টাকা)
          <input type="number" min="50" max="1000000" value={amount} onChange={(event) => setAmount(event.target.value)} className="input-app mt-2 font-semibold" required />
        </label>

        <div className="rounded-2xl border border-border bg-secondary/40 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={recurring}
              onChange={(event) => setRecurring(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[hsl(var(--primary))]"
            />
            <span>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-heading">
                <Repeat className="h-3.5 w-3.5 text-primary" /> স্বয়ংক্রিয় (অটো) অনুদান চালু করুন
              </span>
              <span className="mt-0.5 block text-[11.5px] leading-relaxed text-muted-foreground">
                দৈনিক, সাপ্তাহিক, পাক্ষিক, মাসিক বা নিজের পছন্দের দিনে — যেকোনো সময় বন্ধ করতে পারবেন।
              </span>
            </span>
          </label>

          {recurring && (
            <div className="mt-4 border-t border-border/70 pt-4">
              <FrequencyPicker value={frequency} days={customDays} onChange={(value, days) => { setFrequency(value); setCustomDays(days); }} />
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[12.5px] font-semibold text-heading">আপনার নাম
            <input value={donor.full_name} onChange={(e) => set("full_name", e.target.value)} className="input-app mt-2" required minLength={2} maxLength={90} />
          </label>
          <label className="block text-[12.5px] font-semibold text-heading">মোবাইল নম্বর
            <input value={donor.phone} onChange={(e) => set("phone", e.target.value)} className="input-app mt-2" required minLength={6} maxLength={24} />
          </label>
        </div>
        <label className="block text-[12.5px] font-semibold text-heading">ইমেইল (রসিদ পাঠানোর জন্য)
          <input type="email" value={donor.email} onChange={(e) => set("email", e.target.value)} className="input-app mt-2" maxLength={120} />
        </label>
        <label className="block text-[12.5px] font-semibold text-heading">বার্তা (ঐচ্ছিক)
          <textarea value={donor.message} onChange={(e) => set("message", e.target.value)} rows={2} maxLength={500} className="input-app mt-2" />
        </label>

        <div className="flex items-center justify-between rounded-2xl bg-primary px-5 py-4 text-primary-foreground">
          <span className="text-[12px] font-medium opacity-80">{recurring ? frequencyLabel(frequency, customDays) : "এককালীন অনুদান"}</span>
          <span className="font-heading text-[20px] font-bold">{formatTaka(amount)}</span>
        </div>

        {gateway && !gateway.enabled && <GatewayNotice title={t("gateway_waiting")} note={t("gateway_waiting_note")} />}
        {gateway?.enabled && gateway.instructions && <GatewayNotice title={gateway.provider_name || "অনলাইন পেমেন্ট"} note={gateway.instructions} />}
        {error && <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
        <button type="submit" disabled={busy || !gateway?.enabled} className="btn-primary-app disabled:cursor-not-allowed disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
          {busy ? "গেটওয়েতে নিয়ে যাচ্ছি…" : t("gateway_pay")}
        </button>
        <a href={`tel:${settings.hotline}`} className="flex items-center justify-center gap-2 text-[12.5px] text-primary"><PhoneCall className="h-4 w-4" />{t("donate_help")} {settings.hotline}</a>
      </div>
    </form>
  );
}