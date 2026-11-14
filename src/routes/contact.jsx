import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin, Loader2, Check } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import { useSettings } from "@/components/site/SettingsContext";
import { base44 } from "@/api/base44Client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "যোগাযোগ — আল আহসান ফাউন্ডেশন বাংলাদেশ" },
      { name: "description", content: "হটলাইন, ইমেইল ও ঠিকানা — আমাদের সাথে যোগাযোগ করুন।" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteShell>
      <ContactContent />
    </SiteShell>
  );
}

function ContactContent() {
  const settings = useSettings();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.message.trim()) return setError("নাম ও বার্তা লিখুন।");
    setBusy(true);
    try {
      await base44.entities.ContactMessage.create({ ...form, status: "new" });
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setError("বার্তা পাঠানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  };

  const CARDS = [
    { icon: Phone, label: "হটলাইন", value: settings.hotline, href: `tel:${settings.hotline}` },
    { icon: Mail, label: "ইমেইল", value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: "ঠিকানা", value: settings.address },
  ];

  return (
    <div className="shell py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow">যোগাযোগ</p>
          <h1 className="mt-3 font-heading text-[32px] font-semibold leading-tight text-primary sm:text-[40px]">
            আমরা আপনার কথা শুনতে চাই
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            অনুদান, সদস্যপদ, স্বেচ্ছাসেবা বা যেকোনো জিজ্ঞাসায় আমাদের সাথে যোগাযোগ করুন।
          </p>

          <div className="mt-8 space-y-3">
            {CARDS.map((c) => (
              <div key={c.label} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <c.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} className="mt-0.5 block break-all text-[14.5px] font-medium text-primary">{c.value}</a>
                  ) : (
                    <p className="mt-0.5 text-[14.5px] font-medium text-primary">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-border bg-card p-6 sm:p-8">
          {sent ? (
            <div className="py-12 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="h-7 w-7" />
              </span>
              <h2 className="mt-4 font-heading text-[20px] font-semibold text-primary">বার্তা পাঠানো হয়েছে</h2>
              <p className="mt-2 text-[13.5px] text-muted-foreground">আমরা যত দ্রুত সম্ভব যোগাযোগ করব।</p>
              <button onClick={() => setSent(false)} className="mt-5 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-primary">
                নতুন বার্তা
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="নাম *" value={form.name} onChange={(v) => set("name", v)} required />
                <Input label="মোবাইল" value={form.phone} onChange={(v) => set("phone", v)} />
                <Input label="ইমেইল" type="email" value={form.email} onChange={(v) => set("email", v)} />
                <Input label="বিষয়" value={form.subject} onChange={(v) => set("subject", v)} />
              </div>
              <div>
                <label className="text-[12.5px] font-medium text-foreground/75">বার্তা *</label>
                <textarea
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  rows={5}
                  required
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-[14px] outline-none focus:border-primary"
                />
              </div>
              {error && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-[12.5px] text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-[14.5px] font-semibold text-primary-foreground disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {busy ? "পাঠানো হচ্ছে…" : "বার্তা পাঠান"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required }) {
  return (
    <div>
      <label className="text-[12.5px] font-medium text-foreground/75">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-[14px] outline-none focus:border-primary"
      />
    </div>
  );
}