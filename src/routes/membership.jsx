import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, IdCard, Check, ShieldCheck } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import { useSettings } from "@/components/site/SettingsContext";
import { submitMembership } from "@/lib/server-fns";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "সদস্য হন — আল আহসান ফাউন্ডেশন বাংলাদেশ" },
      { name: "description", content: "সদস্যপদের জন্য আবেদন করুন — অনুমোদনের পর QR যাচাইযোগ্য ডিজিটাল সদস্য সার্টিফিকেট পান।" },
    ],
  }),
  component: MembershipPage,
});

const TYPES = [
  { id: "general", label: "সাধারণ সদস্য" },
  { id: "volunteer", label: "স্বেচ্ছাসেবী" },
  { id: "life", label: "আজীবন সদস্য" },
];

function MembershipPage() {
  return (
    <SiteShell>
      <MembershipContent />
    </SiteShell>
  );
}

function MembershipContent() {
  const settings = useSettings();
  const submit = useServerFn(submitMembership);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    district: "",
    address: "",
    occupation: "",
    dob: "",
    motivation: "",
    membership_type: "general",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.full_name.trim().length < 2) return setError("পূর্ণ নাম লিখুন।");
    if (form.phone.trim().length < 6) return setError("সঠিক মোবাইল নম্বর দিন।");
    setBusy(true);
    try {
      await submit({ data: { ...form } });
      setDone(true);
    } catch {
      setError("আবেদন জমা নিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="shell py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <p className="eyebrow">সদস্যপদ</p>
          <h1 className="mt-3 font-heading text-[32px] font-semibold leading-tight text-primary sm:text-[40px]">
            আমাদের সাথে যোগ দিন
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            সদস্য হয়ে আপনি ফাউন্ডেশনের সিদ্ধান্ত, কার্যক্রম ও স্বচ্ছতা প্রক্রিয়ার অংশ হতে পারেন।
            আবেদন যাচাই করে অ্যাডমিন অনুমোদন দিলে আপনার নামে তৈরি হবে সদস্য নম্বর ও QR যাচাইযোগ্য
            ডিজিটাল সার্টিফিকেট।
          </p>

          <div className="mt-7 space-y-3">
            {[
              "অফিসিয়াল সদস্য আইডি ও সার্টিফিকেট (QR যাচাইযোগ্য)",
              "স্বেচ্ছাসেবী কার্যক্রমে অগ্রাধিকার",
              "মাসিক রিপোর্ট ও হিসাবের আপডেট",
              "প্রকল্প পরিদর্শনের সুযোগ",
            ].map((t) => (
              <div key={t} className="flex items-start gap-3 text-[13.5px] text-foreground/80">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" /> {t}
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-2xl border border-border bg-card p-5">
            <IdCard className="h-5 w-5 text-primary" />
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              সহায়তা প্রয়োজন? হটলাইন{" "}
              <a href={`tel:${settings.hotline}`} className="font-semibold text-primary">{settings.hotline}</a>
            </p>
          </div>
        </div>

        <div className="rounded-[26px] border border-border bg-card p-6 sm:p-8">
          {done ? (
            <div className="py-8 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-8 w-8" />
              </span>
              <h2 className="mt-5 font-heading text-[22px] font-semibold text-primary">আবেদন জমা হয়েছে</h2>
              <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-muted-foreground">
                আমাদের টিম আপনার আবেদন যাচাই করবে। অনুমোদনের পর আপনার সদস্য নম্বর ও সার্টিফিকেট
                ইমেইলে পাঠানো হবে।
              </p>
              <button
                onClick={() => setDone(false)}
                className="mt-6 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-primary"
              >
                আরেকটি আবেদন করুন
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <h2 className="font-heading text-[19px] font-semibold text-primary">সদস্যপদ আবেদন ফর্ম</h2>

              <div>
                <label className="text-[12.5px] font-medium text-foreground/75">সদস্যপদের ধরন</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => set("membership_type", t.id)}
                      className={`rounded-xl border px-2 py-2.5 text-[12.5px] font-medium transition-colors ${
                        form.membership_type === t.id
                          ? "border-primary bg-secondary text-primary"
                          : "border-border text-foreground/70 hover:border-primary/50"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="পূর্ণ নাম *" value={form.full_name} onChange={(v) => set("full_name", v)} required />
                <Field label="মোবাইল নম্বর *" value={form.phone} onChange={(v) => set("phone", v)} required placeholder="01XXXXXXXXX" />
                <Field label="ইমেইল" type="email" value={form.email} onChange={(v) => set("email", v)} placeholder="you@example.com" />
                <Field label="জেলা" value={form.district} onChange={(v) => set("district", v)} />
                <Field label="পেশা" value={form.occupation} onChange={(v) => set("occupation", v)} />
                <Field label="জন্ম তারিখ" type="date" value={form.dob} onChange={(v) => set("dob", v)} />
              </div>

              <div>
                <label className="text-[12.5px] font-medium text-foreground/75">ঠিকানা</label>
                <input
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-[14px] outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[12.5px] font-medium text-foreground/75">কেন আমাদের সাথে যুক্ত হতে চান?</label>
                <textarea
                  value={form.motivation}
                  onChange={(e) => set("motivation", e.target.value)}
                  rows={3}
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
                {busy ? "জমা হচ্ছে…" : "আবেদন জমা দিন"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder }) {
  return (
    <div>
      <label className="text-[12.5px] font-medium text-foreground/75">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-[14px] outline-none focus:border-primary"
      />
    </div>
  );
}