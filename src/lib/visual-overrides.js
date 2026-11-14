import { VISUAL_SELECTOR } from "@/lib/visual-colors";

function activeRules(rules, property, pathname) {
  return (Array.isArray(rules) ? rules : []).filter(
    (rule) =>
      rule &&
      (rule.path === "*" || rule.path === pathname) &&
      VISUAL_SELECTOR.test(rule.selector || "") &&
      typeof rule[property] === "string" &&
      rule[property].length > 0
  );
}

function registry(doc) {
  if (!doc.__visualRegistry) doc.__visualRegistry = { texts: new Map(), images: new Map() };
  return doc.__visualRegistry;
}

function setImage(element, url) {
  const tag = element.tagName.toLowerCase();
  if (tag === "video" || tag === "iframe") {
    if (element.getAttribute("poster") !== url) element.setAttribute("poster", url);
    return;
  }
  if (tag === "img") {
    if (element.dataset.visualImage === url && element.getAttribute("src") === url) return;
    element.dataset.visualImage = url;
    element.removeAttribute("srcset");
    element.removeAttribute("sizes");
    element.src = url;
    return;
  }
  const background = `url("${url}")`;
  if (element.style.backgroundImage !== background) {
    element.style.backgroundImage = background;
    element.style.backgroundSize = "cover";
    element.style.backgroundPosition = "center";
  }
}

/** লেখা, ছবি ও কোণার পরিবর্তন বর্তমান পেজের DOM-এ প্রয়োগ করে (মূল সাইট ও প্রিভিউ — দুটোতেই)। */
export function applyVisualOverrides(doc, settings = {}, pathname = "/") {
  if (!doc?.querySelectorAll) return;
  const store = registry(doc);

  const textElements = new Map();
  for (const rule of activeRules(settings.visual_texts, "text", pathname)) {
    doc.querySelectorAll(rule.selector).forEach((element) => {
      if (!store.texts.has(element)) store.texts.set(element, element.textContent);
      textElements.set(element, rule.text);
    });
  }
  for (const [element, original] of [...store.texts]) {
    if (!textElements.has(element)) {
      if (element.isConnected) element.textContent = original;
      store.texts.delete(element);
    }
  }
  for (const [element, text] of textElements) if (element.textContent !== text) element.textContent = text;

  const imageElements = new Map();
  for (const rule of activeRules(settings.visual_images, "url", pathname)) {
    doc.querySelectorAll(rule.selector).forEach((element) => imageElements.set(element, rule.url));
  }
  for (const [element, original] of [...store.images]) {
    if (!imageElements.has(element)) {
      if (element.isConnected && original !== null) {
        element.setAttribute("src", original);
        delete element.dataset.visualImage;
      }
      store.images.delete(element);
    }
  }
  for (const [element, url] of imageElements) {
    if (!store.images.has(element)) store.images.set(element, element.getAttribute("src"));
    setImage(element, url);
  }
}