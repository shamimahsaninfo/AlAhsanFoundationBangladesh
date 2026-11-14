import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, CalendarDays, Users, Heart, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import { formatTaka, formatDate, percent } from "@/lib/format";

export const Route = createFileRoute("/activities/$activityId")({
  head: () => ({
    meta: [{ title: "কার্যক্রমের বিস্তারিত — আল আহসান ফাউন্ডেশন বাংলাদেশ" }],
  }),
  component: ActivityDetailPage,
});

function ActivityDetailPage() {
  return (
    <SiteShell>
      <ActivityContent />
    </SiteShell>
  );
}

function ActivityContent() {
  const { activityId } = Route.useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Activity.get(activityId)
      .then(setActivity)
      .catch(() => setActivity(null))
      .finally(() => setLoading(false));
  }, [activityId]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="shell py-24 text-center">
        <h1 className="font-heading text-[24px] font-semibold text-primary">কার্যক্রমটি পাওয়া যায়নি</h1>
        <Link to="/activities" className="mt-4 inline-flex text-[14px] font-medium text-primary underline">
          সব কার্যক্রমে ফিরে যান
        </Link>
      </div>
    );
  }

  const progress = percent(activity.raised_amount, activity.target_amount);

  return (
    <div className="shell py-10">
      <Link to="/activities" className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> সব কার্যক্রম
      </Link>

      <div className="mt-5 grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
        <div>
          <div className="overflow-hidden rounded-[26px]">
            <Image
              src={activity.image_url}
              alt={activity.title}
              className="h-[300px] w-full object-cover sm:h-[420px]"
            />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {activity.location || "বাংলাদেশ"}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(activity.event_date)}</span>
            <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {activity.donor_count || 0} জন দাতা</span>
            <span className="rounded-full bg-secondary px-3 py-1 text-[11.5px] font-semibold text-primary">{activity.category}</span>
          </div>

          <h1 className="mt-4 font-heading text-[30px] font-semibold leading-tight text-primary sm:text-[38px]">
            {activity.title}
          </h1>
          <p className="mt-4 text-[15.5px] leading-relaxed text-foreground/80">{activity.summary}</p>

          {activity.description && (
            <div className="mt-6 whitespace-pre-line text-[15px] leading-[1.9] text-foreground/75">
              {activity.description}
            </div>
          )}

          {activity.video_url && (
            <div className="mt-8 aspect-video overflow-hidden rounded-2xl">
              <iframe src={activity.video_url} title={activity.title} className="h-full w-full" allowFullScreen />
            </div>
          )}

          {Array.isArray(activity.gallery) && activity.gallery.length > 0 && (
            <div className="mt-8">
              <h2 className="font-heading text-[18px] font-semibold text-primary">ছবির গ্যালারি</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {activity.gallery.filter(Boolean).map((url, i) => (
                  <div key={i} className="overflow-hidden rounded-xl">
                    <Image src={url} alt={`${activity.title} — ছবি ${i + 1}`} className="h-36 w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-[24px] border border-border bg-card p-6">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">তহবিলের অবস্থা</p>
            <p className="mt-2 font-heading text-[24px] font-semibold text-primary">{formatTaka(activity.raised_amount)}</p>
            <p className="text-[12.5px] text-muted-foreground">লক্ষ্য {formatTaka(activity.target_amount)}</p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-[11.5px] text-muted-foreground">{progress}% পূর্ণ হয়েছে</p>

            <Link
              to="/donate"
              search={{ activity: activity.id, amount: 500 }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-[14.5px] font-semibold text-primary-foreground"
            >
              <Heart className="h-4 w-4 text-accent" /> এই প্রকল্পে দান করুন
            </Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-accent-foreground" /> বিকাশ · নগদ · রকেট
            </p>
          </div>

          <div className="rounded-[24px] bg-secondary p-6 text-[12.5px] leading-relaxed text-foreground/75">
            আপনার অনুদান যাচাই করে প্রকল্পের তহবিলে যোগ করা হয়। প্রতিটি ব্যয়ের রসিদ ওয়েবসাইটের
            স্বচ্ছতা পাতা থেকে যাচাই করা যায়।
          </div>
        </aside>
      </div>
    </div>
  );
}