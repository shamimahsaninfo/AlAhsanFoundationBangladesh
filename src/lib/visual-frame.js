import { buildThemeStyle } from "@/lib/site-theme";
import { buildVisualCss, isPreviewPath } from "@/lib/visual-colors";
import { buildVisualShapeCss } from "@/lib/visual-shapes";
import { buildStyleCss, buildGlobalCss } from "@/lib/visual-style";
import { applyVisualOverrides } from "@/lib/visual-overrides";
import { applyVisualMoves } from "@/lib/visual-moves";
import { editableElement, describeElement, elementSelector } from "@/lib/visual-selection";

export function connectVisualFrame(frame, getState) {
  const doc = frame.contentDocument;
  const win = frame.contentWindow;
  if (!doc?.body || !doc.querySelector(".site-theme")) throw new Error("প্রিভিউ লোড হয়নি। আবার লোড করুন।");
  let selected = null, hovered = null, pending = 0;
  const style = doc.createElement("style"), custom = doc.createElement("style"), ui = doc.createElement("style");
  const shapes = doc.createElement("style"), styles = doc.createElement("style"), globals = doc.createElement("style");
  ui.textContent = '[data-visual-selected]{outline:3px solid hsl(var(--ring))!important;outline-offset:-3px!important;}[data-visual-hover]:not([data-visual-selected]){outline:2px dashed hsl(var(--ring))!important;outline-offset:-2px!important;}html[data-visual-mode="select"] .site-theme *{cursor:crosshair!important;}html[data-visual-mode="select"] iframe{pointer-events:none!important;}';
  doc.head.append(custom, globals, style, shapes, styles, ui);
  const refresh = () => { if (selected?.isConnected) getState().onSelect(describeElement(selected, win.location.pathname)); };
  const select = (element) => {
    if (!element || !describeElement(element, win.location.pathname)) return;
    selected?.removeAttribute("data-visual-selected");
    selected = element; selected.setAttribute("data-visual-selected", ""); refresh();
  };
  const apply = () => {
    const { settings, mode } = getState();
    doc.querySelectorAll("style[data-site-visual-colors],style[data-site-visual-shapes],style[data-site-visual-styles],style[data-site-visual-global],style[data-site-custom-css]").forEach((node) => { if (node.sheet) node.sheet.disabled = true; });
    const globalCss = buildGlobalCss(settings.visual_global || {});
    if (globals.textContent !== globalCss) globals.textContent = globalCss;
    const css = buildVisualCss(settings.visual_colors, win.location.pathname);
    if (style.textContent !== css) style.textContent = css;
    const shapeCss = buildVisualShapeCss(settings.visual_shapes, win.location.pathname);
    if (shapes.textContent !== shapeCss) shapes.textContent = shapeCss;
    const styleCss = buildStyleCss(settings.visual_styles, win.location.pathname);
    if (styles.textContent !== styleCss) styles.textContent = styleCss;
    applyVisualMoves(doc, settings.visual_moves, win.location.pathname);
    applyVisualOverrides(doc, settings, win.location.pathname);
    if (custom.textContent !== (settings.theme_custom_css || "")) custom.textContent = settings.theme_custom_css || "";
    for (const [key, value] of Object.entries(buildThemeStyle(settings))) doc.documentElement.style.setProperty(key, value);
    doc.documentElement.dataset.visualMode = mode;
    const site = doc.querySelector(".site-theme");
    if (site) site.dataset.motion = settings.theme_options?.motion_enabled === false ? "off" : "on";
    doc.querySelectorAll(".site-header .site-menu-link").forEach((link) => {
      const item = settings.menu_items?.find((item) => item.to === link.getAttribute("href"));
      if (item?.color) link.style.color = item.color; else link.style.removeProperty("color");
    });
    if (mode !== "select") { selected?.removeAttribute("data-visual-selected"); hovered?.removeAttribute("data-visual-hover"); }
    else selected?.setAttribute("data-visual-selected", "");
    refresh();
  };
  const similar = (selector) => {
    const element = doc.querySelector(selector);
    if (!element || !element.classList.length) return selector ? [selector] : [];
    const signature = [...element.classList].sort().join("|");
    return [...doc.querySelectorAll(".site-theme *")]
      .filter((node) => node.tagName === element.tagName && [...node.classList].sort().join("|") === signature)
      .map((node) => elementSelector(node))
      .filter(Boolean)
      .slice(0, 80);
  };
  const stop = (event) => { event.preventDefault(); event.stopImmediatePropagation(); };
  const click = (event) => {
    const element = editableElement(event.target);
    if (!element) return;
    if (getState().mode === "select") { stop(event); select(element); return; }
    const link = element.closest("a");
    if (link) {
      stop(event);
      const url = new URL(link.href, win.location.href);
      if (url.origin === win.location.origin && isPreviewPath(url.pathname)) {
        if (url.pathname === win.location.pathname && url.hash) doc.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView();
        else getState().onNavigate(`${url.pathname}${url.search}${url.hash}`);
      }
    } else if (element.closest('button[type="submit"],form button:not([type]),[data-visual-readonly] button,button[aria-label*="লিংক কপি"]')) stop(event);
  };
  const hover = (event) => {
    if (getState().mode !== "select" || event.pointerType === "touch") return;
    hovered?.removeAttribute("data-visual-hover"); hovered = editableElement(event.target); hovered?.setAttribute("data-visual-hover", "");
  };
  const blockSubmit = (event) => stop(event);
  const blockPointer = (event) => {
    const element = editableElement(event.target);
    if (getState().mode === "select" && element) event.stopImmediatePropagation();
  };
  doc.addEventListener("click", click, true); doc.addEventListener("pointerover", hover, true);
  doc.addEventListener("submit", blockSubmit, true); doc.addEventListener("pointerdown", blockPointer, true);
  const observer = new win.MutationObserver(() => {
    if (pending) return;
    pending = win.requestAnimationFrame(() => { pending = 0; apply(); });
  });
  observer.observe(doc.body, { childList: true, subtree: true });
  apply();
  return { apply, similar, parent: () => select(selected?.parentElement), clear: () => { selected?.removeAttribute("data-visual-selected"); selected = null; getState().onSelect(null); }, destroy: () => { observer.disconnect(); win.cancelAnimationFrame(pending); selected?.removeAttribute("data-visual-selected"); hovered?.removeAttribute("data-visual-hover"); doc.removeEventListener("click", click, true); doc.removeEventListener("pointerover", hover, true); doc.removeEventListener("submit", blockSubmit, true); doc.removeEventListener("pointerdown", blockPointer, true); style.remove(); custom.remove(); shapes.remove(); styles.remove(); globals.remove(); ui.remove(); } };
}