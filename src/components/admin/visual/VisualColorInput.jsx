import { useEffect, useId, useState } from "react";
import { HEX_COLOR } from "@/lib/visual-colors";

export default function VisualColorInput({ label, value, changed, onChange, onEnd }) {
  const id = useId();
  const [text, setText] = useState(value || "");
  const [invalid, setInvalid] = useState(false);
  useEffect(() => { setText(value || ""); setInvalid(false); }, [value]);
  const edit = (next) => {
    const formatted = next && !next.startsWith("#") ? `#${next}` : next;
    setText(formatted); setInvalid(Boolean(formatted) && !HEX_COLOR.test(formatted));
    if (HEX_COLOR.test(formatted)) onChange(formatted.toUpperCase());
  };
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="text-xs font-semibold text-foreground">{label}</label>
      <div className="mt-1 flex flex-col items-stretch gap-1 sm:flex-row sm:items-center sm:gap-2">
        <input type="color" aria-label={`${label} বাছুন`} value={value || "#ffffff"} onChange={(event) => onChange(event.target.value)} onBlur={onEnd} className="h-8 w-full shrink-0 cursor-pointer rounded-lg border border-border bg-card p-1 sm:h-11 sm:w-11" />
        <input id={id} value={text} maxLength={7} spellCheck={false} placeholder="স্বচ্ছ" aria-invalid={invalid} onChange={(event) => edit(event.target.value)} onBlur={() => { if (invalid) { setText(value || ""); setInvalid(false); } onEnd(); }} className="h-11 min-w-0 w-full rounded-lg border border-border bg-background px-2 font-mono text-xs uppercase text-foreground outline-none focus:border-primary" />
      </div>
      <div className="mt-1 flex min-h-5 justify-between gap-2 text-[10px]">
        <span className={invalid ? "text-destructive" : "text-muted-foreground"}>{invalid ? "৬ অক্ষরের HEX দিন" : !value ? "স্বচ্ছ / মূল রঙ" : "HEX রঙ"}</span>
        {changed && <button type="button" onClick={() => { onChange(null); onEnd(); }} className="text-primary underline">মূল রঙ</button>}
      </div>
    </div>
  );
}