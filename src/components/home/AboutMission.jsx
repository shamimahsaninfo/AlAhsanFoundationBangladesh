import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import { text } from "@/lib/copy";

export default function AboutMission({ settings }) {
  const items = settings.mission_items?.length ? settings.mission_items : [];
  return (
    <section data-color-key="home-mission" data-color-label="পরিচিতি ও লক্ষ্য" className="py-12 sm:py-16">
      <div className="shell grid items-start gap-8 lg:grid-cols-2">
        <div>
          <span className="eyebrow">আমাদের সম্পর্কে</span>
          <h2 className="text-heading mt-2 font-heading text-[23px] font-bold sm:text-[30px]">
            {text(settings, "about_title", "আল আহসান ফাউন্ডেশন সম্পর্কে")}
          </h2>
          <p className="mt-3 whitespace-pre-line text-[13.5px] leading-relaxed text-muted-foreground">{settings.about_text}</p>
          <div className="mt-4 overflow-hidden rounded-[22px] border border-border bg-card">
            <Image src={settings.campaign_image_url || settings.hero_poster_url} alt={settings.site_name} className="aspect-[16/9] w-full object-cover" />
          </div>
          <Link to="/about" className="mt-4 inline-flex rounded-full border border-border px-4 py-2.5 text-[12.5px] font-medium text-primary hover:bg-card">
            বিস্তারিত জানুন
          </Link>
        </div>

        <div>
          <span className="eyebrow">লক্ষ্য ও উদ্দেশ্য</span>
          <h2 className="text-heading mt-2 font-heading text-[23px] font-bold sm:text-[30px]">
            {text(settings, "mission_title", "আমরা যে লক্ষ্য নিয়ে কাজ করছি")}
          </h2>
          <div className="mt-4 space-y-3">
            {items.map((item, index) => (
              <div key={`${item.title}-${index}`} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-heading text-[14.5px] font-semibold text-heading">{item.title}</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}