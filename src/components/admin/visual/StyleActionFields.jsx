import { Copy, ClipboardPaste, Layers, ArrowUp, ArrowDown, EyeOff, Eye, Trash2 } from "lucide-react";
import { StyleSection } from "@/components/admin/visual/StyleField";

const ACTION = "inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2.5 text-[11.5px] font-medium text-foreground/85 disabled:opacity-40";

export default function StyleActionFields({ selection, studio, onSimilar, props }) {
  return (
    <StyleSection title="দ্রুত কাজ">
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className={ACTION} onClick={() => studio.copyStyle(selection)}><Copy className="h-3.5 w-3.5" />স্টাইল কপি</button>
        <button type="button" className={ACTION} disabled={!studio.hasClipboard} onClick={() => studio.pasteStyle(selection)}><ClipboardPaste className="h-3.5 w-3.5" />পেস্ট করুন</button>
        <button type="button" className={`${ACTION} col-span-2`} onClick={() => studio.applyToSimilar(selection, onSimilar())}><Layers className="h-3.5 w-3.5" />এই ধরনের সব এলিমেন্টে প্রয়োগ করুন</button>
        <button type="button" className={ACTION} onClick={() => studio.move(selection, "up")}><ArrowUp className="h-3.5 w-3.5" />উপরে সরান</button>
        <button type="button" className={ACTION} onClick={() => studio.move(selection, "down")}><ArrowDown className="h-3.5 w-3.5" />নিচে সরান</button>
        <button type="button" className={ACTION} onClick={() => studio.style(selection, "hidden", props.hidden ? null : true)}>
          {props.hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          {props.hidden ? "আবার দেখান" : "লুকান"}
        </button>
        <button type="button" className={ACTION} onClick={() => studio.style(selection, "hidden", true)}><Trash2 className="h-3.5 w-3.5" />এলিমেন্ট সরান</button>
        <button type="button" className={`${ACTION} col-span-2 border-destructive/40 text-destructive`} onClick={() => studio.resetElement(selection)}>এই এলিমেন্টের সব পরিবর্তন বাতিল</button>
      </div>
      <p className="text-[10px] leading-relaxed text-muted-foreground">
        লুকানো এলিমেন্ট নিচের “গ্লোবাল ডিফল্ট” অংশের তালিকা থেকে ফিরিয়ে আনা যাবে। সব পরিবর্তন সংরক্ষণ করার পরেই মূল সাইটে স্থায়ী হয়।
      </p>
    </StyleSection>
  );
}