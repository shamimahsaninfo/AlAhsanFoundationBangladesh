import { RotateCcw } from "lucide-react";
import ColorField from "@/components/admin/theme/ColorField";

export default function MenuColorList({ items = [], onChange }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="font-heading text-[17px] font-semibold text-primary">প্রতিটি মেনু আইটেমের রঙ</h2>
      <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
        চাইলে প্রতিটি মেনুর লেখা আলাদা রঙে দেখাতে পারেন। খালি রাখলে উপরের মেনু বারের রঙই ব্যবহৃত হবে।
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <div key={`${item.to}-${index}`} className="rounded-xl border border-border/70 p-2.5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="truncate text-[12.5px] font-semibold text-foreground/80">{item.label || item.to}</span>
              {item.color && (
                <button type="button" onClick={() => onChange(index, "")} className="inline-flex items-center gap-1 text-[11px] text-primary">
                  <RotateCcw className="h-3 w-3" /> বাতিল
                </button>
              )}
            </div>
            <ColorField label="লেখার রঙ" value={item.color || ""} onChange={(value) => onChange(index, value)} />
          </div>
        ))}
        {!items.length && <p className="text-sm text-muted-foreground">আগে সাইট সেটিংসে মেনু আইটেম যোগ করুন।</p>}
      </div>
    </section>
  );
}