import { createContext, useContext } from "react";
import { defaultSettings } from "@/data/sampleContent";

const SettingsContext = createContext(defaultSettings);

export function SettingsProvider({ settings, children }) {
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}