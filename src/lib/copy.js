export const text = (settings, key, fallback = "") => settings?.content_text?.[key] ?? fallback;

export function safeLink(to, fallback = "/") {
  if (!to || typeof to !== "string") return fallback;
  return to.startsWith("/") || /^https?:\/\//i.test(to) ? to : fallback;
}