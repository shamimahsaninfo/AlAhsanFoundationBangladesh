import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { base44 } from "@/api/base44Client";
import { applyTheme } from "@/lib/site-theme";
import { defaultSettings } from "@/data/sampleContent";

const SiteSettingsStoreContext = createContext({ settings: defaultSettings, loading: false });
const newer = (current, next) => !current.updated_date || (next.updated_date && next.updated_date >= current.updated_date) ? next : current;

export default function SiteSettingsStore({ initialSettings, children }) {
  const [settings, setSettings] = useState(initialSettings);
  const router = useRouter();
  useEffect(() => { setSettings((current) => newer(current, initialSettings)); }, [initialSettings]);
  useEffect(() => { applyTheme(settings); }, [settings]);
  useEffect(() => {
    const saved = (event) => setSettings((current) => newer(current, event.detail));
    window.addEventListener("site-settings-saved", saved);
    const unsubscribe = base44.entities.SiteSettings.subscribe(() => { void router.invalidate(); });
    return () => { unsubscribe(); window.removeEventListener("site-settings-saved", saved); };
  }, [router]);
  return <SiteSettingsStoreContext.Provider value={{ settings, loading: false }}>{children}</SiteSettingsStoreContext.Provider>;
}

export function useStoredSiteSettings() { return useContext(SiteSettingsStoreContext); }