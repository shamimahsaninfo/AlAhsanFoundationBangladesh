import { Plus, Trash2 } from "lucide-react";

export default function ItemsEditor({ title, description, items = [], fields, blank, onChange }) {
  const update = (index, key, value) => onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-[17px] font-semibold text-primary">{title}</h2>
          {description && <p className="mt-1 text-[12.5px] text-muted-foreground">{description}</p>}
        </div>
        <button type="button" onClick={() => onChange([...items, { ...blank }])} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-[12.5px]">
          <Plus className="h-3.5 w-3.5" />যোগ করুন
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-xl border border-border p-3">
            <div className="grid gap-2">
              {fields.map((field) => (
                <label key={field.key} className="block text-[12px] font-medium text-foreground/80">
                  {field.label}
                  {field.multiline ? (
                    <textarea value={item[field.key] || ""} maxLength={field.max || 2000} rows={2} onChange={(e) => update(index, field.key, e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[12.5px] font-normal" />
                  ) : (
                    <input value={item[field.key] || ""} maxLength={field.max || 300} onChange={(e) => update(index, field.key, e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[12.5px] font-normal" />
                  )}
                </label>
              ))}
            </div>
            <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="mt-2 inline-flex items-center gap-1 text-[11.5px] text-destructive">
              <Trash2 className="h-3 w-3" />মুছুন
            </button>
          </div>
        ))}
        {!items.length && <p className="rounded-xl border border-dashed border-border p-4 text-center text-[12.5px] text-muted-foreground">কিছু যোগ করা হয়নি।</p>}
      </div>
    </section>
  );
}