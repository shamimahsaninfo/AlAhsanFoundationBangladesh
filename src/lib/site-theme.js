import { COLOR_GROUPS, DESIGN_OPTIONS } from "@/lib/site-design";

export function hexToHslChannels(hex) {
  if (!/^#[0-9a-f]{6}$/i.test(hex || "")) return null;
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), light = (max + min) / 2;
  let hue = 0, saturation = 0;
  if (max !== min) {
    const delta = max - min;
    saturation = delta / (1 - Math.abs(2 * light - 1));
    hue = max === r ? ((g - b) / delta + (g < b ? 6 : 0)) : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  }
  return `${Math.round(hue * 60)} ${Math.round(saturation * 100)}% ${Math.round(light * 100)}%`;
}

export function buildThemeStyle(settings = {}) {
  const style = {};
  for (const group of COLOR_GROUPS) for (const [token, , fallback, setting] of group.fields) {
    const value = setting ? settings[setting] : settings.theme_colors?.[token];
    style[`--${token}`] = hexToHslChannels(value) || hexToHslChannels(fallback);
  }
  for (const [key, , fallback, min, max, unit] of DESIGN_OPTIONS) {
    const value = Math.min(max, Math.max(min, Number(settings.theme_options?.[key] ?? fallback)));
    style[`--site-${key.replaceAll("_", "-")}`] = unit === "px" ? `${value}px` : String(value / 100);
  }
  return style;
}

export function applyTheme(settings) {
  if (typeof document === "undefined") return;
  for (const [key, value] of Object.entries(buildThemeStyle(settings))) document.documentElement.style.setProperty(key, value);
}