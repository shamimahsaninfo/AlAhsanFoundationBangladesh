import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, Check, HandCoins, Loader2, ShieldCheck } from "lucide-react";
import { getGatewayStatus, startDonation } from "@/lib/gateway-fns";
import { formatTaka } from "@/lib/format";
import GatewayNotice from "@/components/donate/GatewayNotice";
import DonationStepper from "@/components/donate/DonationStepper";
import FrequencyPicker from "@/components/donate/FrequencyPicker";
import { frequencyDays, frequencyLabel } from "@/lib/recurring";

const PRESETS = [100, 500, 1000, 2500];
const EMPTY = { full_name: "", email: "", phone: "", message: "" };

export default function RecurringDonationForm({ settings }) {
  const status = useServerFn(getGatewayStatus);
  const pay = useServerFn(startDonation);
  const [gateway, setGateway] = useState(null);
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(500);
  const [frequency, setFrequency] = useState("monthly");
  const [customDays, setCustomDays] = useState(15);
  const [donor, setDonor] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { status().then(setGateway).catch(() => setGateway({ enabled: false })); }, []);
  const set = (key, value) => setDonor((current) => ({ ...current, [key]: value }));

  const amountValue = Number(amount) || 0;
  const amountOk = amountValue >= 50;
  const contactOk = donor.full_name.trim().length >= 2 && donor.phone.trim().length >= 6 && /.+@.+\..+/.test(donor.email.trim());
  const canNext = step === 0 ? amountOk : step === 1 ? contactOk : true;

  const submit = async (event) => {
    event.preventDefault();
    if (step < 2) { if (canNext) setStep(step + 1); return; }
    if (busy || !gateway?.enabled) return;
    setError(""); setBusy(true);
    try {
      const result = await pay({
        data: {
          ...donor,
          amount: Number(amount),
          is_monthly: true,
          frequency,
          interval_days: frequencyDays(frequency, customDays),
        },
      });
      window.location.href = result.payment_url;
    } catch (err) {
      setError(err?.message || "অটো-দান শুরু করা যায়নি। আবার চেষ্টা করুন।");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card-elev overflow-hidden text-left">
      <div className="band-deep px-6 py-6 text-white">
        <p className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-accent">
          <span className="h-px w-6 bg-[hsl(var(--accent))]" /> অটো ডোনেশন
        </p>
        <h2 className="mt-2 font-heading text-[21px] font-semibold sm:text-[24px]">৩ ধাপে নিয়মিত অনুদান চালু করুন</h2>
        <p className="mt-1 text-[11.5px] text-white/65">পরিমাণ ও সময় বেছে নিন · তথ্য দিন · নিশ্চিত করুন</p>
      </div>

      <div className="p-5 sm:p-6">
        <DonationStepper step={step} />

        <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary px-4 py-3 text-primary-foreground">
          <span className="text-[11.5px] font-medium opacity-85">{frequencyLabel(frequency, customDays)}</span>
          <span className="font-heading text-[19px] font-bold">{formatTaka(amountValue)}</span>
        </div>

        {step === 0 && (
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-[12.5px] font-semibold text-heading">প্রতিবারের পরিমাণ</p>
              <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {PRESETS.map((value) => (
                  <button key={value} type="button" data-active={amountValue === value} onClick={() => setAmount(value)} className="amount-card">
                    <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] opacity-70">পরিমাণ</span>
                    <span className="flex w-full items-center justify-between">
                      <span className="font-heading text-[18px] font-bold leading-none">৳{value.toLocaleString("en-US")}</span>
                      {amountValue === value && <Check className="h-4 w-4 text-accent" />}
                    </span>
                  </button>
                ))}
              </div>
              <input type="number" min="50" max="1000000" value={amount} onChange={(event) => setAmount(event.target.value)} className="input-app mt-2.5 font-semibold" aria-label="প্রতিবারের পরিমাণ" />
              {!amountOk && <p className="mt-1 text-[11px] text-destructive">সর্বনিম্ন ৫০ টাকা দিয়ে শুরু করুন।</p>}
            </div>
            <div className="rounded-2xl border border-border bg-secondary/40 p-4">
              <FrequencyPicker value={frequency} days={customDays} onChange={(value, days) => { setFrequency(value); setCustomDays(days); }} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mt-5 space-y-3.5">
            <label className="block text-[12.5px] font-semibold text-heading">আপনার নাম
              <input value={donor.full_name} onChange={(event) => set("full_name", event.target.value)} className="input-app mt-2" required minLength={2} maxLength={90} autoComplete="name" />
            </label>
            <label className="block text-[12.5px] font-semibold text-heading">মোবাইল নম্বর
              <input value={donor.phone} onChange={(event) => set("phone", event.target.value)} className="input-app mt-2" required minLength={6} maxLength={24} inputMode="tel" autoComplete="tel" />
            </label>
            <label className="block text-[12.5px] font-semibold text-heading">ইমেইল
              <input type="email" value={donor.email} onChange={(event) => set("email", event.target.value)} className="input-app mt-2" required maxLength={120} autoComplete="email" />
            </label>
            <p className="rounded-xl bg-secondary px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
              প্রতিবারের রসিদ ও অনুস্মারক এই ইমেইলে পাঠানো হয়। তথ্য শুধু রসিদ ও যোগাযোগের জন্য ব্যবহার হয়।
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="mt-5 space-y-3">
            <dl className="divide-y divide-border rounded-2xl border border-border">
              {[["পরিমাণ", formatTaka(amountValue)], ["সময়সূচি", frequencyLabel(frequency, customDays)], ["নাম", donor.full_name], ["মোবাইল", donor.phone], ["ইমেইল", donor.email]].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <dt className="text-[11.5px] text-muted-foreground">{label}</dt>
                  <dd className="truncate text-[12.5px] font-semibold text-heading">{value}</dd>
                </div>
              ))}
            </dl>
            {gateway && !gateway.enabled && <GatewayNotice title="পেমেন্ট গেটওয়ে এখনো চালু হয়নি" note="গেটওয়ে চালু হলে এখান থেকেই নিয়মিত অনুদান শুরু করা যাবে।" />}
            {gateway?.enabled && gateway.instructions && <GatewayNotice title={gateway.provider_name || "অনলাইন পেমেন্ট"} note={gateway.instructions} />}
            <p className="flex items-start gap-2 rounded-xl bg-secondary px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              নির্ধারিত সময় পরপর গেটওয়ের মাধ্যমে ফাউন্ডেশনে যুক্ত হবে। যেকোনো সময় হটলাইনে যোগাযোগ করে বন্ধ করতে পারবেন — {settings.hotline}
            </p>
            {error && <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
          </div>
        )}

        <div className="mt-5 flex items-center gap-2.5">
          {step > 0 && (
            <button type="button" onClick={() => { setError(""); setStep(step - 1); }} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-3.5 text-[13px] font-semibold text-foreground/80">
              <ArrowLeft className="h-4 w-4" />
              পেছনে
            </button>
          )}
          {step < 2 ? (
            <button type="submit" disabled={!canNext} className="btn-primary-app flex-1 disabled:cursor-not-allowed disabled:opacity-60">
              পরবর্তী ধাপ
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="submit" disabled={busy || !gateway?.enabled} className="btn-primary-app flex-1 disabled:cursor-not-allowed disabled:opacity-60">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <HandCoins className="h-4 w-4" />}
              {busy ? "গেটওয়েতে নিয়ে যাচ্ছি…" : "অটো-দান চালু করুন"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}