import { Link } from "@tanstack/react-router";
import { formatTaka, percent } from "@/lib/format";
import { text } from "@/lib/copy";

export default function FundsSummary({ activities = [], settings }) {
  if (!activities.length) return null;
  return (
    <section data-color-key="home-funds" data-color-label="তহবিল সেকশন" className="py-12 sm:py-16">
      <div className="shell">
        <div className="text-center">
          <span className="eyebrow">তহবিল</span>
          <h2 className="text-heading mt-2 font-heading text-[23px] font-bold sm:text-[30px]">
            {text(settings, "funds_title", "তহবিলের সংক্ষিপ্ত বিবরণী")}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            {text(settings, "funds_note", "প্রতিটি তহবিলে আপনার অনুদান কী কাজে ব্যয় হবে তা নিচে দেওয়া আছে।")}
          </p>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {activities.map((activity) => (
            <div key={activity.id} data-color-key={`fund-${activity.id}`} data-color-label="তহবিলের কার্ড" className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-heading text-[15px] font-semibold text-heading">{activity.title}</h3>
                <Link to="/donate" search={{ activity: activity.id }} className="shrink-0 rounded-full border border-border px-3 py-1.5 text-[11.5px] font-semibold text-primary hover:bg-secondary">
                  দান করুন
                </Link>
              </div>
              <p className="mt-1.5 line-clamp-3 text-[12.5px] leading-relaxed text-muted-foreground">{activity.summary || activity.description}</p>
              <div className="mt-3 flex items-center justify-between text-[11.5px] text-muted-foreground">
                <span className="font-semibold text-primary">{formatTaka(activity.raised_amount)}</span>
                <span>লক্ষ্য {formatTaka(activity.target_amount)}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: `${percent(activity.raised_amount, activity.target_amount)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}