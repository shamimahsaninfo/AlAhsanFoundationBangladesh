import { useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowDown, ArrowUp, Clapperboard, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import { isVideoLink } from "@/lib/media";

export default function MediaListEditor({ items = [], onChange }) {
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const update = (index, patch) => onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  const move = (index, direction) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const addImage = () => onChange([...items, { media_type: "image", url: "", title: "", caption: "", enabled: true }]);
  const addVideo = () => onChange([...items, { media_type: "video", url: "", title: "", caption: "", enabled: true }]);

  const upload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setBusy(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
        uploaded.push({ media_type: "image", url: file_url, title: "", caption: "", enabled: true });
      }
      onChange([...items, ...uploaded]);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-[17px] font-semibold text-primary">ওভারভিউয়ের ছবি ও ভিডিও</h2>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            যেভাবে সাজিয়ে রাখবেন, ঠিক সেভাবেই অটোমেটিক ঘুরে দেখাবে। ভিডিওর জন্য YouTube লিংক অথবা সরাসরি MP4 লিংক দিন।
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={addImage} className="rounded-xl border border-border px-3 py-2 text-[12.5px]">ছবি লিংক</button>
          <button type="button" onClick={addVideo} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-[12.5px]"><Clapperboard className="h-3.5 w-3.5" /> ভিডিও লিংক</button>
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[12.5px] font-semibold text-primary-foreground disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />} আপলোড
          </button>
          <input ref={fileRef} type="file" accept="image/*,video/mp4,video/webm" multiple onChange={upload} className="hidden" />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-xl border border-border p-3 sm:grid-cols-[130px_minmax(0,1fr)]">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-secondary">
              {item.media_type === "video" || isVideoLink(item.url) ? (
                <span className="text-[11px] text-muted-foreground">ভিডিও</span>
              ) : item.url ? (
                <Image src={item.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-[11px] text-muted-foreground">ছবি নেই</span>
              )}
            </div>
            <div className="space-y-2">
              <div className="grid gap-2 sm:grid-cols-[120px_minmax(0,1fr)]">
                <select
                  value={item.media_type || "image"}
                  onChange={(event) => update(index, { media_type: event.target.value })}
                  className="rounded-lg border border-border bg-background px-2 py-2 text-[12px]"
                >
                  <option value="image">ছবি</option>
                  <option value="video">ভিডিও</option>
                </select>
                <input
                  value={item.url || ""}
                  onChange={(event) => update(index, { url: event.target.value })}
                  placeholder="লিংক (ছবি, YouTube বা MP4)"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[12px]"
                />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <input value={item.title || ""} onChange={(event) => update(index, { title: event.target.value })} placeholder="শিরোনাম (ঐচ্ছিক)" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[12px]" />
                <input value={item.caption || ""} onChange={(event) => update(index, { caption: event.target.value })} placeholder="ছোট ক্যাপশন (ঐচ্ছিক)" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[12px]" />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[12px]">
                <label className="inline-flex items-center gap-1.5">
                  <input type="checkbox" checked={item.enabled !== false} onChange={(event) => update(index, { enabled: event.target.checked })} /> চালু
                </label>
                <button type="button" onClick={() => move(index, -1)} className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1"><ArrowUp className="h-3 w-3" />উপরে</button>
                <button type="button" onClick={() => move(index, 1)} className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1"><ArrowDown className="h-3 w-3" />নিচে</button>
                <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="inline-flex items-center gap-1 rounded-lg border border-destructive/40 px-2 py-1 text-destructive"><Trash2 className="h-3 w-3" />মুছুন</button>
              </div>
            </div>
          </div>
        ))}
        {!items.length && <p className="rounded-xl border border-dashed border-border p-4 text-center text-[12.5px] text-muted-foreground">এখনো কোনো ছবি বা ভিডিও নেই।</p>}
      </div>
    </section>
  );
}