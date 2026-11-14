import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

export default function VisualTextControl({ selection, studio, rule }) {
  const [value, setValue] = useState(rule?.text ?? selection.text ?? "");
  useEffect(() => {
    setValue(rule?.text ?? selection.text ?? "");
  }, [selection.path, selection.selector, rule?.text]);

  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3">
      <label className="block text-xs font-semibold text-foreground" htmlFor={`visual-text-${selection.path}`}>
        এই লেখাটি বদলান
      </label>
      <textarea
        id={`visual-text-${selection.path}`}
        value={value}
        rows={2}
        maxLength={600}
        onChange={(event) => {
          setValue(event.target.value);
          studio.text(selection, event.target.value);
        }}
        onBlur={studio.endEdit}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-2.5 py-2 text-[13px] leading-relaxed outline-none focus:border-primary"
      />
      <div className="mt-1 flex items-center justify-between gap-2 text-[10px]">
        <span className="text-muted-foreground">লেখা লিখলেই প্রিভিউতে বদলে যাবে।</span>
        {rule && (
          <button type="button" onClick={() => { studio.text(selection, ""); setValue(selection.text || ""); }} className="inline-flex items-center gap-1 text-primary underline">
            <RotateCcw className="h-3 w-3" />
            মূল লেখা
          </button>
        )}
      </div>
    </div>
  );
}