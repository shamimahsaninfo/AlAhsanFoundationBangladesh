import { useEffect, useRef, useState } from "react";

function normalize(value) {
  const raw = String(value || "").trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(raw)) return `#${raw.split("").map((c) => c + c).join("")}`.toUpperCase();
  if (/^#[0-9a-f]{6}$/i.test(`#${raw}`)) return `#${raw}`.toUpperCase();
  return null;
}

export default function ColorField({ label, value, onChange }) {
  const valid = normalize(value);
  const [draft, setDraft] = useState(valid || "");
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setDraft(valid || "");
  }, [valid]);

  const invalid = draft.trim() !== "" && !normalize(draft);

  const type = (text) => {
    setDraft(text);
    const next = normalize(text);
    if (next) onChange(next);
  };

  return (
    <div className="rounded-xl border border-border bg-background px-3 py-2.5">
      <span className="block text-[12.5px] font-medium leading-tight text-foreground/80">{label}</span>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          aria-label={`${label} — রঙ বাছুন`}
          type="color"
          value={valid || "#FFFFFF"}
          onChange={(event) => type(event.target.value.toUpperCase())}
          className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
        />
        <input
          aria-label={`${label} — হেক্স কোড`}
          type="text"
          value={draft}
          placeholder="#FFFFFF"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="characters"
          onFocus={() => {
            focused.current = true;
          }}
          onBlur={() => {
            focused.current = false;
            if (!normalize(draft)) setDraft(valid || "");
          }}
          onChange={(event) => type(event.target.value)}
          className={`min-w-0 flex-1 rounded-lg border bg-card px-2.5 py-2 font-mono text-[13px] uppercase outline-none focus:border-primary ${
            invalid ? "border-destructive" : "border-border"
          }`}
        />
      </div>
    </div>
  );
}