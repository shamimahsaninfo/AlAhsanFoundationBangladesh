import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import MobileTabBar from "@/components/site/MobileTabBar";
import AiAssistant from "@/components/site/AiAssistant";
import { SettingsProvider } from "@/components/site/SettingsContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import SiteVisualColors from "@/components/site/SiteVisualColors";
import SiteDomOverrides from "@/components/site/SiteDomOverrides";

export default function SiteShell({ children }) {
  const { settings } = useSiteSettings();

  return (
    <SettingsProvider settings={settings}>
      <div data-color-key="site" data-color-global="true" data-color-label="পুরো সাইটের ব্যাকগ্রাউন্ড" className="site-theme flex min-h-screen flex-col bg-background" data-designed={Object.keys(settings.theme_options || {}).length ? "true" : undefined} data-motion={settings.theme_options?.motion_enabled === false ? "off" : undefined}>
        {settings.theme_custom_css && <style data-site-custom-css>{settings.theme_custom_css}</style>}
        <SiteVisualColors settings={settings} />
        <SiteDomOverrides settings={settings} />
        <SiteHeader settings={settings} />
        <main data-color-key="page-main" data-color-local="true" className="flex-1 pb-[86px] lg:pb-0">{children}</main>
        <SiteFooter settings={settings} />
        <MobileTabBar />
        <AiAssistant settings={settings} />
      </div>
    </SettingsProvider>
  );
}