import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { HandHeart, Share2, Facebook, MessageCircle, Link2, Check } from "lucide-react";
import { text } from "@/lib/copy";

export default function DuaShare({ settings }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window === "undefined" ? "" : window.location.origin;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareUrl}/donate`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { setCopied(false); }
  };

  return (
    <section data-color-key="home-dua" data-color-label="দুআ ও শেয়ার" className="py-12 sm:py-16">
      <div className="shell grid gap-3 md:grid-cols-3">
        <div className="rounded-[22px] border border-border bg-card p-5">
          <HandHeart className="h-7 w-7 text-primary" />
          <h3 className="mt-3 font-heading text-[16px] font-semibold text-heading">{text(settings, "dua_title", "দুআ")}</h3>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
            {text(settings, "dua_text", "আমাদের কার্যক্রম সুষ্ঠুভাবে পরিচালনার জন্য আপনার আন্তরিক দুআ একান্ত কাম্য।")}
          </p>
        </div>
        <div className="rounded-[22px] border border-border bg-card p-5">
          <Share2 className="h-7 w-7 text-primary" />
          <h3 className="mt-3 font-heading text-[16px] font-semibold text-heading">{text(settings, "share_title", "শেয়ার করুন")}</h3>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
            {text(settings, "share_text", "পরিবার ও বন্ধুদের সাথে আমাদের কার্যক্রম শেয়ার করুন।")}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${shareUrl}/donate`)}`} target="_blank" rel="noreferrer" aria-label="ফেসবুকে শেয়ার" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-primary hover:bg-secondary"><Facebook className="h-4 w-4" /></a>
            <a href={`https://wa.me/?text=${encodeURIComponent(`${shareUrl}/donate`)}`} target="_blank" rel="noreferrer" aria-label="হোয়াটসঅ্যাপে শেয়ার" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-primary hover:bg-secondary"><MessageCircle className="h-4 w-4" /></a>
            <button type="button" onClick={copy} aria-label="লিংক কপি করুন" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-primary hover:bg-secondary">
              {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="rounded-[22px] bg-primary p-5 text-primary-foreground">
          <HandHeart className="h-7 w-7 text-accent" />
          <h3 className="mt-3 font-heading text-[16px] font-semibold">{text(settings, "donate_heading", "আজই অনুদান দিন")}</h3>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-primary-foreground/80">
            {text(settings, "donate_description", "আপনার সামর্থ্য অনুযায়ী দান করুন — প্রতিটি অনুদান পৌঁছে যায় সঠিক মানুষের কাছে।")}
          </p>
          <Link to="/donate" className="btn-donate mt-3 inline-flex rounded-full px-4 py-2.5 text-[12.5px] font-bold">দান করুন</Link>
        </div>
      </div>
    </section>
  );
}