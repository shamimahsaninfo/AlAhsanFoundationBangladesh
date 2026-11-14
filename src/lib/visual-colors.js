export const VISUAL_SELECTOR = /^\[data-color-key="[a-zA-Z0-9_-]{1,120}"\](?: > [a-z][a-z0-9-]*:nth-of-type\([1-9][0-9]{0,3}\)){0,24}$/;
export const HEX_COLOR = /^#[0-9a-f]{6}$/i;
export const PREVIEW_PAGES = [["/", "হোমপেজ"], ["/about", "আমাদের সম্পর্কে"], ["/activities", "কার্যক্রম"], ["/donate", "অনুদান"], ["/auto-donation", "অটো ডোনেশন"], ["/membership", "সদস্যপদ"], ["/transparency", "হিসাবের স্বচ্ছতা"], ["/verify", "রসিদ যাচাই"], ["/contact", "যোগাযোগ"], ["/terms", "শর্তাবলী"], ["/privacy", "গোপনীয়তা নীতি"], ["/refund", "ফেরত নীতি"]];
export function isPreviewPath(path) {
  return PREVIEW_PAGES.some(([value]) => value === path) || /^\/(activities|receipt|certificate)\/[a-zA-Z0-9_-]+\/?$/.test(path);
}
export function buildVisualCss(rules = [], pathname = "/") {
  return rules.filter((rule) => (rule.path === "*" || rule.path === pathname) && VISUAL_SELECTOR.test(rule.selector)).map((rule) => {
    const s = rule.selector;
    let css = "";
    if (HEX_COLOR.test(rule.text || "")) css += `${s},${s} *{color:${rule.text}!important;-webkit-text-fill-color:${rule.text}!important;}`;
    if (HEX_COLOR.test(rule.background || "")) css += `${s}{background-color:${rule.background}!important;background-image:none!important;}${s} [data-color-backdrop]{background:${rule.background}!important;}`;
    if (HEX_COLOR.test(rule.border || "")) css += `${s}{border-color:${rule.border}!important;border-style:solid!important;border-width:1px!important;}`;
    return css;
  }).join("\n");
}