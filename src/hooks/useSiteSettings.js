import { useStoredSiteSettings } from "@/components/site/SiteSettingsStore";
import { persistSiteSettings } from "@/lib/settings-fns";
export { applyTheme, hexToHslChannels } from "@/lib/site-theme";

export const useSiteSettings = useStoredSiteSettings;

export async function saveSiteSettings(values) {
  const saved = await persistSiteSettings({ data: values });
  window.dispatchEvent(new CustomEvent("site-settings-saved", { detail: saved }));
  return saved;
}