import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, ShieldCheck } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import { useSettings } from "@/components/site/SettingsContext";
import DonateForm from "@/components/donate/DonateForm";
import { base44 } from "@/api/base44Client";
import { siteCopy } from "@/data/siteCopy";

export const Route = createFileRoute("/donate")({
  validateSearch: (search) => ({
    amount: search.amount ? Number(search.amount) : undefined,
    activity: search.activity ? String(search.activity) : undefined,
    project: search.project ? String(search.project) : undefined,
    payment: search.payment ? String(search.payment) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "অনুদান করুন — আল আহসান ফাউন্ডেশন বাংলাদেশ" },
      { name: "description", content: "নিরাপদ পেমেন্ট গেটওয়ের মাধ্যমে অনুদান দিন ও যাচাইযোগ্য রসিদ পান।" },
    ],
  }),
  component: DonatePage,
});

function DonatePage() {
  return (
    <SiteShell>
      <DonateContent />
    </SiteShell>
  );
}

function DonateContent() {
  const settings = useSettings();
  const { amount, activity: activityId, project: projectId, payment } = Route.useSearch();
  const t = (key) => siteCopy(settings, key);
  const [activity, setActivity] = useState(null);
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (!activityId) { setActivity(null); return; }
    base44.entities.Activity.get(activityId)
      .then((a) => setActivity(a))
      .catch(() => setActivity(null));
  }, [activityId]);

  useEffect(() => {
    if (!projectId) { setProject(null); return; }
    base44.entities.Project.get(projectId)
      .then((p) => setProject(p))
      .catch(() => setProject(null));
  }, [projectId]);

  const support = project || activity || null;

  return (
    <div>
      <section className="band-deep relative isolate overflow-hidden text-white">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${settings.hero_poster_url})` }}
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[hsl(var(--deep-start))]/85 via-[hsl(var(--deep-start))]/92 to-[hsl(var(--deep-end))]" />

        <div className="shell relative py-10 sm:py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11.5px] font-medium text-white/80 backdrop-blur">
            <Heart className="h-3.5 w-3.5 text-accent" /> {t("donate_button")}
          </span>
          <h1 className="mt-4 max-w-3xl font-heading text-[27px] font-bold leading-[1.3] sm:text-[38px] lg:text-[44px]">
            {t("donate_heading")}
          </h1>
          <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-white/70 sm:text-[15px]">
            {support
              ? `আপনি সহায়তা করছেন: ${support.title}`
              : t("donate_description")}
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-[11.5px]">
            {["ন্যূনতম ৫০ টাকা", t("hero_receipt"), t("hero_accounts")].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-white/70 backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="shell -mt-8 pb-16 sm:-mt-10">
        {payment && payment !== "paid" && (
          <p className="mb-4 rounded-2xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive">
            পেমেন্ট নিশ্চিত করা যায়নি (কারণ: {payment})। টাকা কেটে নেওয়া হয়ে থাকলে অনুগ্রহ করে হটলাইনে যোগাযোগ করুন।
          </p>
        )}
        <DonateForm
          settings={settings}
          activity={activity}
          project={project}
          initialAmount={amount}
        />
      </div>
    </div>
  );
}