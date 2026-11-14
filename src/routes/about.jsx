import { createFileRoute, Link } from "@tanstack/react-router";
import SiteShell from "@/components/site/SiteShell";
import { useSettings } from "@/components/site/SettingsContext";
import { ShieldCheck, HeartHandshake, Eye, Sprout, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "আমাদের সম্পর্কে — আল আহসান ফাউন্ডেশন বাংলাদেশ" },
      { name: "description", content: "আল আহসান ফাউন্ডেশন বাংলাদেশের লক্ষ্য, মূল্যবোধ ও কার্যপদ্ধতি।" },
    ],
  }),
  component: AboutPage,
});

const TIMELINE = [
  { year: "২০১৯", title: "যাত্রা শুরু", text: "ঢাকার একটি ছোট স্বেচ্ছাসেবী দল নিয়ে শীতবস্ত্র বিতরণ দিয়ে আমাদের পথচলা শুরু।" },
  { year: "২০২১", title: "শিক্ষা কার্যক্রম", text: "ঝরে পড়া শিশুদের জন্য প্রথম পাঠশালা চালু, ৩টি বস্তিবিদ্যালয়ে নিয়মিত ক্লাস।" },
  { year: "২০২৩", title: "পানি ও স্বাস্থ্য", text: "আর্সেনিকমুক্ত নলকূপ স্থাপন এবং ৬টি জেলায় বিনামূল্যে মেডিকেল ক্যাম্প।" },
  { year: "২০২৫", title: "ডিজিটাল স্বচ্ছতা", text: "প্রতিটি অনুদান ও ব্যয়ের QR যাচাইযোগ্য রসিদসহ অনলাইন লেজার চালু।" },
];

export default function AboutPage() {
  return (
    <SiteShell>
      <AboutContent />
    </SiteShell>
  );
}

function AboutContent() {
  const settings = useSettings();

  return (
    <>
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="shell max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">আমাদের সম্পর্কে</p>
          <h1 className="mt-4 font-heading text-[32px] font-semibold leading-tight sm:text-[44px]">
            মানবতার সেবায় একটি স্বচ্ছ প্রতিষ্ঠান
          </h1>
          <p className="mt-5 text-[15.5px] leading-relaxed text-primary-foreground/75">{settings.about_text}</p>
        </div>
      </section>

      <section className="shell py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "আমাদের লক্ষ্য", text: "সুবিধাবঞ্চিত মানুষের মৌলিক অধিকার — খাদ্য, শিক্ষা, চিকিৎসা ও নিরাপদ পানি — নিশ্চিত করা।" },
            { icon: Eye, title: "আমাদের প্রতিশ্রুতি", text: "প্রতিটি টাকার হিসাব প্রকাশ্যে, প্রতিটি রসিদ QR দিয়ে যাচাইযোগ্য।" },
            { icon: Sprout, title: "আমাদের পদ্ধতি", text: "স্থানীয় স্বেচ্ছাসেবীদের সঙ্গে কাজ করে টেকসই ও সম্মানজনক সহায়তা পৌঁছে দেওয়া।" },
          ].map((c) => (
            <div key={c.title} className="rounded-[22px] border border-border bg-card p-7">
              <c.icon className="h-6 w-6 text-accent-foreground" />
              <h2 className="mt-4 font-heading text-[18px] font-semibold text-primary">{c.title}</h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="overflow-hidden rounded-[24px]">
            <img src={settings.hero_poster_url} alt="আমাদের কার্যক্রম" className="h-[340px] w-full object-cover" />
          </div>
          <div>
            <h2 className="font-heading text-[26px] font-semibold text-primary sm:text-[32px]">আমাদের পথচলা</h2>
            <div className="mt-6 space-y-6 border-l border-border pl-6">
              {TIMELINE.map((t) => (
                <div key={t.year} className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
                  <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{t.year}</p>
                  <p className="mt-1 font-heading text-[16px] font-semibold text-primary">{t.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2">
          <Link
            to="/donate"
            className="group rounded-[22px] bg-primary p-8 text-primary-foreground transition-transform hover:-translate-y-1"
          >
            <HeartHandshake className="h-7 w-7 text-accent" />
            <h3 className="mt-4 font-heading text-[20px] font-semibold">অনুদান দিন</h3>
            <p className="mt-2 text-[13.5px] text-primary-foreground/70">বিকাশ, নগদ বা রকেটে সহায়তা করুন — তাৎক্ষণিক রসিদ পান।</p>
            <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-accent">
              এগিয়ে যান <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          <Link
            to="/membership"
            className="group rounded-[22px] border border-border bg-card p-8 transition-transform hover:-translate-y-1"
          >
            <ShieldCheck className="h-7 w-7 text-primary" />
            <h3 className="mt-4 font-heading text-[20px] font-semibold text-primary">সদস্য হন</h3>
            <p className="mt-2 text-[13.5px] text-muted-foreground">আবেদন করুন এবং QR যাচাইযোগ্য অফিসিয়াল সদস্য সার্টিফিকেট পান।</p>
            <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-primary">
              আবেদন করুন <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}