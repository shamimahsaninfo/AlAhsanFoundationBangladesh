import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/AuthContext";
import { Base44Scripts } from "base44:document";
import appCss from "@/index.css?url";
import SiteSettingsStore from "@/components/site/SiteSettingsStore";
import PwaRegister from "@/components/site/PwaRegister";
import { loadSiteSettings } from "@/lib/settings-fns";
import { buildThemeStyle } from "@/lib/site-theme";

export const Route = createRootRoute({
  loader: () => loadSiteSettings(),
  staleTime: 0,
  shouldReload: true,
  headers: () => ({ "cache-control": "no-store" }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#004D40" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "আল আহসান" },
      { title: "আল আহসান ফাউন্ডেশন বাংলাদেশ" },
      {
        name: "description",
        content:
          "আল আহসান ফাউন্ডেশন বাংলাদেশ — শিক্ষা, খাদ্য, চিকিৎসা ও বিশুদ্ধ পানির কার্যক্রম, স্বচ্ছ হিসাব এবং যাচাইযোগ্য রসিদসহ অনুদান ব্যবস্থা।",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icon-512.png" },
      { rel: "icon", href: "/icon-512.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
  component: RootComponent,
});

function RootComponent() {
  const settings = Route.useLoaderData();
  return (
    <AuthProvider>
      <SiteSettingsStore initialSettings={settings}>
        <Outlet />
        <Toaster />
        <PwaRegister />
      </SiteSettingsStore>
    </AuthProvider>
  );
}

function RootDocument({ children }) {
  const settings = Route.useLoaderData();
  return (
    <html lang="bn" style={buildThemeStyle(settings)} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body data-react-root="true" suppressHydrationWarning>
        {children}
        <Base44Scripts />
        <Scripts />
      </body>
    </html>
  );
}