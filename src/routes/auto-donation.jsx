import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Clock, HandCoins, ShieldCheck } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import { useSettings } from "@/components/site/SettingsContext";
import RecurringDonationForm from "@/components/donate/RecurringDonationForm";
import { text } from "@/lib/copy";

export const Route = createFileRoute("/auto-donation")({
  head: () => ({
    meta: [
      { title: "অটো ডোনেশন — আল আহসান ফাউন্ডেশন বাংলাদেশ" },
      { name: "description", content: "দৈনিক, সাপ্তাহিক, পাক্ষিক, মাসিক বা নিজের পছন্দের সময়সূচিতে নিয়মিত অনুদান দিয়ে ফাউন্ডেশনের কার্যক্রমে স্থায়ীভাবে অংশীদার হন।" },
    ],
  }),
  component: AutoDonationPage,
});

const STEPS = [
  { icon: HandCoins, title: "যেভাবে কাজ করে", text: "আপনার বেছে নেওয়া পরিমাণ নির্ধারিত সময় পরপর পেমেন্ট গেটওয়ের মাধ্যমে ফাউন্ডেশনের তহবিলে যুক্ত হয়, ফলে দীর্ঘমেয়াদি পরিকল্পনা করা সহজ হয়।" },
  { icon: CalendarDays, title: "আপনার নিজের সময়সূচি", text: "দৈনিক, সাপ্তাহিক, পাক্ষিক, মাসিক অথবা “প্রতি কত দিনে” — সম্পূর্ণ নিজের পছন্দমতো সময়সূচি ঠিক করুন। যেকোনো সময় বিরতি বা বন্ধ করতে পারবেন।" },
  { icon: ShieldCheck, title: "প্রতিবারই যাচাইযোগ্য রসিদ", text: "প্রতিটি কিস্তির জন্য QR-যাচাইযোগ্য রসিদ তৈরি হয়, ইমেইলে PDF যায় এবং “আমার দান” পাতা থেকেও ডাউনলোড করা যায়।" },
  { icon: Clock, title: "সহায়তা দরকার?", text: "অফিস সময়ে হটলাইনে যোগাযোগ করুন — সেটআপ, পরিবর্তন বা বন্ধ করার সব কাজে আমরা পাশে আছি।" },
];

function AutoDonationPage() {
  const settings = useSettings();
  return (
    <SiteShell>
      <section className="band-deep relative overflow-hidden text-white">
        <div className="shell py-12 sm:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur">
            অটো ডোনেশন
          </span>
          <h1 className="mt-4 max-w-3xl font-heading text-[26px] font-bold leading-tight sm:text-[36px]">
            {text(settings, "auto_title", "নিয়মিত দান মানে পরিকল্পিত কাজ, টেকসই পরিবর্তন")}
          </h1>
          <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-white/70 sm:text-[15px]">
            {text(settings, "auto_text", "দৈনিক, সাপ্তাহিক, পাক্ষিক বা মাসিক — আপনার সুবিধামতো সময়সূচিতে নিয়মিত অনুদান দিয়ে একটি স্থায়ী পরিবর্তনের অংশীদার হয়ে উঠুন।")}
          </p>
        </div>
      </section>

      <div className="band-canvas">
        <div className="shell py-12 sm:py-16">
          <div className="mx-auto max-w-2xl">
            <RecurringDonationForm settings={settings} />
          </div>

          <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
            {STEPS.map(({ icon: Icon, title, text: body }, index) => (
              <div key={title} className="card-elev flex items-start gap-3 p-5">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="font-heading text-[14.5px] font-semibold text-heading">
                    <span className="mr-1.5 text-[11px] font-bold text-accent">০{index + 1}</span>
                    {title}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                    {title.includes("সহায়তা") ? `${body} হটলাইন ${settings.hotline} · ${settings.office_hours}` : body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            <Link to="/donate" className="btn-donate rounded-full px-5 py-3 text-[13px] font-bold">এককালীন দান করুন</Link>
            <Link to="/my-donations" className="btn-auto rounded-full px-5 py-3 text-[13px] font-semibold">আমার দান</Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}