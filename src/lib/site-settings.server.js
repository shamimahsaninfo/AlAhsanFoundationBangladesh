import { defaultSettings } from "@/data/sampleContent";

export const PUBLIC_SETTING_KEYS = [...Object.keys(defaultSettings), "theme_colors", "theme_options", "theme_custom_css", "content_text", "menu_items", "visual_colors", "visual_texts", "visual_images", "visual_shapes", "visual_styles", "visual_global", "visual_moves"];

export async function readSiteSettings(base44) {
  const page = await base44.entities.SiteSettings.list({ sort: "-updated_date", limit: 1 });
  const record = page.items?.[0];
  if (!record) return { ...defaultSettings };
  const fields = Object.fromEntries(PUBLIC_SETTING_KEYS.filter((key) => record[key] != null).map((key) => [key, record[key]]));
  return { ...defaultSettings, ...fields, id: record.id, updated_date: record.updated_date };
}