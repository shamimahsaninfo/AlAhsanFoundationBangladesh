import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

export default function MenuEditor({ items = [], onChange }) {
  const update = (index, patch) => onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  const move = (index, direction) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-[17px] font-semibold text-primary">মেনু এডিটর</h2>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            নাম, লিংক, ক্রম ও চালু/বন্ধ এখান থেকে বদলান। মোবাইল ও ডেস্কটপ — দুই জায়গার মেনুতেই এই ক্রম অনুসরণ করা হবে।
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange([...items, { label: "নতুন পাতা", to: "/", enabled: true }])}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-[12.5px]"
        >
          <Plus className="h-3.5 w-3.5" /> যোগ করুন
        </button>
      </div>

      <div className="mt-4 space-y-2.5">
        {items.map((item, index) => (
          <div key={index} className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            <label className="block text-[11.5px] font-medium text-foreground/70">মেনুর নাম
              <input
                value={item.label || ""}
                maxLength={80}
                onChange={(event) => update(index, { label: event.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[12.5px] font-normal"
              />
            </label>
            <label className="block text-[11.5px] font-medium text-foreground/70">লিংক (/activities)
              <input
                value={item.to || ""}
                maxLength={200}
                onChange={(event) => update(index, { to: event.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[12.5px] font-normal"
              />
            </label>
            <div className="flex flex-wrap items-center gap-1.5 self-end text-[12px]">
              <label className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2 py-1.5">
                <input type="checkbox" checked={item.enabled !== false} onChange={(event) => update(index, { enabled: event.target.checked })} />
                চালু
              </label>
              <button type="button" onClick={() => move(index, -1)} aria-label="উপরে" className="rounded-lg border border-border p-1.5"><ArrowUp className="h-3 w-3" /></button>
              <button type="button" onClick={() => move(index, 1)} aria-label="নিচে" className="rounded-lg border border-border p-1.5"><ArrowDown className="h-3 w-3" /></button>
              <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label="মুছুন" className="rounded-lg border border-destructive/40 p-1.5 text-destructive"><Trash2 className="h-3 w-3" /></button>
            </div>
          </div>
        ))}
        {!items.length && (
          <p className="rounded-xl border border-dashed border-border p-4 text-center text-[12.5px] text-muted-foreground">
            কোনো মেনু নেই — যোগ করুন অথবা ডিফল্টে ফিরুন।
          </p>
        )}
      </div>
    </section>
  );
}