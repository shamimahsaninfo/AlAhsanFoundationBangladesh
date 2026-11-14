import { useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function SlidesEditor({ slides = [], onChange }) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  const update = (index, patch) => onChange(slides.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)));
  const move = (index, direction) => {
    const next = [...slides];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const add = () => onChange([...slides, { image_url: "", title: "", subtitle: "", enabled: true }]);

  const upload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setBusy(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
        uploaded.push({ image_url: file_url, title: "", subtitle: "", enabled: true });
      }
      onChange([...slides, ...uploaded]);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-[17px] font-semibold text-primary">ব্যানারের ছবি (স্লাইডশো)</h2>
          <p className="mt-1 text-[12.5px] text-muted-foreground">ছবি যেভাবে সাজানো থাকবে, ঠিক সেভাবেই স্লাইড হবে। প্রতিটি ছবির সাথে ঐচ্ছিক শিরোনাম ও উপশিরোনাম দিতে পারবেন।</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={add} className="rounded-xl border border-border px-3 py-2 text-[12.5px]">ছবির লিংক যোগ করুন</button>
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[12.5px] font-semibold text-primary-foreground disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}ছবি আপলোড
          </button>
          <input ref={inputRef} type="file" accept="image/*" multiple onChange={upload} className="hidden" />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {slides.map((slide, index) => (
          <div key={index} className="grid gap-3 rounded-xl border border-border p-3 sm:grid-cols-[130px_minmax(0,1fr)]">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-secondary">
              {slide.image_url ? <Image src={slide.image_url} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-[11px] text-muted-foreground">ছবি নেই</span>}
            </div>
            <div className="space-y-2">
              <input value={slide.image_url || ""} onChange={(e) => update(index, { image_url: e.target.value })} placeholder="ছবির লিংক" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[12px]" />
              <div className="grid gap-2 sm:grid-cols-2">
                <input value={slide.title || ""} onChange={(e) => update(index, { title: e.target.value })} placeholder="শিরোনাম (ঐচ্ছিক)" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[12px]" />
                <input value={slide.subtitle || ""} onChange={(e) => update(index, { subtitle: e.target.value })} placeholder="উপশিরোনাম (ঐচ্ছিক)" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[12px]" />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[12px]">
                <label className="inline-flex items-center gap-1.5"><input type="checkbox" checked={slide.enabled !== false} onChange={(e) => update(index, { enabled: e.target.checked })} />চালু</label>
                <button type="button" onClick={() => move(index, -1)} className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1"><ArrowUp className="h-3 w-3" />উপরে</button>
                <button type="button" onClick={() => move(index, 1)} className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1"><ArrowDown className="h-3 w-3" />নিচে</button>
                <button type="button" onClick={() => onChange(slides.filter((_, i) => i !== index))} className="inline-flex items-center gap-1 rounded-lg border border-destructive/40 px-2 py-1 text-destructive"><Trash2 className="h-3 w-3" />মুছুন</button>
              </div>
            </div>
          </div>
        ))}
        {!slides.length && <p className="rounded-xl border border-dashed border-border p-4 text-center text-[12.5px] text-muted-foreground">এখনো কোনো ছবি নেই। উপরে থেকে ছবি আপলোড করুন।</p>}
      </div>
    </section>
  );
}