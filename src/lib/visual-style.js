import { HEX_COLOR, VISUAL_SELECTOR } from "@/lib/visual-colors";

export const FONT_OPTIONS = [
  ["", "মূল ফন্ট"],
  ["var(--font-heading)", "শিরোনাম ফন্ট"],
  ["var(--font-body)", "বডি ফন্ট"],
  ["'Hind Siliguri', sans-serif", "হিন্দ সিলিগুড়ি"],
  ["'Noto Serif Bengali', serif", "নোটো সেরিফ বাংলা"],
  ["Georgia, 'Times New Roman', serif", "জর্জিয়া সেরিফ"],
  ["system-ui, -apple-system, sans-serif", "সিস্টেম স্যান্স"],
];

export const RADIUS_PRESETS = [
  ["চার কোণা", 0],
  ["সামান্য গোল", 6],
  ["মাঝারি গোল", 16],
  ["বেশি গোল", 28],
  ["সম্পূর্ণ গোল", 999],
];

export const SHADOW_PRESETS = [
  ["নেই", "none"],
  ["হালকা", "sm"],
  ["মাঝারি", "md"],
  ["গাঢ়", "lg"],
];

export const SHADOWS = {
  none: "none",
  sm: "0 1px 2px hsl(var(--shade) / 0.06), 0 6px 16px -12px hsl(var(--shade) / 0.28)",
  md: "0 2px 4px hsl(var(--shade) / 0.06), 0 18px 42px -26px hsl(var(--shade) / 0.45)",
  lg: "0 8px 16px hsl(var(--shade) / 0.08), 0 36px 76px -34px hsl(var(--shade) / 0.62)",
};

export const BORDER_STYLES = [
  ["solid", "সোজা"],
  ["dashed", "ড্যাশ"],
  ["dotted", "ডট"],
  ["none", "নেই"],
];

export const ALIGN_OPTIONS = [
  ["left", "বাম"],
  ["center", "মাঝে"],
  ["right", "ডান"],
];

export const WEIGHT_OPTIONS = [
  ["300", "হালকা"],
  ["400", "সাধারণ"],
  ["500", "মাধ্যম"],
  ["600", "সেমিবোল্ড"],
  ["700", "বোল্ড"],
];

export const CARD_TARGETS = ".card-elev,.card-lift,.amount-card,.thumb-card,.media-frame,.glass-panel,.glass,details";
export const BUTTON_TARGETS = ".btn-primary-app,.btn-gold-app,.btn-donate,.btn-auto,.btn-member,.freq-chip";
export const INPUT_TARGETS = "input,textarea,select,.input-app";
export const IMAGE_TARGETS = "img,video";

export const EMPTY_GLOBAL = { card_radius: null, button_radius: null, input_radius: null, image_radius: null, shadow: "", font_family: "" };

const px = (value) => `${Math.round(Number(value))}px`;
const num = (value) => (value === null || value === undefined || value === "" ? null : Number(value));
const validHex = (value) => typeof value === "string" && HEX_COLOR.test(value);

export function cleanProps(props = {}) {
  return Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== null && value !== undefined && value !== "" && value !== false)
  );
}

export function ruleProps(styles, selection) {
  const rule = (Array.isArray(styles) ? styles : []).find(
    (item) => item?.path === selection?.path && item?.selector === selection?.selector
  );
  return rule?.props || {};
}

