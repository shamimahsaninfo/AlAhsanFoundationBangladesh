const c = (colors, token, fallback) => colors[token] || fallback;

export default function ThemePreview({ colors, menuItems = [] }) {
  const nav = menuItems.length ? menuItems : [{ label: "হোম", to: "/" }, { label: "কার্যক্রম", to: "/activities" }, { label: "যোগাযোগ", to: "/contact" }];
  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-sm" style={{ background: c(colors, "background", "#F9F9F9") }}>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5" style={{ background: c(colors, "header-topbar-bg", "#004D40"), color: c(colors, "header-topbar-text", "#E9F5F1") }}>
        <span className="text-[10px]">লাইভ প্রিভিউ</span>
        <span className="text-[10px]">যোগাযোগ: ০১৭০০০০০০০০</span>
      </div>
      <div className="flex items-center justify-between gap-2 border-b px-3 py-2.5" style={{ background: c(colors, "header-bg", "#FFF"), borderColor: c(colors, "header-border", "#E2DFD9") }}>
        <span className="text-[11.5px] font-bold" style={{ color: c(colors, "header-text", "#123B34") }}>আল আহসান</span>
        <div className="flex items-center gap-1.5 overflow-hidden">
          {nav.slice(0, 3).map((item, index) => (
            <span key={item.to || index} className="rounded-full px-2 py-1 text-[9.5px] font-medium" style={{ color: item.color || c(colors, "header-text", "#123B34"), background: index === 0 ? c(colors, "secondary", "#F6F3EA") : "transparent" }}>
              {item.label}
            </span>
          ))}
        </div>
      </div>
      <div className="hero-banner px-3 py-6 text-center" style={{ background: `linear-gradient(168deg, ${c(colors, "banner-overlay-start", "#06302B")}, ${c(colors, "banner-overlay-end", "#031A17")})` }}>
        <p className="text-[9px] font-semibold uppercase tracking-[0.2em]" style={{ color: c(colors, "banner-accent", "#D4AF37") }}>আল আহসান ফাউন্ডেশন</p>
        <p className="mt-1.5 font-heading text-[14px] font-bold leading-snug" style={{ color: c(colors, "banner-title", "#FFF") }}>প্রতিটি অনুদান পৌঁছে যায় সঠিক হাতে</p>
        <p className="mt-1 text-[10px] leading-relaxed" style={{ color: c(colors, "banner-subtitle", "#DBE7E2") }}>স্বচ্ছ হিসাব ও যাচাইযোগ্য রসিদ</p>
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <span className="rounded-full px-2.5 py-1.5 text-[9.5px] font-semibold" style={{ background: c(colors, "member-btn-bg", "#FFF"), color: c(colors, "member-btn-text", "#0B2B27") }}>সদস্য হন</span>
          <span className="rounded-full px-2.5 py-1.5 text-[9.5px] font-semibold" style={{ background: c(colors, "auto-btn-bg", "#0F5B4C"), color: c(colors, "auto-btn-text", "#FBFAF8") }}>অটো ডোনেশন</span>
          <span className="rounded-full px-2.5 py-1.5 text-[9.5px] font-bold" style={{ background: c(colors, "donate-btn-bg", "#D4AF37"), color: c(colors, "donate-btn-text", "#0B2B27") }}>দান করুন</span>
        </div>
      </div>
      <div className="space-y-2 p-3">
        <div className="rounded-xl border p-2.5" style={{ background: c(colors, "card", "#FFF"), borderColor: c(colors, "border", "#E2DFD9") }}>
          <p className="text-[10px] font-semibold" style={{ color: c(colors, "card-foreground", "#121212") }}>আমাদের কার্যক্রম</p>
          <p className="mt-0.5 text-[9px]" style={{ color: c(colors, "muted-foreground", "#5C5C5C") }}>খাদ্য, শিক্ষা, চিকিৎসা ও বিশুদ্ধ পানি</p>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full" style={{ background: c(colors, "secondary", "#F6F3EA") }}>
            <div className="h-full w-2/3 rounded-full" style={{ background: c(colors, "primary", "#004D40") }} />
          </div>
        </div>
        <p className="px-0.5 font-heading text-[11px] font-semibold" style={{ color: c(colors, "heading-text", "#0B2B27") }}>শিরোনামের নমুনা</p>
        <p className="px-0.5 text-[9.5px]" style={{ color: c(colors, "foreground", "#121212") }}>সাধারণ লেখার নমুনা — অনুদানের হিসাব প্রকাশ্য।</p>
      </div>
      <div className="px-3 py-3" style={{ background: c(colors, "footer-bg", "#08211F"), color: c(colors, "footer-text", "#F1F5F3") }}>
        <p className="text-[9.5px] font-semibold" style={{ color: c(colors, "footer-accent", "#D4AF37") }}>ফুটারের শিরোনাম</p>
        <p className="mt-0.5 text-[9px] opacity-80">শর্তাবলী · গোপনীয়তা নীতি · ফেরত নীতি</p>
      </div>
    </div>
  );
}