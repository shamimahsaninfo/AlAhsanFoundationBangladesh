import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { text } from "@/lib/copy";

export default function ContactSection({ settings }) {
  const rows = [
    { icon: Phone, label: "মোবাইল", value: settings.hotline, href: `tel:${settings.hotline}` },
    { icon: Mail, label: "ইমেইল", value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: "ঠিকানা", value: settings.address },
    { icon: Clock, label: "অফিস সময়", value: settings.office_hours },
  ];
  return (
    <section data-color-key="home-contact" data-color-label="যোগাযোগ সেকশন" className="py-12 sm:py-16">
      <div className="shell">
        <div className="text-center">
          <span className="eyebrow">যোগাযোগ</span>
          <h2 className="text-heading mt-2 font-heading text-[23px] font-bold sm:text-[30px]">
            {text(settings, "contact_title", "আমাদের সাথে যোগাযোগ করুন")}
          </h2>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {rows.filter((row) => row.value).map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
              {href ? (
                <a href={href} className="mt-1 block break-words text-[13px] font-medium text-heading hover:text-primary">{value}</a>
              ) : (
                <p className="mt-1 break-words text-[13px] font-medium text-heading">{value}</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-center">
          <Link to="/contact" className="inline-flex rounded-full bg-primary px-5 py-3 text-[13px] font-semibold text-primary-foreground">
            বার্তা পাঠান
          </Link>
        </div>
      </div>
    </section>
  );
}