export function propsToDeclarations(props = {}) {
  const decls = [];
  if (props.hidden) decls.push("display:none!important");

  if (validHex(props.color)) decls.push(`color:${props.color}!important`, `-webkit-text-fill-color:${props.color}!important`);

  if (validHex(props.background)) {
    if (validHex(props.background2)) {
      const angle = Number(props.gradient_angle) || 135;
      decls.push(`background-image:linear-gradient(${angle}deg, ${props.background}, ${props.background2})!important`);
    } else {
      decls.push("background-image:none!important", `background-color:${props.background}!important`);
    }
  }

  const corners = ["radius_tl", "radius_tr", "radius_br", "radius_bl"].map((key) => num(props[key]));
  if (corners.some((value) => value !== null)) {
    const radius = Math.min(999, Math.max(0, Math.round(Number(props.radius) || 0)));
    const [tl, tr, br, bl] = corners.map((value) => (value === null ? radius : Math.min(999, Math.max(0, Math.round(value)))));
    decls.push(`border-radius:${px(tl)} ${px(tr)} ${px(br)} ${px(bl)}!important`);
  } else if (num(props.radius) !== null) {
    decls.push(`border-radius:${px(Math.min(999, Math.max(0, Number(props.radius))))}!important`);
  }

  if (num(props.border_width) !== null || props.border_style || validHex(props.border_color)) {
    const width = num(props.border_width);
    decls.push(`border-style:${props.border_style || "solid"}!important`);
    decls.push(`border-width:${px(width === null ? 1 : width)}!important`);
    if (validHex(props.border_color)) decls.push(`border-color:${props.border_color}!important`);
  }

  if (props.shadow && SHADOWS[props.shadow]) decls.push(`box-shadow:${SHADOWS[props.shadow]}!important`);

  if (num(props.padding) !== null) decls.push(`padding:${px(props.padding)}!important`);
  if (num(props.margin) !== null) decls.push(`margin:${px(props.margin)}!important`);
  if (num(props.width) !== null) decls.push(`width:${px(props.width)}!important`, "max-width:100%!important");
  if (num(props.height) !== null) decls.push(`height:${px(props.height)}!important`);
  if (num(props.opacity) !== null) decls.push(`opacity:${Math.min(100, Math.max(0, Number(props.opacity))) / 100}!important`);

  if (props.font_family) decls.push(`font-family:${props.font_family}!important`);
  if (num(props.font_size) !== null) decls.push(`font-size:${px(props.font_size)}!important`);
  if (num(props.font_weight) !== null) decls.push(`font-weight:${Math.round(Number(props.font_weight))}!important`);
  if (num(props.line_height) !== null) decls.push(`line-height:${Number(props.line_height)}!important`);
  if (props.align) decls.push(`text-align:${props.align}!important`);

  if (props.fit) decls.push(`object-fit:${props.fit}!important`, `background-size:${props.fit}!important`, "background-position:center!important");

  return decls.join(";");
}

function activeRules(rules, pathname) {
  return (Array.isArray(rules) ? rules : []).filter(
    (rule) => rule && (rule.path === "*" || rule.path === pathname) && VISUAL_SELECTOR.test(rule.selector || "")
  );
}

export function buildStyleCss(styles = [], pathname = "/") {
  return activeRules(styles, pathname)
    .map((rule) => {
      const decls = propsToDeclarations(rule.props || {});
      return decls ? `${rule.selector}{${decls}}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

export function buildGlobalCss(globals = {}) {
  const parts = [];
  const radius = (value) => (num(value) === null ? null : px(Math.min(999, Math.max(0, Number(value)))));
  const card = radius(globals.card_radius), button = radius(globals.button_radius);
  const input = radius(globals.input_radius), image = radius(globals.image_radius);
  if (card) parts.push(`${CARD_TARGETS}{border-radius:${card}!important}`);
  if (button) parts.push(`${BUTTON_TARGETS}{border-radius:${button}!important}`);
  if (input) parts.push(`${INPUT_TARGETS}{border-radius:${input}!important}`);
  if (image) parts.push(`${IMAGE_TARGETS}{border-radius:${image}!important;overflow:hidden}`);
  if (globals.shadow && SHADOWS[globals.shadow]) parts.push(`${CARD_TARGETS}{box-shadow:${SHADOWS[globals.shadow]}!important}`);
  if (globals.font_family) {
    parts.push(`body,[data-color-key]{font-family:${globals.font_family}!important}`);
    parts.push(`h1,h2,h3,h4,h5,.font-heading{font-family:${globals.font_family}!important}`);
  }
  return parts.join("\n");
}