import ColorField from "@/components/admin/theme/ColorField";

export default function ThemeGroupCard({ group, colors, onChange }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-[17px] font-semibold text-primary">{group.title}</h2>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{group.description}</p>
        </div>
        <span className="h-9 w-9 shrink-0 rounded-xl border border-border" style={{ background: colors[group.fields[0][0]] }} aria-hidden="true" />
      </div>
      <div className="mt-4 grid gap-2">
        {group.fields.map(([token, label, fallback]) => (
          <ColorField key={token} label={label} value={colors[token] ?? fallback} onChange={(value) => onChange(token, value)} />
        ))}
      </div>
    </section>
  );
}