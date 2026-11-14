import { VISUAL_SELECTOR } from "@/lib/visual-colors";

const IMAGE_TAGS = new Set(["img", "picture", "video", "iframe"]);
const TEXT_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "a", "button", "li", "strong", "em", "b", "i", "small", "label", "dt", "dd", "blockquote", "figcaption", "summary", "th", "td"]);

export function editableElement(target) {
  let element = target?.nodeType === 1 ? target : target?.parentElement;
  if (!element?.closest(".site-theme")) return null;
  const icon = element.closest("svg");
  if (icon && !IMAGE_TAGS.has(element.tagName.toLowerCase())) element = icon.parentElement;
  if (element?.closest('[data-color-key="home-hero"]') && element.closest("[data-color-backdrop],.absolute.-z-10")) return element.closest('[data-color-key="home-hero"]');
  return element?.closest(".site-theme") ? element : null;
}
export function elementSelector(element) {
  const root = element.closest("[data-color-key]");
  if (!root) return null;
  const parts = [];
  for (let node = element; node && node !== root; node = node.parentElement) {
    const siblings = [...node.parentElement.children].filter((child) => child.tagName === node.tagName);
    parts.unshift(`${node.tagName.toLowerCase()}:nth-of-type(${siblings.indexOf(node) + 1})`);
  }
  const selector = `[data-color-key="${root.dataset.colorKey}"]${parts.length ? ` > ${parts.join(" > ")}` : ""}`;
  return selector.length <= 1200 && VISUAL_SELECTOR.test(selector) ? selector : null;
}
function hex(color) {
  const values = color.match(/[\d.]+/g)?.map(Number);
  if (!values || values.length < 3 || (values.length === 4 && values[3] === 0)) return null;
  return `#${values.slice(0, 3).map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0")).join("")}`;
}
function imageSource(element, computed) {
  const tag = element.tagName.toLowerCase();
  if (tag === "video") return element.getAttribute("poster") || "";
  if (tag === "img") return element.getAttribute("src") || "";
  return computed.backgroundImage?.match(/url\(["']?(.*?)["']?\)/)?.[1] || "";
}
function elementKind(element) {
  const tag = element.tagName.toLowerCase();
  if (IMAGE_TAGS.has(tag)) return "image";
  if (tag === "a" && element.closest('[data-color-key^="menu-"]')) return "menu";
  if (TEXT_TAGS.has(tag) && element.childElementCount === 0 && element.textContent.trim()) return "text";
  return "box";
}
const TAG_LABELS = { h1: "শিরোনাম", h2: "শিরোনাম", h3: "শিরোনাম", p: "লেখা", span: "লেখা", a: "লিংক / বাটন", button: "বাটন", header: "মেনু বার", footer: "ফুটার", section: "সেকশন", article: "কার্ড", nav: "মেনু", input: "ইনপুট", form: "ফর্ম", main: "পেজের মূল অংশ", details: "প্রশ্নের কার্ড", img: "ছবি", video: "ভিডিও" };
const KIND_LABELS = { image: "ছবি", menu: "মেনু আইটেম", text: "লেখা", box: "অংশ / ব্যাকগ্রাউন্ড" };

export function describeElement(element, pathname) {
  const selector = elementSelector(element);
  if (!selector) return null;
  const computed = element.ownerDocument.defaultView.getComputedStyle(element);
  const kind = elementKind(element);
  const caption = element.getAttribute("aria-label") || element.getAttribute("placeholder") || element.textContent?.trim().replace(/\s+/g, " ").slice(0, 65);
  const title = element.dataset.colorLabel || TAG_LABELS[element.tagName.toLowerCase()] || (element.className?.includes?.("card") ? "কার্ড" : KIND_LABELS[kind]);
  const scope = element.closest("[data-color-global],[data-color-local]");
  return {
    selector,
    path: scope?.hasAttribute("data-color-global") ? "*" : pathname,
    label: title,
    kind,
    kindLabel: KIND_LABELS[kind],
    caption,
    text: kind === "text" || kind === "menu" ? element.textContent.trim().slice(0, 300) : "",
    href: kind === "menu" ? element.getAttribute("href") || "" : "",
    imageSrc: kind === "image" ? imageSource(element, computed) : "",
    radius: Math.round(parseFloat(computed.borderTopLeftRadius) || 0),
    fontSize: Math.round(parseFloat(computed.fontSize) || 16),
    fontWeight: parseInt(computed.fontWeight, 10) || 400,
    lineHeight: (() => {
      const size = parseFloat(computed.fontSize) || 16;
      const height = parseFloat(computed.lineHeight);
      return Number.isFinite(height) ? Math.round((height / size) * 100) / 100 : 1.5;
    })(),
    align: computed.textAlign === "start" || computed.textAlign === "justify" ? "left" : computed.textAlign === "end" ? "right" : computed.textAlign,
    padding: Math.round(parseFloat(computed.paddingTop) || 0),
    isHeader: Boolean(element.closest('[data-color-key="site-header"]')),
    canParent: Boolean(element.parentElement?.closest(".site-theme")),
    colors: { text: hex(computed.color), background: hex(computed.backgroundColor), border: hex(computed.borderTopColor) },
  };
}