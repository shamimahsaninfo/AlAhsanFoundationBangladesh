import { ChevronDown } from "lucide-react";
import { text } from "@/lib/copy";

export default function FaqAccordion({ settings }) {
  const faqs = settings.faqs || [];
  if (!faqs.length) return null;
  return (
    <section data-color-key="home-faq" data-color-label="সাধারণ জিজ্ঞাসা" className="relative py-12 sm:py-16">
      <div className="shell max-w-3xl">
        <div className="text-center">
          <span className="eyebrow">সাধারণ জিজ্ঞাসা</span>
          <h2 className="text-heading mt-2 font-heading text-[23px] font-bold sm:text-[30px]">
            {text(settings, "faq_title", "প্রায়ই জিজ্ঞাসিত প্রশ্ন")}
          </h2>
        </div>
        <div className="mt-6 space-y-2.5">
          {faqs.map((faq, index) => (
            <details key={`${faq.question}-${index}`} className="card-elev group px-4 py-3.5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-heading text-[14px] font-semibold text-heading">
                {faq.question}
                <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2.5 whitespace-pre-line text-[12.5px] leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}