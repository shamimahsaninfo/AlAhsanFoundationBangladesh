import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Copy, Loader2, Save, ShieldCheck } from "lucide-react";
import { getGatewayConfig, saveGatewayConfig } from "@/lib/gateway-fns";

const EMPTY = { provider_name: "", base_url: "", api_key: "", enabled: false, instructions: "", callback_url: "", api_key_hint: "" };

export default function GatewayForm() {
  const load = useServerFn(getGatewayConfig);
  const save = useServerFn(saveGatewayConfig);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load().then((data) => setForm({ ...EMPTY, ...data })).finally(() => setLoading(false)); }, []);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await save({ data: {
        provider_name: form.provider_name,
        base_url: form.base_url,
        api_key: form.api_key,
        enabled: form.enabled,
        instructions: form.instructions,
      } });
      toast.success(form.enabled ? "পেমেন্ট গেটওয়ে চালু হয়েছে।" : "সেটিংস সংরক্ষিত হয়েছে (গেটওয়ে বন্ধ)।");
      setForm({ ...form, api_key: "", api_key_hint: form.api_key ? `••••${form.api_key.slice(-4)}` : form.api_key_hint });
    } catch (error) {
      toast.error(error?.message || "সংরক্ষণ করা যায়নি।");
    } finally { setBusy(false); }
  };

  if (loading) return <div className="h-40 animate-pulse rounded-2xl bg-secondary" />;

  return (
    <form onSubmit={submit} className="card-elev max-w-3xl space-y-5 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">প্রোভাইডারের নাম
          <input value={form.provider_name} onChange={(e) => set("provider_name", e.target.value)} placeholder="যেমন: UddoktaPay / JoadPay" className="input-app mt-2" required />
        </label>
        <label className="block text-sm font-medium">বেস URL
          <input value={form.base_url} onChange={(e) => set("base_url", e.target.value)} placeholder="https://sandbox.yourgateway.com" className="input-app mt-2" required />
        </label>
      </div>
      <label className="block text-sm font-medium">API কি
        <input type="password" value={form.api_key} onChange={(e) => set("api_key", e.target.value)} placeholder={form.api_key_hint || "প্রোভাইডারের ড্যাশবোর্ড থেকে API কি দিন"} className="input-app mt-2" />
        <span className="mt-1 block text-xs text-muted-foreground">{form.api_key_hint ? `বর্তমানে সংরক্ষিত: ${form.api_key_hint} — পরিবর্তন করতে নতুন কি লিখুন।` : "API কি শুধু অ্যাডমিন দেখতে পারেন।"}</span>
      </label>
      <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm">
        <input type="checkbox" checked={form.enabled} onChange={(e) => set("enabled", e.target.checked)} className="h-4 w-4" />
        অনলাইন পেমেন্ট গেটওয়ে চালু রাখুন
      </label>
      <div className="rounded-xl border border-border bg-secondary/50 p-4 text-sm">
        <p className="font-medium">কলে ব্যাক / ওয়েবহুক URL</p>
        <p className="mt-1 flex items-center gap-2 break-all font-mono text-xs text-muted-foreground">{form.callback_url}
          <button type="button" onClick={() => { navigator.clipboard?.writeText(form.callback_url); toast.success("কপি হয়েছে"); }} className="text-primary"><Copy className="h-3.5 w-3.5" /></button>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">প্রোভাইডারের ড্যাশবোর্ডে এই লিংকটি ওয়েবহুক ও রিডাইরেক্ট URL হিসেবে দিন।</p>
      </div>
      <label className="block text-sm font-medium">অতিরিক্ত নির্দেশনা (ঐচ্ছিক)
        <textarea value={form.instructions} onChange={(e) => set("instructions", e.target.value)} rows={3} className="input-app mt-2" placeholder="যেমন: পেমেন্ট সম্পন্ন হলে রসিদের লিংক ইমেইলে যাবে।" />
      </label>
      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />পেমেন্ট সফল হওয়ার বিষয়টি সার্ভার থেকে প্রোভাইডারের কাছে যাচাই করা হয়; শুধু রিডাইরেক্ট দেখে অনুদান যাচাই হয় না।</p>
      <button type="submit" disabled={busy} className="btn-primary-app disabled:opacity-60">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}সংরক্ষণ করুন</button>
    </form>
  );
}