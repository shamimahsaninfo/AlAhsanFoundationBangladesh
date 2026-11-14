import { Monitor, Smartphone, MousePointer2, Navigation, Undo2, RotateCcw, Save, Loader2 } from "lucide-react";
import { PREVIEW_PAGES } from "@/lib/visual-colors";

export default function VisualEditorToolbar({ studio, path, onPath, device, onDevice, mode, onMode }) {
  const pathname = path.split(/[?#]/)[0];
  return (
    <fieldset disabled={studio.busy} className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-3 text-xs">
      <label className="flex min-w-0 flex-1 items-center gap-2 text-muted-foreground">পেজ
        <select aria-label="প্রিভিউর পেজ" value={pathname} onChange={(event) => onPath(event.target.value)} className="min-h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-2 text-foreground">
          {!PREVIEW_PAGES.some(([value]) => value === pathname) && <option value={pathname}>বিস্তারিত পেজ</option>}
          {PREVIEW_PAGES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <div className="flex rounded-lg border border-border p-1">
        {[["mobile", Smartphone, "মোবাইল"], ["desktop", Monitor, "ডেস্কটপ"]].map(([value, Icon, label]) => <button key={value} type="button" title={label} aria-label={label} aria-pressed={device === value} onClick={() => onDevice(value)} className={`rounded-md p-2 ${device === value ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><Icon className="h-4 w-4" /></button>)}
      </div>
      <div className="flex rounded-lg border border-border p-1">
        {[["select", MousePointer2, "এডিট করুন"], ["browse", Navigation, "ব্রাউজ"]].map(([value, Icon, label]) => <button key={value} type="button" aria-pressed={mode === value} onClick={() => onMode(value)} className={`inline-flex items-center gap-1 rounded-md px-2 py-2 ${mode === value ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><Icon className="h-3.5 w-3.5" />{label}</button>)}
      </div>
      <button type="button" onClick={studio.undo} disabled={!studio.past.length || studio.busy} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-border px-3 disabled:opacity-40"><Undo2 className="h-4 w-4" />পূর্বাবস্থায়</button>
      <button type="button" onClick={studio.reset} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-border px-3"><RotateCcw className="h-4 w-4" />ডিফল্টে ফিরুন</button>
      <button type="button" disabled={studio.busy || !studio.dirty} onClick={studio.save} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 font-semibold text-primary-foreground disabled:opacity-50">{studio.busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}সংরক্ষণ করুন</button>
    </fieldset>
  );
}