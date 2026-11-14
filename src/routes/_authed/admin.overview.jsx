import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Loader2, RotateCcw, Save } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import MediaListEditor from "@/components/admin/home/MediaListEditor";
import { defaultSettings } from "@/data/sampleContent";
import { useSiteSettings, saveSiteSettings } from "@/hooks/useSiteSettings";

export const Route = createFileRoute("/_authed/admin/overview")({
  head: () => ({ meta: [{ title: "কার্যক্রম ওভারভিউ — অ্যাডমিন" }] }),
  component: AdminOverview,
});

function AdminOverview() {
  const { settings } = useSiteSettings();
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const set = (key, value) => { setMessage(""); setForm((current) => ({ ...current, [key]: value })); };

  const reset = () => {
    if (!window.confirm("ওভারভিউ সেকশনের ছবি, ভিডিও ও লেখা ডিফল্টে ফিরিয়ে নেবেন?")) return;
    setForm((current) => ({
      ...current,
      overview_enabled: defaultSettings.overview_enabled,
      overview_title: defaultSettings.overview_title,
      overview_subtitle: defaultSettings.overview_subtitle,
      overview_interval: defaultSettings.overview_interval,
      overview_media: defaultSettings.overview_media,
    }));
    setMessage("ডিফল্ট প্রস্তুত — সংরক্ষণ করুন।");
  };

  const save = async (event) => {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    try {
      const saved = await saveSiteSettings({
        overview_enabled: form.overview_enabled !== false,
        overview_title: form.overview_title || "",
        overview_subtitle: form.overview_subtitle || "",
        overview_interval: Number(form.overview_interval || 6),
        overview_media: (form.overview_media || [])
          .filter((item) => item.url)
          .slice(0, 20)
          .map((item) => ({
            media_type: item.media_type === "video" ? "video" : "image",
            url: item.url,
            title: item.title || "",
            caption: item.caption || "",
            enabled: item.enabled !== false,
          })),
      });
      setForm((current) => ({ ...current, ...saved }));
      await router.invalidate();
      setMessage("ওভারভিউ সেকশন সংরক্ষিত হয়েছে।");
    } catch (err) {
      setError(err?.message || "সংরক্ষণ করা যায়নি।");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="pb-28">
      <PageHeader
        title="কার্যক্রম ওভারভিউ"
        description="হোমপেজের আলাদা ‘আমাদের কার্যক্রম ওভারভিউ’ সেকশনে শুধু ছবি ও ভিডিও থাকবে — কোনো দান বাক্স নেই। এগুলো নিজে নিজেই অটোমেটিক ঘুরবে।"
      />

      <div className="space-y-4">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-heading text-[17px] font-semibold text-primary">সেকশন সেটিংস</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-[12.5px] font-medium">সেকশন চালু/বন্ধ
              <select
                value={form.overview_enabled === false ? "off" : "on"}
                onChange={(event) => set("overview_enabled", event.target.value === "on")}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px]"
              >
                <option value="on">চালু</option>
                <option value="off">বন্ধ</option>
              </select>
            </label>
            <label className="block text-[12.5px] font-medium">প্রতি ছবি/ভিডিও কত সেকেন্ড থাকবে
              <input
                type="number" min="2" max="30"
                value={form.overview_interval ?? 6}
                onChange={(event) => set("overview_interval", Number(event.target.value))}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px]"
              />
            </label>
            <label className="block text-[12.5px] font-medium">শিরোনাম
              <input value={form.overview_title ?? ""} maxLength={140} onChange={(event) => set("overview_title", event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px]" />
            </label>
            <label className="block text-[12.5px] font-medium">উপশিরোনাম
              <input value={form.overview_subtitle ?? ""} maxLength={400} onChange={(event) => set("overview_subtitle", event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px]" />
            </label>
          </div>
        </section>

        <MediaListEditor items={form.overview_media || []} onChange={(value) => set("overview_media", value)} />

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-heading text-[17px] font-semibold text-primary">প্রকল্প সেকশনের লেখা</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-[12.5px] font-medium">সেকশন চালু/বন্ধ
              <select
                value={form.projects_enabled === false ? "off" : "on"}
                onChange={(event) => set("projects_enabled", event.target.value === "on")}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px]"
              >
                <option value="on">চালু</option>
                <option value="off">বন্ধ</option>
              </select>
            </label>
            <label className="block text-[12.5px] font-medium">শিরোনাম
              <input value={form.projects_title ?? ""} maxLength={140} onChange={(event) => set("projects_title", event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px]" />
            </label>
            <label className="block text-[12.5px] font-medium sm:col-span-2">উপশিরোনাম
              <input value={form.projects_subtitle ?? ""} maxLength={400} onChange={(event) => set("projects_subtitle", event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px]" />
            </label>
          </div>
          <p className="mt-3 text-[11.5px] text-muted-foreground">প্রকল্প যোগ, সম্পাদনা ও চালু/বন্ধ করতে ‘প্রকল্প’ বিভাগে যান।</p>
        </section>
      </div>

      <div className="sticky bottom-3 z-20 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur">
        <div role="status" className="text-sm">{error ? <span className="text-destructive">{error}</span> : message || "পরিবর্তন সংরক্ষণ করতে ভুলবেন না।"}</div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm"><RotateCcw className="h-4 w-4" />ডিফল্টে ফিরুন</button>
          <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}সংরক্ষণ করুন
          </button>
        </div>
      </div>
    </form>
  );
}