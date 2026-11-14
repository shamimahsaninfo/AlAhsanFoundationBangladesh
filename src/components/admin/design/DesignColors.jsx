import { COLOR_GROUPS, colorValue } from "@/lib/site-design";

export default function DesignColors({ form, set }) {
  return <div className="space-y-5">{COLOR_GROUPS.map((group) => <section key={group.title} className="rounded-2xl border bg-card p-5">
    <h2 className="font-heading text-lg font-semibold">{group.title}</h2>
    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{group.fields.map((field) => {
      const [token, label, , setting] = field;
      const value = colorValue(form, field);
      const change = (next) => setting ? set(setting, next) : set("theme_colors", { ...form.theme_colors, [token]: next });
      return <label key={token} className="block text-sm"><span>{label}</span><div className="mt-2 flex gap-2">
        <input aria-label={`${label} নির্বাচন`} type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : field[2]} onChange={(e) => change(e.target.value)} className="h-11 w-12 cursor-pointer rounded-lg border bg-background p-1" />
        <input aria-label={`${label} HEX`} value={value} maxLength={7} onChange={(e) => change(e.target.value)} className="min-w-0 flex-1 rounded-lg border bg-background px-3 font-mono text-sm" />
      </div></label>;
    })}</div>
  </section>)}</div>;
}