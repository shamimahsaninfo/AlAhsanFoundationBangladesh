import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import SiteShell from "@/components/site/SiteShell";
import ActivityCard from "@/components/home/ActivityCard";
import { useActivities } from "@/hooks/useActivities";

export const Route = createFileRoute("/activities/")({
  head: () => ({
    meta: [
      { title: "আমাদের কার্যক্রম — আল আহসান ফাউন্ডেশন বাংলাদেশ" },
      { name: "description", content: "শিক্ষা, খাদ্য, চিকিৎসা ও বিশুদ্ধ পানির প্রকল্প — প্রতিটি প্রকল্পে সরাসরি দান করুন।" },
    ],
  }),
  component: ActivitiesPage,
});

function ActivitiesPage() {
  return (
    <SiteShell>
      <ActivitiesContent />
    </SiteShell>
  );
}

function ActivitiesContent() {
  const { activities, loading } = useActivities({ limit: 48 });
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set(activities.map((a) => a.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [activities]);

  const visible = category === "all" ? activities : activities.filter((a) => a.category === category);

  return (
    <div className="shell py-14">
      <div className="max-w-2xl">
        <p className="eyebrow">কার্যক্রম</p>
        <h1 className="mt-3 font-heading text-[32px] font-semibold leading-tight text-primary sm:text-[42px]">
          মাঠের কাজ, বাস্তব প্রভাব
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          প্রতিটি কার্যক্রমের ছবি ও বিবরণ অ্যাডমিন প্যানেল থেকে প্রকাশ করা হয়। ছবির নিচের
          “দান করুন” বাটনে ক্লিক করে সরাসরি সেই প্রকল্পে সহায়তা করতে পারেন।
        </p>
      </div>

      {categories.length > 2 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-2 text-[12.5px] font-medium transition-colors ${
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground/70 hover:border-primary"
              }`}
            >
              {c === "all" ? "সব কার্যক্রম" : c}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-[22px] bg-secondary" />
          ))}
        </div>
      ) : visible.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-[24px] border border-dashed border-border bg-card p-12 text-center">
          <p className="font-heading text-[18px] font-semibold text-primary">এখনো কোনো কার্যক্রম প্রকাশিত হয়নি</p>
          <p className="mt-2 text-[13.5px] text-muted-foreground">
            অনুগ্রহ করে একটু পরে আবার দেখুন, অথবা সাধারণ তহবিলে অনুদান দিন।
          </p>
          <Link to="/donate" className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-[13.5px] font-semibold text-primary-foreground">
            দান করুন
          </Link>
        </div>
      )}
    </div>
  );
}