import { HeartHandshake, FolderHeart, CheckCircle2, MapPinned } from "lucide-react";
import { formatCompact } from "@/lib/format";
import { useSettings } from "@/components/site/SettingsContext";
import { siteCopy } from "@/data/siteCopy";

export default function StatsStrip({ stats }) {
  const settings = useSettings();
  const items = [
    { icon: HeartHandshake, value: formatCompact(stats.income), label: siteCopy(settings, "stats_income") },
    { icon: FolderHeart, value: `${stats.projects}`, label: siteCopy(settings, "stats_projects") },
    { icon: CheckCircle2, value: `${stats.completed}`, label: siteCopy(settings, "stats_completed") },
    { icon: MapPinned, value: `${stats.districts}`, label: siteCopy(settings, "stats_districts") },
  ];

  return (
    <section data-color-key="home-stats" data-color-label="পরিসংখ্যান" className="relative z-20 -mt-8 lg:-mt-12">
      <div className="shell">
        <div className="band-deep overflow-hidden rounded-[26px] border border-white/10 shadow-[0_30px_70px_-40px_hsl(var(--shade)/0.8)]">
          <div className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
            {items.map((item) => (
              <div key={item.label} className="flex items-center gap-3 bg-[hsl(var(--deep-end))] px-4 py-5 sm:px-6 sm:py-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-accent ring-1 ring-white/10 sm:h-11 sm:w-11">
                  <item.icon className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-[19px] font-bold leading-none text-white sm:text-[23px]">
                    {item.value}
                  </p>
                  <p className="mt-1.5 truncate text-[11px] text-white/55 sm:text-[12px]">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}