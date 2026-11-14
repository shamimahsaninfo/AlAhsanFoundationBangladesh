import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Heart, Loader2, ShieldCheck } from "lucide-react";
import { getGatewayStatus, startDonation } from "@/lib/gateway-fns";
import { formatTaka } from "@/lib/format";
import { text } from "@/lib/copy";

const CHIPS = [100, 300, 500, 1000, 5000, 10000];
const FEE_RATE = 0.025;

export default function QuickDonateHome({ settings, activities = [] }) {
  const status = useServerFn(getGatewayStatus);
  const pay = useServerFn(startDonation);
  const [gateway, setGateway] = useState(null);
  const [amount, setAmount] = useState(1000);
  const [custom, setCustom] = useState(false);
  const [fund, setFund] = useState("");
  const [payFee, setPayFee] = useState(false);
  const [donor, setDonor] = useState({ full_name: "", email: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { status().then(setGateway).catch(() => setGateway({ enabled: false })); }, []);

  const base = Math.max(50, Number(amount) || 0);
  const total = payFee ? Math.round(base * (1 + FEE_RATE)) : base;
  const set = (key, value) => setDonor((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (busy || !gateway?.enabled) return;
    setError(""); setBusy(true);
    try {
      const result = await pay({ data: { ...donor, amount: total, activity_id: fund } });
      window.location.href = result.payment_url;
    } catch (err) {
      setError(err?.message || "পেমেন্ট শুরু করা যায়নি। আবার চেষ্টা করুন।");
      setBusy(false);
    }
  };

  return (
    <section data-color-key="home-donate" data-color-label="অনুদান সেকশন" className="band-cream py-12 sm:py-16">
      <div className="shell grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <span className="eyebrow">{text(settings, "quick_eyebrow", "এক ট্যাপে সহায়তা")}</span>
          <h2 className="text-heading mt-2 font-heading text-[23px] font-bold sm:text-[30px]">
            {text(settings, "quick_title", "আপনার অনুদানের পরিমাণ বেছে নিন")}
          </h2>
          <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-muted-foreground">
            {text(settings, "quick_note", "দান করুন ট্যাপ করে এগিয়ে যান। পেমেন্টের ধরন গেটওয়ের চেকআউটেই বেছে নেওয়া যাবে।")}
          </p>
          <div className="mt-5 rounded-[22px] border border-border bg-card p-4 text-[12.5px] leading-relaxed text-muted-foreground">
            <p className="flex items-center gap-2 font-semibold text-primary"><ShieldCheck className="h-4 w-4" /> নিরাপদ ও যাচাইযোগ্য</p>
            <p className="mt-2">
              পেমেন্ট সম্পন্ন হলে সার্ভারে যাচাই করে QR-যাচাইযোগ্য ডিজিটাল রসিদ তৈরি হয় এবং ইমেইলে পাঠানো হয়। কোনো মোবাইল ব্যাংকিং নম্বরে সরাসরি টাকা পাঠানোর প্রয়োজন নেই।
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="card-elev overflow-hidden p-5">
          <p className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-accent">
            <span className="h-px w-6 bg-[hsl(var(--accent))]" /> দান করুন
          </p>
          <p className="mt-1.5 font-heading text-[16px] font-semibold text-heading">অনুদানের পরিমাণ</p>
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {CHIPS.map((value) => (
              <button key={value} type="button" data-active={!custom && base === value} onClick={() => { setAmount(value); setCustom(false); }} className="amount-card items-center !px-2 !py-2.5">
                <span className="font-heading text-[14.5px] font-bold leading-none">৳{value.toLocaleString("en-US")}</span>
              </button>
            ))}
            <button type="button" data-active={custom} onClick={() => setCustom(true)} className="amount-card items-center !px-2 !py-2.5">
              <span className="font-heading text-[14.5px] font-bold leading-none">অন্যান্য</span>
            </button>
          </div>
          {custom && (
            <input aria-label="অন্যান্য পরিমাণ" type="number" min="50" max="1000000" value={amount} onChange={(event) => setAmount(event.target.value)} className="input-app mt-2" />
          )}

          <label className="mt-3 block text-[12.5px] font-medium">
            তহবিল নির্বাচন করুন
            <select value={fund} onChange={(event) => setFund(event.target.value)} className="input-app mt-1.5">
              <option value="">সাধারণ তহবিল</option>
              {activities.map((activity) => <option key={activity.id} value={activity.id}>{activity.title}</option>)}
            </select>
          </label>

          <div className="mt-3 grid gap-2">
            <input required minLength={2} maxLength={90} placeholder="আপনার নাম" value={donor.full_name} onChange={(event) => set("full_name", event.target.value)} className="input-app" />
            <input required minLength={6} maxLength={24} placeholder="মোবাইল নম্বর" value={donor.phone} onChange={(event) => set("phone", event.target.value)} className="input-app" />
            <input type="email" maxLength={120} placeholder="ইমেইল (রসিদের জন্য)" value={donor.email} onChange={(event) => set("email", event.target.value)} className="input-app" />
          </div>

          <label className="mt-3 flex items-center gap-2 text-[12px] text-foreground/80">
            <input type="checkbox" checked={payFee} onChange={(event) => setPayFee(event.target.checked)} className="h-4 w-4" />
            গেটওয়ে ফি বহন করতে চাই (২.৫%)
          </label>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-secondary px-3.5 py-2.5">
            <span className="text-[12.5px] text-foreground/70">মোট পরিমাণ</span>
            <span className="font-heading text-[17px] font-bold text-primary">{formatTaka(total)}</span>
          </div>

          {gateway && !gateway.enabled && (
            <p className="mt-3 rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-[11.5px] leading-relaxed text-muted-foreground">
              {text(settings, "gateway_waiting", "অনলাইন পেমেন্ট গেটওয়ে এখনো সংযুক্ত হয়নি।")}
            </p>
          )}
          {error && <p role="alert" className="mt-3 rounded-xl bg-destructive/10 px-3.5 py-2.5 text-[11.5px] text-destructive">{error}</p>}

          <button type="submit" disabled={busy || !gateway?.enabled} className="btn-donate mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[14px] font-bold disabled:cursor-not-allowed disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
            {busy ? "গেটওয়েতে নিয়ে যাচ্ছি…" : "দান করুন"}
          </button>
          <p className="mt-2.5 text-center text-[10.5px] leading-relaxed text-muted-foreground">
            ‘দান করুন’ চাপলে আপনি শর্তাবলী, গোপনীয়তা নীতি ও ফেরত নীতির সাথে সম্মত হচ্ছেন।
          </p>
        </form>
      </div>
    </section>
  );
}