import { VISUAL_SELECTOR } from "@/lib/visual-colors";

export function buildVisualShapeCss(rules = [], pathname = "/") {
  return rules
    .filter((rule) => (rule.path === "*" || rule.path === pathname) && VISUAL_SELECTOR.test(rule.selector) && Number.isFinite(Number(rule.radius)))
    .map((rule) => {
      const radius = Math.min(1000, Math.max(0, Math.round(Number(rule.radius))));
      return `${rule.selector}{border-radius:${radius}px!important;}`;
    })
    .join("\n");
}