import { Eye } from "lucide-react";
import { StyleSection, StyleSelect, StyleSegmented, StyleSlider } from "@/components/admin/visual/StyleField";
import { FONT_OPTIONS, SHADOW_PRESETS } from "@/lib/visual-style";

export default function VisualGlobalPanel({ studio }) {
  const globals = studio.draft.visual_global || {};
  const hidden = (studio.draft.visual_styles || []).filter((rule) => rule.props?.hidden);
  const set = (key, value) => studio.setGlobal(key, value);
  return (
    <details className="mt-4 rounded-2xl border border-primary/20 bg-card p-4" open>
      <summary className="cursor-pointer text-sm font-semibold text-primary">গ্লোবাল ডিফল্ট — পুরো সাইটের বাটন, কার্ড, ইনপুট ও ছবি</summary>
      <fieldset disabled={studio.busy} className="mt-4 grid gap-4 sm:grid-cols-2">
        <StyleSection title="কোণা ও ছায়া">
          <StyleSlider label="সব বাটনের কোণা" value={globals.button_radius} fallback={16} min={0} max={999} suffix="px" onChange={(value) => set("button_radius", value)} />
          <StyleSlider label="সব কার্ডের কোণা" value={globals.card_radius} fallback={26} min={0} max={999} suffix="px" onChange={(value) => set("card_radius", value)} />
          <StyleSlider label="সব ইনপুটের কোণা" value={globals.input_radius} fallback={16} min={0} max={999} suffix="px" onChange={(value) => set("input_radius", value)} />
          <StyleSlider label="সব ছবির কোণা" value={globals.image_radius} fallback={0} min={0} max={999} suffix="px" onChange={(value) => set("image_radius", value)} />
          <StyleSegmented label="সব কার্ডের ছায়া" value={globals.shadow} fallback="" options={SHADOW_PRESETS} onChange={(value) => set("shadow", value)} />
        </StyleSection>
        <StyleSection title="ফন্ট">
          <StyleSelect label="পুরো সাইটের ফন্ট" value={globals.font_family} options={FONT_OPTIONS} onChange={(value) => set("font_family", value)} />
          <p className="text-[10.5px] leading-relaxed text-muted-foreground">গ্লোবাল নিয়মের পরও কোনো একটি এলিমেন্টে আলাদা কোণা, ছায়া বা ফন্ট দিলে সেটিই আগে চলবে।</p>
        </StyleSection>
        {hidden.length > 0 && (
          <div className="sm:col-span-2">
            <StyleSection title={`লুকানো এলিমেন্ট (${hidden.length})`}>
              <ul className="space-y-1.5">
                {hidden.map((rule) => (
                  <li key={`${rule.path}|${rule.selector}`} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5">
                    <span className="min-w-0 truncate font-mono text-[10px] text-muted-foreground">{rule.path === "*" ? "সব পেজ" : rule.path} · {rule.selector.slice(-42)}</span>
                    <button type="button" onClick={() => studio.style(rule, "hidden", null)} className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-primary"><Eye className="h-3.5 w-3.5" />ফেরান</button>
                  </li>
                ))}
              </ul>
            </StyleSection>
          </div>
        )}
      </fieldset>
    </details>
  );
}