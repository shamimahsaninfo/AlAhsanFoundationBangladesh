import { useEffect, useState } from "react";
import { EyeOff } from "lucide-react";

export default function VisualMenuControl({ selection, studio }) {
  const [label, setLabel] = useState(selection.text || "");
  useEffect(() => {
    setLabel(selection.text || "");
  }, [selection.selector, selection.path]);

  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-foreground">মেনু আইটেম</p>
        <span className="truncate font-mono text-[10px] text-muted-foreground">{selection.href}</span>
      </div>
      <label className="mt-2 block text-[11px] text-muted-foreground" htmlFor={`visual-menu-${selection.path}`}>
        মেনুর লেখা
        <input
          id={`visual-menu-${selection.path}`}
          value={label}
          maxLength={80}
          onChange={(event) => {
            setLabel(event.target.value);
            studio.menuLabel(selection.href, event.target.value);
          }}
          onBlur={studio.endEdit}
          className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-2 text-[13px] text-foreground outline-none focus:border-primary"
        />
      </label>
      <button type="button" onClick={() => studio.menuToggle(selection.href, false)} className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 px-2.5 py-1.5 text-[11px] font-medium text-destructive">
        <EyeOff className="h-3.5 w-3.5" />
        এই মেনু সরান
      </button>
      <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">সংরক্ষণের পর মেনু থেকে সরে যাবে। আবার চালু করতে ‘মেনু’ পাতা ব্যবহার করুন।</p>
    </div>
  );
}