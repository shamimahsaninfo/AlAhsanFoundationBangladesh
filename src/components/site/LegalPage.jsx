import SiteShell from "@/components/site/SiteShell";
import { useSettings } from "@/components/site/SettingsContext";

export default function LegalPage({ title, intro, sections }) {
  const settings = useSettings();
  return (
    <SiteShell>
      <div className="shell max-w-3xl py-12 sm:py-16">
        <h1 className="text-heading font-heading text-[26px] font-bold sm:text-[32px]">{title}</h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{intro}</p>
        <div className="mt-7 space-y-5">
          {sections.map((section) => (
            <section key={section.heading} className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-heading text-[15.5px] font-semibold text-heading">{section.heading}</h2>
              <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-6 text-[12.5px] text-muted-foreground">
          যেকোনো প্রশ্নে যোগাযোগ করুন: {settings.email} · {settings.hotline}
        </p>
      </div>
    </SiteShell>
  );
}