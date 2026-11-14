import { useRef, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ImageField({ label, value, onChange, hint }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      onChange(file_url);
    } catch {
      setError("ছবি আপলোড করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <p className="text-[12.5px] font-medium text-foreground/80">{label}</p>
      <div className="mt-2 flex items-start gap-3">
        <span className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
          {value && <img src={value} alt="" className="h-full w-full object-cover" />}
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => input.current?.click()} disabled={busy} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[11.5px] font-semibold text-primary-foreground disabled:opacity-60">
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {busy ? "আপলোড হচ্ছে…" : "ছবি আপলোড"}
            </button>
            {value && (
              <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 px-3 py-2 text-[11.5px] font-medium text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
                সরান
              </button>
            )}
          </div>
          <input ref={input} type="file" accept="image/*" onChange={upload} className="hidden" />
          <input value={value || ""} maxLength={1200} onChange={(event) => onChange(event.target.value)} placeholder="অথবা ছবির লিংক (https://…)" className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-[11.5px] font-normal outline-none focus:border-primary" />
        </div>
      </div>
      <p className={`mt-1 text-[10.5px] ${error ? "text-destructive" : "text-muted-foreground"}`}>{error || hint || "আপলোড করা ছবি সাইটে সবার জন্য দেখা যাবে।"}</p>
    </div>
  );
}