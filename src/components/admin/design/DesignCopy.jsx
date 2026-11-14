import { useState } from "react";
import { COPY_GROUPS } from "@/data/siteCopy";

export default function DesignCopy({ form, set }) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLocaleLowerCase("bn-BD");
  const groups = COPY_GROUPS.map((group) => ({ ...group, fields: group.fields.filter(([, label, fallback]) => `${group.title} ${label} ${fallback}`.toLocaleLowerCase("bn-BD").includes(query)) })).filter((group) => group.fields.length);
  return <section className="rounded-2xl border bg-card p-5">
    <h2 className="font-heading text-xl font-semibold">হোমপেজ, হেডার ও ফুটারের লেখা</h2>
    <p className="mt-2 text-sm text-muted-foreground">মূল পরিচিতি, হিরো ও যোগাযোগের তথ্য সাইট সেটিংসে আছে। কার্যক্রমের নিজস্ব লেখা কার্যক্রম বিভাগে পরিবর্তন করুন। এখানে ফাঁকা লেখা সংরক্ষণ করলে সেটি ফাঁকাই দেখাবে।</p>
    <input aria-label="লেখা খুঁজুন" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="লেখা বা বিভাগ খুঁজুন…" className="mt-5 w-full rounded-xl border bg-background px-4 py-3" />
    {!groups.length && <p className="mt-4 text-sm text-muted-foreground">কোনো লেখা মেলেনি।</p>}
    {groups.map((group) => <div key={group.title} className="mt-7 border-t pt-5"><h3 className="font-semibold text-primary">{group.title}</h3><div className="mt-4 grid gap-4 sm:grid-cols-2">{group.fields.map(([key, label, fallback]) => <label key={key} className="text-sm">{label}
      <textarea value={form.content_text?.[key] ?? fallback} maxLength={2000} onChange={(e) => set("content_text", { ...form.content_text, [key]: e.target.value })} rows={2} className="mt-2 w-full rounded-xl border bg-background px-3 py-2" />
    </label>)}</div></div>)}
  </section>;
}