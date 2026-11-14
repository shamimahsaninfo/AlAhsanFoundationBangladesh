import { Link } from "@tanstack/react-router";
import { Home, LayoutGrid, Heart, Wallet, UserRound } from "lucide-react";
import { useSettings } from "@/components/site/SettingsContext";
import { siteCopy } from "@/data/siteCopy";

export default function MobileTabBar() {
  const settings = useSettings();
  const ITEMS = [
    { label: siteCopy(settings, "mobile_home"), to: "/", icon: Home },
    { label: siteCopy(settings, "mobile_activities"), to: "/activities", icon: LayoutGrid },
    { label: siteCopy(settings, "mobile_donate"), to: "/donate", icon: Heart, primary: true },
    { label: siteCopy(settings, "mobile_accounts"), to: "/transparency", icon: Wallet },
    { label: siteCopy(settings, "mobile_member"), to: "/membership", icon: UserRound },
  ];

  return (
    <nav data-color-key="mobile-tabs" data-color-global="true" data-color-label="মোবাইলের নিচের মেনু" className="tabbar-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-end justify-around px-2 pb-1.5 pt-2">
        {ITEMS.map((item) => {
          const Icon = item.icon;

          if (item.primary) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className="-mt-6 flex flex-col items-center gap-1"
                aria-label={item.label}
              >
                <span className="cta-gold flex h-14 w-14 items-center justify-center rounded-full shadow-lg ring-4 ring-background">
                  <Icon className="h-6 w-6" strokeWidth={2.4} />
                </span>
                <span className="text-[10.5px] font-semibold text-foreground/80">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex min-w-[58px] flex-col items-center gap-1 rounded-xl px-2 py-1 text-muted-foreground"
              activeProps={{ className: "text-primary" }}
            >
              <Icon className="h-[22px] w-[22px]" strokeWidth={1.9} />
              <span className="text-[10.5px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}