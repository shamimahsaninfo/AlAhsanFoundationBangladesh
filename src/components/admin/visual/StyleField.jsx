import { RotateCcw } from "lucide-react";

export function StyleSection({ title, children }) {
  return (
    <section className="space-y-3 border-b border-border/70 pb-3 last:border-0 last:pb-0">
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-primary">{title}</h3>
      {children}
    </section>
  );
}

export function StyleSegmented({ label, value, options, onChange, fallback = "" }) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-[11px] font-semibold text-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map(([optionValue, optionLabel]) => {
          const active = String(value ?? fallback) === String(optionValue);
          return (
            <button
              key={String(optionValue)}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(optionValue)}
              className={`rounded-full border px-2.5 py-1.5 text-[11.5px] font-medium transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground/75"}`}
            >
              {optionLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StyleSlider({ label, value, fallback = 0, min = 0, max = 100, step = 1, suffix = "", onChange }) {
  const current = value ?? fallback;
  const set = Boolean(value !== undefined && value !== null && value !== "");
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-foreground">{label}</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-foreground">{current}{suffix}</span>
          {set && (
            <button type="button" aria-label={`${label} মূল অবস্থায়`} onClick={() => onChange(null)} className="text-muted-foreground">
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
        </span>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-8 w-full accent-primary"
      />
    </div>
  );
}

export function StyleSelect({ label, value, options, onChange }) {
  return (
    <label className="block min-w-0 text-[11px] font-semibold text-foreground">
      {label}
      <select
        aria-label={label}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 min-h-10 w-full rounded-lg border border-border bg-background px-2 text-[12.5px] font-normal text-foreground outline-none focus:border-primary"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={String(optionValue)} value={optionValue}>{optionLabel}</option>
        ))}
      </select>
    </label>
  );
}