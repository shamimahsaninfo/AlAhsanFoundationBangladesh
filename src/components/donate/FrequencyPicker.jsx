import { FREQUENCIES } from "@/lib/recurring";

export default function FrequencyPicker({ value, days, onChange, label = "কত ঘন ঘন অনুদান দিতে চান?" }) {
  const customDays = Math.min(365, Math.max(1, Number(days) || 15));

  return (
    <div>
      <p className="text-[12.5px] font-semibold text-heading">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {FREQUENCIES.map((option) => (
          <button
            key={option.value}
            type="button"
            data-active={value === option.value}
            onClick={() => onChange(option.value, option.value === "custom" ? customDays : option.days)}
            className="freq-chip"
          >
            {option.label}
          </button>
        ))}
      </div>
      {value === "custom" && (
        <label className="mt-2.5 flex items-center gap-2 text-[12.5px] text-muted-foreground">
          প্রতি
          <input
            type="number"
            min="1"
            max="365"
            value={customDays}
            onChange={(event) => onChange("custom", Number(event.target.value))}
            className="w-20 rounded-xl border border-border bg-card px-2 py-1.5 text-center text-[13px] font-semibold text-foreground outline-none focus:border-primary"
          />
          দিনে একবার
        </label>
      )}
    </div>
  );
}