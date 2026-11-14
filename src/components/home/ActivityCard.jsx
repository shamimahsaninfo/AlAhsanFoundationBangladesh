import { Link } from "@tanstack/react-router";
import { MapPin, CalendarDays, Heart, Users } from "lucide-react";
import { Image } from "@/components/ui/image";
import { formatTaka, percent, formatDate } from "@/lib/format";
import { useSettings } from "@/components/site/SettingsContext";
import { siteCopy } from "@/data/siteCopy";

export default function ActivityCard({ activity }) {
  const settings = useSettings();
  const progress = percent(activity.raised_amount, activity.target_amount);

  return (
    <article className="group flex flex-col overflow-hidden rounded-[22px] border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_-38px_hsl(var(--shade)/0.45)]">
      <Link to="/activities/$activityId" params={{ activityId: activity.id }} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={activity.image_url}
          alt={activity.title}
          className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-primary backdrop-blur">
          {activity.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {activity.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" /> {formatDate(activity.event_date)}
          </span>
        </div>

        <h3 className="mt-3 font-heading text-[19px] font-semibold leading-snug text-foreground">
          {activity.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-muted-foreground">
          {activity.summary}
        </p>

        <div className="mt-5">
          <div className="flex items-baseline justify-between text-[12.5px]">
            <span className="font-semibold text-primary">{formatTaka(activity.raised_amount)}</span>
            <span className="text-muted-foreground">লক্ষ্য {formatTaka(activity.target_amount)}</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11.5px] text-muted-foreground">
            <span>{progress}% পূর্ণ</span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" /> {activity.donor_count} জন দাতা
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link
            to="/donate"
            search={{ activity: activity.id, amount: 500 }}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Heart className="h-3.5 w-3.5 text-accent" />
            {siteCopy(settings, "donate_button")}
          </Link>
          <Link
            to="/activities/$activityId"
            params={{ activityId: activity.id }}
            className="inline-flex items-center justify-center rounded-xl border border-border py-2.5 text-[13px] font-medium text-primary transition-colors hover:bg-secondary"
          >
            {siteCopy(settings, "details_button")}
          </Link>
        </div>
      </div>
    </article>
  );
}