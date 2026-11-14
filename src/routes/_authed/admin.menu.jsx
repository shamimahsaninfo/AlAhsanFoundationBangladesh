import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Loader2, RotateCcw, Save } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import MenuEditor from "@/components/admin/MenuEditor";
import { DEFAULT_NAV } from "@/lib/nav";
import { useSiteSettings, saveSiteSettings } from "@/hooks/useSiteSettings";

export const Route = createFileRoute("/_authed/admin/menu")({
  head: () => ({ meta: [{ title: "মেনু এডিটর — অ্যাডমিন" }] }),
  component: AdminMenu,
});

function AdminMenu() {
  const { settings } = useSiteSettings();
  const router = useRouter();
  const [items, setItems] = useState(
    Array.isArray(settings.menu_items) && settings.menu_items.length ? settings.menu_items : DEFAULT_NAV
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const save = async (event) => {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    try {
      const clean = items
        .filter((item) => item.label?.trim() && item.to?.trim().startsWith("/"))
        .slice(0, 30)
        .map((item) => ({
          label: item.label.trim().slice(0, 80),
          to: item.to.trim().slice(0, 200),
          enabled: item.enabled !== false,
          ...(item.color ? { color: item.color } : {}),
        }));
      const saved = await saveSiteSettings({ menu_items: clean });
      setItems(Array.isArray(saved.menu_items) && saved.menu_items.length ? saved.menu_items : clean);
      await router.invalidate();
      setMessage("মেনু সংরক্ষিত হয়েছে — সাইটে সাথে সাথে দেখা যাবে।");
    } catch (err) {
      setError(err?.message || "সংরক্ষণ করা যায়নি।");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="pb-28">
      <PageHeader
        title="মেনু এডিটর"
        description="ওয়েবসাইটের মেনুর নাম, লিংক, ক্রম ও চালু/বন্ধ অবস্থা নিয়ন্ত্রণ করুন। বন্ধ করা মেনু সাইটে দেখাবে না।"
      />

      <MenuEditor items={items} onChange={(value) => { setMessage(""); setItems(value); }} />

      <div className="sticky bottom-3 z-20 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur">
        <div role="status" className="text-sm">{error ? <span className="text-destructive">{error}</span> : message || "পরিবর্তন সংরক্ষণ করতে ভুলবেন না।"}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setItems(DEFAULT_NAV); setMessage("ডিফল্ট মেনু প্রস্তুত — সংরক্ষণ করুন।"); }}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm"
          >
            <RotateCcw className="h-4 w-4" />ডিফল্ট মেনু
          </button>
          <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}সংরক্ষণ করুন
          </button>
        </div>
      </div>
    </form>
  );
}