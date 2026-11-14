export default function StatCard({ icon: Icon, label, value, hint, tone = "default" }) {
  const tones = {
    default: "bg-white border-border text-primary",
    accent: "bg-primary border-primary text-primary-foreground",
    warn: "bg-accent/15 border-accent/40 text-accent-foreground",
  };
  return (
    <div className={`rounded-2xl border p-5 ${tones[tone] || tones.default}`}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.16em] opacity-60">{label}</p>
        {Icon && <Icon className="h-4 w-4 opacity-60" />}
      </div>
      <p className="mt-3 font-heading text-[22px] font-semibold">{value}</p>
      {hint && <p className="mt-1 text-[11.5px] opacity-60">{hint}</p>}
    </div>
  );
}