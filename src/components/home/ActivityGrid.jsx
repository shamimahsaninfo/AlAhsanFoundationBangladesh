import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import ActivityCard from "@/components/home/ActivityCard";
import { useSettings } from "@/components/site/SettingsContext";
import { siteCopy } from "@/data/siteCopy";

export default function ActivityGrid({ activities, title, subtitle, showAll = true }) {
  const settings = useSettings();
  return (
    <section className="band-cream py-14 sm:py-20">
      <div className="shell flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.18em] text-accent-foreground">
            {siteCopy(settings, "activities_eyebrow")}
          </span>
          <h2 className="mt-3 font-heading text-[26px] font-bold leading-tight text-primary sm:text-[36px]">
            {title || siteCopy(settings, "activities_title")}
          </h2>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground sm:text-[14.5px]">
            {subtitle || siteCopy(settings, "activities_description")}
          </p>
        </div>
        {showAll && (
          <Link
            to="/activities"
            className="group inline-flex shrink-0 items-center gap-2 text-[14px] font-semibold text-primary"
          >
            {siteCopy(settings, "all_activities")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      <div className="shell mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {activities.map((a) => (
          <ActivityCard key={a.id} activity={a} />
        ))}
      </div>
    </section>
  );
}