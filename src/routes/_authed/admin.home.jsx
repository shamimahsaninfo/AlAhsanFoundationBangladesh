import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Loader2, Save, RotateCcw } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import SlidesEditor from "@/components/admin/home/SlidesEditor";
import ItemsEditor from "@/components/admin/home/ItemsEditor";
import ImageField from "@/components/admin/ImageField";
import { BANNER_FIELDS, HOME_TEXT_FIELDS } from "@/data/homeFields";
import { defaultSettings } from "@/data/sampleContent";
import { useSiteSettings, saveSiteSettings } from "@/hooks/useSiteSettings";

export const Route = createFileRoute("/_authed/admin/home")({
  head: () => ({ meta: [{ title: "হোমপেজ — অ্যাডমিন" }] }),
  component: AdminHome,
});

function AdminHome() {
  const { settings } = useSiteSettings();
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const set = (key, value) => { setMessage(""); setForm((current) => ({ ...current, [key]: value })); };
  const setText = (key, value) => set("content_text", { ...(form.content_text || {}), [key]: value });

  const reset = () => {
    if (!window.confirm("হোমপেজের ছবি, স্লাইড ও সেকশন ডিফল্টে ফিরিয়ে নেবেন?")) return;
    setForm((current) => ({
      ...current,
      ...Object.fromEntries(["hero_slides", "hero_slides_enabled", "hero_interval", "hero_effect", "carousel_enabled", "carousel_interval", "mission_items", "faqs", "footer_links"].map((key) => [key, defaultSettings[key]])),
    }));
    setMessage("ডিফল্ট প্রস্তুত — সংরক্ষণ করুন।");
  };

  const save = async (event) => {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const values = {
        hero_title: form.hero_title || "",
        hero_subtitle: form.hero_subtitle || "",
        hero_button_member: form.hero_button_member || "",
        hero_button_auto: form.hero_button_auto || "",
        donor_label: form.donor_label || "",
        donor_link: form.donor_link || "/verify",
        office_hours: form.office_hours || "",
        featured_video_url: form.featured_video_url || "",
        campaign_image_url: form.campaign_image_url || "",
        hero_slides_enabled: form.hero_slides_enabled !== false,
        hero_interval: Number(form.hero_interval || 6),
        hero_effect: form.hero_effect === "slide" ? "slide" : "fade",
        carousel_enabled: form.carousel_enabled !== false,
        carousel_interval: Number(form.carousel_interval || 5),
        content_text: Object.fromEntries(Object.entries(form.content_text || {}).map(([key, value]) => [key, String(value).slice(0, 2000)])),
      };
      const saved = await saveSiteSettings({
        ...values,
        hero_slides: (form.hero_slides || []).filter((slide) => slide.image_url).slice(0, 12).map((slide) => ({
          image_url: slide.image_url, title: slide.title || "", subtitle: slide.subtitle || "", enabled: slide.enabled !== false,
        })),
        mission_items: (form.mission_items || []).filter((item) => item.title).slice(0, 30),
        faqs: (form.faqs || []).filter((item) => item.question).slice(0, 30),
        footer_links: (form.footer_links || []).filter((item) => item.label && item.to).slice(0, 15),
      });
      setForm(saved);
      await router.invalidate();
      setMessage("হোমপেজ সংরক্ষিত হয়েছে।");
    } catch (err) { setError(err?.message || "সংরক্ষণ করা যায়নি।"); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={save} className="pb-28">
      <PageHeader title="হোমপেজ" description="ব্যানার, ছবি, স্লাইড, অটো ক্যারোসেল, তহবিল, দুআ, FAQ, যোগাযোগ ও ফুটারের লিংক এখান থেকে নিয়ন্ত্রণ করুন।" />
      <div className="space-y-4">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-heading text-[17px] font-semibold text-primary">ব্যানারের নাম, স্লোগান ও বাটন</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {BANNER_FIELDS.map(([key, label, max]) => (
              <label key={key} className="block text-[12.5px] font-medium text-foreground/80">{label}
                <input value={form[key] ?? ""} maxLength={max} onChange={(event) => set(key, event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] font-normal" />
              </label>
            ))}
            <label className="block text-[12.5px] font-medium text-foreground/80">ব্যানার স্লাইডশো
              <select value={form.hero_slides_enabled === false ? "off" : "on"} onChange={(event) => set("hero_slides_enabled", event.target.value === "on")} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px]">
                <option value="on">চালু</option><option value="off">বন্ধ</option>
              </select>
            </label>
            <label className="block text-[12.5px] font-medium text-foreground/80">ছবি বদলানোর সময় (সেকেন্ড)
              <input type="number" min="2" max="30" value={form.hero_interval ?? 6} onChange={(event) => set("hero_interval", Number(event.target.value))} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] font-normal" />
            </label>
            <label className="block text-[12.5px] font-medium text-foreground/80">ইফেক্ট
              <select value={form.hero_effect || "fade"} onChange={(event) => set("hero_effect", event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px]">
                <option value="fade">ফেড (মিলিয়ে যাওয়া)</option><option value="slide">স্লাইড (পাশে সরা)</option>
              </select>
            </label>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-[12.5px] font-medium text-foreground/80">অফিস সময়
              <input value={form.office_hours ?? ""} maxLength={120} onChange={(event) => set("office_hours", event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] font-normal" />
            </label>
            <label className="block text-[12.5px] font-medium text-foreground/80">ফিচারড ভিডিওর লিংক (YouTube বা MP4)
              <input value={form.featured_video_url ?? ""} maxLength={500} onChange={(event) => set("featured_video_url", event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] font-normal" />
            </label>
          </div>
          <div className="mt-4">
            <ImageField
              label="অটো-দান, ‘আমাদের সম্পর্কে’ ও ভিডিও অংশের ছবি"
              hint="এই ছবিটি অটো-দান ব্যানারে, আমাদের সম্পর্কে অংশে এবং ফিচারড ভিডিওর পোস্টারে দেখা যায়।"
              value={form.campaign_image_url || ""}
              onChange={(url) => set("campaign_image_url", url)}
            />
          </div>
        </section>

        <SlidesEditor slides={form.hero_slides || []} onChange={(value) => set("hero_slides", value)} />

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-heading text-[17px] font-semibold text-primary">কার্যক্রম ক্যারোসেল</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-[12.5px] font-medium text-foreground/80">অটো ক্যারোসেল
              <select value={form.carousel_enabled === false ? "off" : "on"} onChange={(event) => set("carousel_enabled", event.target.value === "on")} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px]">
                <option value="on">চালু</option><option value="off">বন্ধ</option>
              </select>
            </label>
            <label className="block text-[12.5px] font-medium text-foreground/80">ঘোরার গতি (সেকেন্ড)
              <input type="number" min="2" max="20" value={form.carousel_interval ?? 5} onChange={(event) => set("carousel_interval", Number(event.target.value))} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] font-normal" />
            </label>
          </div>
          <p className="mt-3 text-[11.5px] text-muted-foreground">কার্যক্রমের ক্রম ও ছবি ‘কার্যক্রম’ বিভাগ থেকে নিয়ন্ত্রণ করুন।</p>
        </section>

        <ItemsEditor title="লক্ষ্য ও উদ্দেশ্য" description="হোমপেজের তালিকা হিসেবে দেখানো হবে।" items={form.mission_items || []} blank={{ title: "", description: "" }}
          fields={[{ key: "title", label: "শিরোনাম" }, { key: "description", label: "বিবরণ", multiline: true }]}
          onChange={(value) => set("mission_items", value)} />

        <ItemsEditor title="সাধারণ জিজ্ঞাসা (FAQ)" items={form.faqs || []} blank={{ question: "", answer: "" }}
          fields={[{ key: "question", label: "প্রশ্ন" }, { key: "answer", label: "উত্তর", multiline: true }]}
          onChange={(value) => set("faqs", value)} />

        <ItemsEditor title="ফুটারের লিংক" description="শর্তাবলী, গোপনীয়তা নীতি ও ফেরত নীতির লিংক।" items={form.footer_links || []} blank={{ label: "", to: "/terms" }}
          fields={[{ key: "label", label: "লেখা" }, { key: "to", label: "লিংক (/terms)" }]}
          onChange={(value) => set("footer_links", value)} />

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-heading text-[17px] font-semibold text-primary">সেকশনের লেখা</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {HOME_TEXT_FIELDS.map(([key, label, fallback]) => (
              <label key={key} className="block text-[12.5px] font-medium text-foreground/80">{label}
                <textarea value={form.content_text?.[key] ?? fallback} maxLength={2000} rows={2} onChange={(event) => setText(key, event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] font-normal" />
              </label>
            ))}
          </div>
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