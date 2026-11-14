import { Link } from "@tanstack/react-router";
import { HandCoins, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { text } from "@/lib/copy";

export default function AutoDonationBanner({ settings }) {
  return (
    <section data-color-key="home-auto" data-color-label="অটো ডোনেশন ব্যানার" className="py-4">
      <div className="shell overflow-hidden rounded-[26px] band-deep">
        <div className="grid items-center gap-0 sm:grid-cols-2">
          <div className="relative order-2 aspect-[16/9] sm:order-1 sm:aspect-auto sm:h-full">
            <Image src={settings.campaign_image_url || settings.hero_poster_url} alt="অটো ডোনেশন" className="h-full w-full object-cover" />
          </div>
          <div className="order-1 p-6 sm:order-2 sm:p-9">
            <span className="hero-accent text-[11px] font-semibold uppercase tracking-[0.2em]">অটো ডোনেশন</span>
            <h2 className="hero-title mt-2 font-heading text-[22px] font-bold leading-snug sm:text-[28px]">
              {text(settings, "auto_title", "নিয়মিত দান মানে পরিকল্পিত কাজ, টেকসই পরিবর্তন")}
            </h2>
            <p className="hero-subtitle mt-2 text-[13px] leading-relaxed">
              {text(settings, "auto_text", "প্রতি মাসে অল্প অঙ্কের নিয়মিত অনুদান দিয়ে একটি স্থায়ী পরিবর্তনের অংশীদার হয়ে উঠুন।")}
            </p>
            <Link to="/auto-donation" className="btn-donate mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-bold">
              <HandCoins className="h-4 w-4" /> অটো ডোনেশন চালু করুন
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}