import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import useVisualColorFrame from "@/hooks/useVisualColorFrame";
import VisualEditorToolbar from "@/components/admin/visual/VisualEditorToolbar";
import VisualPropertySheet from "@/components/admin/visual/VisualPropertySheet";
import VisualGlobalPanel from "@/components/admin/visual/VisualGlobalPanel";

export default function VisualColorEditor({ studio }) {
  const [path, setPath] = useState("/"), [device, setDevice] = useState("mobile"), [mode, setMode] = useState("select");
  const [selection, setSelection] = useState(null), [reload, setReload] = useState(0);
  const canvas = useVisualColorFrame({ settings: studio.settings, mode, onSelect: setSelection, onNavigate: setPath });
  const width = device === "mobile" ? 390 : 1280;
  const scale = Math.min(1, (canvas.size.width || width) / width);
  return (
    <div className="min-w-0">
      <VisualEditorToolbar studio={studio} path={path} onPath={canvas.navigate} device={device} onDevice={setDevice} mode={mode} onMode={setMode} />
      <div role={studio.error ? "alert" : "status"} className={`mb-2 text-xs ${studio.error ? "text-destructive" : "text-muted-foreground"}`}>{studio.error || studio.message || (studio.dirty ? "অসংরক্ষিত পরিবর্তন — এখন শুধু প্রিভিউতে দেখা যাচ্ছে।" : "প্রিভিউতে যেকোনো এলিমেন্টে ট্যাপ করুন; নিচ থেকে ডিজাইন প্যানেল খুলবে।")}</div>
      <div ref={canvas.container} className="relative w-full overflow-hidden rounded-2xl border border-border bg-muted" style={{ height: "min(72dvh, 780px)", minHeight: 360 }}>
        <iframe key={reload} ref={canvas.frame} src={path} title="ওয়েবসাইটের লাইভ ভিজ্যুয়াল প্রিভিউ" sandbox="allow-scripts allow-same-origin" onLoad={canvas.load} className="absolute left-1/2 top-0 border-0 bg-background" style={{ width, height: canvas.size.height / scale, marginLeft: -width / 2, transform: `scale(${scale})`, transformOrigin: "top center" }} />
        {canvas.loading && <div className="absolute inset-0 flex items-center justify-center gap-2 bg-card text-sm text-primary"><Loader2 className="h-5 w-5 animate-spin" />ওয়েবসাইট লোড হচ্ছে…</div>}
        {canvas.error && <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card p-6 text-center text-sm"><p className="text-destructive">{canvas.error}</p><button type="button" onClick={() => { setSelection(null); setReload((value) => value + 1); }} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-primary"><RefreshCw className="h-4 w-4" />আবার লোড করুন</button></div>}
      </div>
      <VisualPropertySheet
        selection={mode === "select" ? selection : null}
        studio={studio}
        onParent={canvas.parent}
        onClear={canvas.clear}
        onSimilar={() => (selection ? canvas.similar(selection.selector) : [])}
      />
      <VisualGlobalPanel studio={studio} />
      <p className="mt-2 text-[11px] text-muted-foreground">প্রিভিউর ভেতরে স্ক্রল করে পুরো সাইট দেখুন। যেকোনো এলিমেন্টে ট্যাপ করলে কোণা, রং, লেখা, ছবি, ছায়া ও আকার — সব নিয়ন্ত্রণ নিচের প্যানেলে পাবেন। প্রিভিউতে ফর্ম জমা বা পেমেন্ট হবে না।</p>
    </div>
  );
}