import { useState } from "react";
import { Loader2, Save, Palette, Plus, Trash2, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { defaultSettings } from "@/data/sampleContent";
import { saveSiteSettings, useSiteSettings } from "@/hooks/useSiteSettings";
import { Link, useRouter } from "@tanstack/react-router";

const DEFAULT_MENU = [
  { label: "হোম", to: "/" },
  { label: "কার্যক্রম", to: "/activities" },
  { label: "স্বচ্ছতা", to: "/transparency" },
  { label: "সদস্যপদ", to: "/membership" },
  { label: "আমাদের কথা", to: "/about" },
  { label: "যোগাযোগ", to: "/contact" },
];

export default function SettingsForm() {
  const { settings } = useSiteSettings();
  const router = useRouter();
  const [form, setForm] = useState({ ...settings, menu_items: settings.menu_items?.length ? settings.menu_items : DEFAULT_MENU });
  const loading = false;
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");


  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const uploadPoster = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      set("hero_poster_url", file_url);
    } catch {
      setMessage("ছবি আপলোড করা যায়নি।");
    } finally {
      setUploading(false);
    }
  };

  const uploadLogo = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      set("logo_url", file_url);
    } catch {
      setMessage("লোগো আপলোড করা যায়নি।");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const keys = Object.keys(defaultSettings).filter((key) => !key.startsWith("theme_") && !["bkash_number", "nagad_number", "rocket_number"].includes(key));
      const payload = Object.fromEntries([...keys, "menu_items"].map((key) => [key, form[key] ?? ""]));
      const saved = await saveSiteSettings(payload);
      setForm(saved);
      await router.invalidate();
      setMessage("সেটিংস সংরক্ষণ করা হয়েছে। ওয়েবসাইটে প্রতিফলিত হয়েছে।");
    } catch {
      setMessage("সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  };

  const updateMenu = (index, key, value) => {
    const next = [...(form.menu_items || [])];
    next[index] = { ...next[index], [key]: value };
    set("menu_items", next);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <form onSubmit={save} className="space-y-5 pb-20">
      <Section title="সাধারণ তথ্য" description="সংস্থার নাম, লোগো, পরিচিতি ও যোগাযোগের তথ্য।">
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-secondary/40 p-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white">
            {form.logo_url ? (
              <img src={form.logo_url} alt="লোগো" className="h-full w-full object-contain" />
            ) : (
              <span className="text-[10.5px] text-muted-foreground">লোগো নেই</span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-[12.5px] font-medium text-foreground">সংস্থার লোগো</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">হেডার, ফুটার ও রসিদে ব্যবহৃত হবে। PNG/SVG (স্বচ্ছ ব্যাকগ্রাউন্ড) ভালো মান দেয়।</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-[12px] font-medium text-primary hover:bg-secondary">
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} লোগো আপলোড
              <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadLogo(e.target.files?.[0])} />
            </label>
            {form.logo_url && (
              <button
                type="button"
                onClick={() => set("logo_url", "")}
                className="rounded-xl border border-border bg-white px-3 py-2.5 text-[12px] font-medium text-destructive"
              >
                সরান
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="সংস্থার নাম" value={form.site_name} onChange={(v) => set("site_name", v)} />
          <Input label="সংক্ষিপ্ত নাম" value={form.short_name} onChange={(v) => set("short_name", v)} />
          <Input label="ট্যাগলাইন" value={form.tagline} onChange={(v) => set("tagline", v)} />
          <Input label="হটলাইন" value={form.hotline} onChange={(v) => set("hotline", v)} />
          <Input label="ইমেইল" value={form.email} onChange={(v) => set("email", v)} />
          <Input label="ঠিকানা" value={form.address} onChange={(v) => set("address", v)} />
        </div>
        <Textarea label="আমাদের সম্পর্কে" value={form.about_text} onChange={(v) => set("about_text", v)} rows={4} />
      </Section>

      <Section title="হোম পেজ হিরো" description="প্রথম স্ক্রিনের শিরোনাম, ছবি ও ভিডিও।">
        <Input label="হিরো শিরোনাম" value={form.hero_title} onChange={(v) => set("hero_title", v)} />
        <Textarea label="হিরো সাবটাইটেল" value={form.hero_subtitle} onChange={(v) => set("hero_subtitle", v)} rows={3} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="ভিডিও লিংক (YouTube embed)"
            value={form.hero_video_url || ""}
            onChange={(v) => set("hero_video_url", v)}
            placeholder="https://www.youtube.com/embed/VIDEO_ID"
          />
          <div>
            <label className="text-[12px] font-medium text-foreground/70">হিরো ছবি</label>
            <div className="mt-1.5 flex items-center gap-2">
              {form.hero_poster_url && <img src={form.hero_poster_url} alt="" className="h-11 w-16 rounded-lg object-cover" />}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-[12px] font-medium text-primary hover:bg-secondary">
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} আপলোড
                <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadPoster(e.target.files?.[0])} />
              </label>
            </div>
          </div>
        </div>
      </Section>

      <Section title="অনুদান ও রসিদ" description="পেমেন্ট মাধ্যম শুধু সংযুক্ত গেটওয়ের নিজস্ব চেকআউটে থাকবে; এখানে আলাদা মোবাইল পেমেন্ট নম্বরের প্রয়োজন নেই।">
        <p className="text-sm text-muted-foreground">পেমেন্ট গেটওয়ে এখনো সংযুক্ত নয়। নির্দিষ্ট গেটওয়ের নাম ও API নির্দেশনা অনুযায়ী নিরাপদ সংযোগ সম্পন্ন করতে হবে। API key কখনো পাবলিক সাইট সেটিংসে রাখা হবে না।</p>
        <p className="text-sm text-muted-foreground">প্রতিটি নতুন আয়-ব্যয়ের রসিদ উপরের অফিসিয়াল ইমেইলে পাঠানোর চেষ্টা হবে। অনুমোদিত অনুদানের রসিদ দাতা ও ফাউন্ডেশন—উভয়কেই পাঠানো হবে; ব্যর্থ হলে অ্যাডমিনকে জানানো হবে। অনিবন্ধিত প্রাপকের জন্য যাচাইকৃত কাস্টম ডোমেইন প্রয়োজন।</p>
      </Section>

      <Section title="রসিদ ও সার্টিফিকেট" description="রসিদের ফুটার টেক্সট পরিবর্তন করুন।">
        <Input label="রসিদ শিরোনাম" value={form.receipt_title} onChange={(v) => set("receipt_title", v)} />
        <Textarea label="রসিদ ফুটার" value={form.receipt_footer} onChange={(v) => set("receipt_footer", v)} rows={2} />
      </Section>

      <Section title="থিম ও রঙ" description="রঙ এক জায়গা থেকেই সংরক্ষণ করা হয়; সাধারণ তথ্য সংরক্ষণ করলে থিম বদলাবে না।">
        <Link to="/admin/design" className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-primary"><Palette className="h-4 w-4" />সব রঙ ও ডিজাইন পরিবর্তন করুন</Link>
      </Section>

      <Section
        title="মেনু"
        description="ওয়েবসাইটের নেভিগেশন মেনু কাস্টমাইজ করুন।"
        action={
          <button
            type="button"
            onClick={() => set("menu_items", [...(form.menu_items || []), { label: "নতুন লিংক", to: "/" }])}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-[11.5px] font-medium text-primary hover:bg-secondary"
          >
            <Plus className="h-3.5 w-3.5" /> লিংক যোগ
          </button>
        }
      >
        <div className="space-y-2">
          {(form.menu_items || []).map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={item.label}
                onChange={(e) => updateMenu(i, "label", e.target.value)}
                placeholder="লেবেল"
                className="w-1/2 rounded-xl border border-border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-primary"
              />
              <input
                value={item.to}
                onChange={(e) => updateMenu(i, "to", e.target.value)}
                placeholder="/path"
                className="w-1/2 rounded-xl border border-border bg-white px-3 py-2.5 font-mono text-[12.5px] outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => set("menu_items", form.menu_items.filter((_, idx) => idx !== i))}
                className="rounded-lg border border-border p-2.5 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="সোশ্যাল লিংক" description="ফুটারে দেখানো হবে।">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Facebook URL" value={form.facebook_url || ""} onChange={(v) => set("facebook_url", v)} />
          <Input label="YouTube URL" value={form.youtube_url || ""} onChange={(v) => set("youtube_url", v)} />
        </div>
      </Section>

      {message && (
        <p className={`rounded-xl px-4 py-3 text-[12.5px] ${message.includes("সংরক্ষণ") ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
          {message}
        </p>
      )}

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-[13.5px] font-semibold text-primary-foreground shadow-lg disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          সেটিংস সংরক্ষণ করুন
        </button>
      </div>
    </form>
  );
}

function Section({ title, description, action, children }) {
  return (
    <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-[15.5px] font-semibold text-primary">{title}</h2>
          {description && <p className="mt-1 text-[12px] text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-[12px] font-medium text-foreground/70">{label}</label>
      <input
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-[13.5px] outline-none focus:border-primary"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3 }) {
  return (
    <div>
      <label className="text-[12px] font-medium text-foreground/70">{label}</label>
      <textarea
        value={value ?? ""}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-[13.5px] outline-none focus:border-primary"
      />
    </div>
  );
}