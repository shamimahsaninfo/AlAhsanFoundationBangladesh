import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Heart, Phone, ChevronRight, HandCoins, LayoutDashboard } from "lucide-react";
import BrandMark from "@/components/site/BrandMark";
import { defaultSettings } from "@/data/sampleContent";
import { siteCopy } from "@/data/siteCopy";
import { DEFAULT_NAV as NAV } from "@/lib/nav";



export default function SiteHeader({ settings = defaultSettings }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navItems = (Array.isArray(settings.menu_items) && settings.menu_items.length ? settings.menu_items : NAV)
    .filter((item) => item?.to && item?.label && item.enabled !== false);
  const t = (key) => siteCopy(settings, key);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header data-color-key="site-header" data-color-global="true" data-color-label="মেনু বার" className="sticky top-0 z-50">
      <div
        className={`site-header border-b transition-all duration-500 ${
          scrolled ? "shadow-[0_10px_30px_-24px_hsl(var(--shade)/0.6)] backdrop-blur-xl" : ""
        }`}
        style={{ borderColor: "hsl(var(--header-border))" }}
      >
        <div className="shell flex h-[64px] items-center justify-between gap-4 lg:h-[76px]">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <BrandMark src={settings.logo_url} className="h-10 w-10 lg:h-12 lg:w-12" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-heading text-[15.5px] font-bold text-primary lg:text-[17.5px]">
                {settings.short_name}
              </span>
              <span className="block truncate text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
                {t("brand_caption")}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                data-color-key={`menu-${item.to.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 110)}`}
                to={item.to}
                className="site-menu-link rounded-full px-3.5 py-2 text-[14px] font-medium"
                style={item.color ? { color: item.color } : undefined}
                activeProps={{ className: "rounded-full bg-secondary font-semibold" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/auto-donation"
              className="btn-auto hidden items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-3 text-[13px] font-semibold leading-none transition-transform hover:-translate-y-0.5 lg:inline-flex"
            >
              <HandCoins className="h-4 w-4" />
              অটো ডোনেশন
            </Link>
            <Link
              to="/my-donations"
              aria-label="আমার দান — ডোনার ড্যাশবোর্ড"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary transition-colors hover:bg-secondary"
            >
              <LayoutDashboard className="h-4 w-4" />
            </Link>
            <Link
              to="/donate"
              className="header-donate btn-donate group inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-5 py-3 text-[13px] font-bold leading-none transition-transform hover:-translate-y-0.5 lg:px-6 lg:py-3.5 lg:text-[14px]"
            >
              <Heart className="h-4 w-4 transition-transform group-hover:scale-110" />
              {t("donate_button")}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="মেনু"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-background lg:hidden">
          <div className="flex h-[64px] items-center justify-between border-b border-border px-5">
            <div className="flex items-center gap-2.5">
              <BrandMark src={settings.logo_url} className="h-9 w-9" />
              <span className="font-heading text-[15px] font-bold text-primary">{settings.short_name}</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="বন্ধ করুন"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                data-color-key={`menu-${item.to.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 110)}`}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15.5px] font-medium text-foreground/85 active:bg-secondary"
                activeProps={{ className: "bg-secondary text-primary font-semibold" }}
              >
                {item.label}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </nav>

          <div className="tabbar-safe border-t border-border px-4 pb-4 pt-3">
            <a href={`tel:${settings.hotline}`} className="mb-2 flex items-center gap-2 px-2 text-[13px] text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" /> {t("hotline_label")} {settings.hotline}
            </a>
            <Link
              to="/donate"
              onClick={() => setOpen(false)}
              className="btn-gold-app"
            >
              <Heart className="h-4 w-4" /> {t("donate_now")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}