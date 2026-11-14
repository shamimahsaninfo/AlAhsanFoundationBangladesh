import { Link } from "@tanstack/react-router";
import { Facebook, Youtube, Mail, MapPin, Phone, Clock } from "lucide-react";
import BrandMark from "@/components/site/BrandMark";
import { defaultSettings } from "@/data/sampleContent";
import { siteCopy } from "@/data/siteCopy";
import { safeLink } from "@/lib/copy";

const QUICK = [
  { label: "কার্যক্রম", to: "/activities" },
  { label: "দান করুন", to: "/donate" },
  { label: "অটো ডোনেশন", to: "/auto-donation" },
  { label: "হিসাবের স্বচ্ছতা", to: "/transparency" },
  { label: "সদস্য হন", to: "/membership" },
  { label: "রসিদ যাচাই", to: "/verify" },
];

export default function SiteFooter({ settings = defaultSettings }) {
  const t = (key) => siteCopy(settings, key);
  const legal = settings.footer_links?.length
    ? settings.footer_links
    : [{ label: "শর্তাবলী", to: "/terms" }, { label: "গোপনীয়তা নীতি", to: "/privacy" }, { label: "ফেরত নীতি", to: "/refund" }];

  return (
    <footer data-color-key="site-footer" data-color-global="true" data-color-label="ফুটার" className="site-footer mt-16">
      <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <BrandMark light src={settings.logo_url} />
            <div>
              <p className="font-heading text-lg font-semibold">{settings.site_name}</p>
              <p className="text-[12px] uppercase tracking-[0.18em] opacity-60">{t("footer_motto")}</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-[14px] leading-relaxed opacity-75">{settings.about_text}</p>
          <div className="mt-5 flex items-center gap-3">
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook" className="footer-link rounded-full border border-white/20 p-2.5 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {settings.youtube_url && (
              <a href={settings.youtube_url} target="_blank" rel="noreferrer" aria-label="YouTube" className="footer-link rounded-full border border-white/20 p-2.5 transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="footer-accent text-[12.5px] font-semibold uppercase tracking-[0.18em]">{t("footer_links")}</h4>
          <ul className="mt-4 space-y-2.5 text-[14px]">
            {QUICK.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="footer-link transition-colors">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="footer-accent text-[12.5px] font-semibold uppercase tracking-[0.18em]">যোগাযোগ</h4>
          <ul className="mt-4 space-y-2.5 text-[13.5px] opacity-80">
            {settings.hotline && <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0" /><a href={`tel:${settings.hotline}`} className="footer-link break-words">{settings.hotline}</a></li>}
            {settings.email && <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0" /><a href={`mailto:${settings.email}`} className="footer-link break-all">{settings.email}</a></li>}
            {settings.address && <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /><span>{settings.address}</span></li>}
            {settings.office_hours && <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0" /><span>{settings.office_hours}</span></li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col items-center justify-between gap-3 py-5 text-[12px] opacity-70 sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.site_name}। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {legal.map((link) => (
              link.to.startsWith("http") ? (
                <a key={link.to} href={safeLink(link.to)} target="_blank" rel="noreferrer" className="footer-link">{link.label}</a>
              ) : (
                <Link key={link.to} to={safeLink(link.to)} className="footer-link">{link.label}</Link>
              )
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}