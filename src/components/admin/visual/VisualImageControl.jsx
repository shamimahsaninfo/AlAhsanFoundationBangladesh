import { useEffect, useRef, useState } from "react";
import { Loader2, RotateCcw, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function VisualImageControl({ selection, studio, rule }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState(rule?.url || "");
  useEffect(() => {
    setUrl(rule?.url || "");
  }, [selection.path, selection.selector, rule?.url]);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      studio.image(selection, file_url);
      setUrl(file_url);
    } catch {
      setError("ছবি আপলোড করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3">
      <p className="text-xs font-semibold text-foreground">এই ছবিটি বদলান</p>
      <div className="mt-2 flex items-start gap-3">
        <span className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
          {(rule?.url || selection.imageSrc) && <img src={rule?.url || selection.imageSrc} alt="" className="h-full w-full object-cover" />}
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <button type="button" onClick={() => input.current?.click()} disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {busy ? "আপলোড হচ্ছে…" : "নতুন ছবি আপলোড"}
          </button>
          <input ref={input} type="file" accept="image/*" onChange={upload} className="hidden" />
          <input
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              studio.image(selection, event.target.value.trim());
            }}
            onBlur={studio.endEdit}
            placeholder="অথবা ছবির লিংক (https://…)"
            className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-[11.5px] outline-none focus:border-primary"
          />
        </div>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2 text-[10px]">
        <span className={error ? "text-destructive" : "text-muted-foreground"}>{error || "আপলোড করা ছবি সাইটে সবার জন্য দেখা যাবে।"}</span>
        {rule && (
          <button type="button" onClick={() => { studio.image(selection, ""); setUrl(""); }} className="inline-flex items-center gap-1 text-primary underline">
            <RotateCcw className="h-3 w-3" />
            মূল ছবি
          </button>
        )}
      </div>
    </div>
  );
}