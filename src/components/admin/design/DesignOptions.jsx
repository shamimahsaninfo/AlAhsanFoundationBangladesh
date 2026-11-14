import { DESIGN_OPTIONS } from "@/lib/site-design";

export default function DesignOptions({ form, set }) {
  const options = form.theme_options || {};
  return <section className="rounded-2xl border bg-card p-5">
    <h2 className="font-heading text-lg font-semibold">আকার, স্কেল, ফাঁকা জায়গা ও অ্যানিমেশন</h2>
    <div className="mt-5 grid gap-5 sm:grid-cols-2">{DESIGN_OPTIONS.map(([key, label, fallback, min, max, unit]) => <label key={key} className="text-sm">
      <span className="flex justify-between gap-3">{label}<span className="font-mono text-muted-foreground">{options[key] ?? fallback}{unit}</span></span>
      <input type="range" min={min} max={max} value={options[key] ?? fallback} onChange={(e) => set("theme_options", { ...options, [key]: Number(e.target.value) })} className="mt-3 w-full accent-primary" />
    </label>)}</div>
    <label className="mt-5 flex items-center gap-3 text-sm"><input type="checkbox" checked={options.motion_enabled !== false} onChange={(e) => set("theme_options", { ...options, motion_enabled: e.target.checked })} />ওয়েবসাইটের অ্যানিমেশন চালু রাখুন</label>
    <label className="mt-6 block text-sm font-medium" htmlFor="custom-theme-css">কাস্টম থিম CSS</label>
    <p className="mt-1 text-xs text-muted-foreground">শুধু পাবলিক সাইটে প্রযোজ্য; অ্যাডমিন প্যানেলে নয়। .site-theme দিয়ে শুরু করুন। বাইরের ফাইল বা URL অনুমোদিত নয়।</p>
    <textarea id="custom-theme-css" value={form.theme_custom_css || ""} maxLength={20000} onChange={(e) => set("theme_custom_css", e.target.value)} rows={8} spellCheck={false} placeholder={".site-theme h1 { letter-spacing: 0; }"} className="mt-3 w-full rounded-xl border bg-background p-4 font-mono text-sm" />
  </section>;
}