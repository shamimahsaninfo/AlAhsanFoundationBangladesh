import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Home as HomeIcon,
  FolderHeart,
  Target,
  Images,
  ListOrdered,
  Repeat,
  HeartHandshake,
  Wallet,
  CreditCard,
  Users,
  Settings,
  Palette,
  MessageSquare,
  ExternalLink,
  Menu,
  X,
  LogOut,
  ShieldAlert,
  Download,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import BrandMark from "@/components/site/BrandMark";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const NAV = [
  { to: "/admin", label: "ড্যাশবোর্ড", icon: LayoutDashboard, exact: true },
  { to: "/admin/activities", label: "কার্যক্রম", icon: FolderHeart },
  { to: "/admin/projects", label: "প্রকল্প", icon: Target },
  { to: "/admin/overview", label: "কার্যক্রম ওভারভিউ", icon: Images },
  { to: "/admin/donations", label: "অনুদান", icon: HeartHandshake },
  { to: "/admin/auto-donations", label: "মাসিক অটো-দান", icon: Repeat },
  { to: "/admin/ledger", label: "আয়-ব্যয় হিসাব", icon: Wallet },
  { to: "/admin/home", label: "হোমপেজ", icon: HomeIcon },
  { to: "/admin/menu", label: "মেনু এডিটর", icon: ListOrdered },
  { to: "/admin/payment", label: "পেমেন্ট গেটওয়ে", icon: CreditCard },
  { to: "/admin/members", label: "সদস্য", icon: Users },
  { to: "/admin/messages", label: "বার্তা", icon: MessageSquare },
  { to: "/admin/settings", label: "সাইট সেটিংস", icon: Settings },
  { to: "/admin/design", label: "ভিজ্যুয়াল রঙ এডিটর", icon: Palette },
  { to: "/admin/export", label: "জিপ ডাউনলোড / GitHub", icon: Download },
];

export default function AdminLayout({ children }) {
  const { user, isLoadingAuth, logout } = useAuth();
  const { settings } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (isLoadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (user && user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-md rounded-3xl border border-border bg-card p-10 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 font-heading text-xl font-semibold text-primary">অ্যাডমিন অ্যাক্সেস প্রয়োজন</h1>
          <p className="mt-2 text-[14px] text-muted-foreground">
            এই প্যানেল ব্যবহার করতে অ্যাডমিন অনুমতি প্রয়োজন। অনুগ্রহ করে ফাউন্ডেশনের অ্যাডমিনের সাথে যোগাযোগ করুন।
          </p>
          <button
            onClick={() => logout("/")}
            className="mt-6 rounded-full bg-primary px-5 py-2.5 text-[13.5px] font-semibold text-primary-foreground"
          >
            লগআউট
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col bg-sidebar text-sidebar-foreground/80 lg:flex">
        <Link to="/admin" className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <BrandMark light src={settings.logo_url} className="h-10 w-10" />
          <span>
            <span className="block font-heading text-[15px] font-semibold text-sidebar-foreground">{settings.short_name}</span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-white/45">Admin Console</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] transition-colors ${
                  active ? "bg-white/10 font-semibold text-accent" : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" /> ওয়েবসাইট দেখুন
          </Link>
          <button
            onClick={() => logout("/")}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> লগআউট
          </button>
        </div>
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-white/85 px-5 py-3.5 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border lg:hidden"
              aria-label="মেনু"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">অ্যাডমিন প্যানেল</p>
              <p className="font-heading text-[15px] font-semibold text-primary">{settings.site_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-[13px] font-medium text-foreground">{user?.full_name || "অ্যাডমিন"}</p>
              <p className="text-[11px] text-muted-foreground">{user?.email}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-[13px] font-semibold text-primary-foreground">
              {(user?.full_name || "A").slice(0, 1).toUpperCase()}
            </span>
          </div>
        </header>

        {open && (
          <div className="border-b border-border bg-white px-3 py-3 lg:hidden">
            <div className="grid grid-cols-2 gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[13px] text-foreground/80 hover:bg-secondary"
                >
                  <item.icon className="h-4 w-4" /> {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}