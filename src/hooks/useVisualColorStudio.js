import { useMemo, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useSiteSettings, saveSiteSettings } from "@/hooks/useSiteSettings";
import { DEFAULT_COLORS, validateDesign } from "@/lib/site-design";
import { DEFAULT_NAV } from "@/lib/nav";
import { defaultSettings } from "@/data/sampleContent";

const keys = ["visual_colors", "visual_texts", "visual_images", "visual_shapes", "visual_styles", "visual_global", "visual_moves", "theme_colors", "theme_options", "theme_custom_css", "theme_primary", "theme_accent", "theme_surface", "menu_items"];
const PROPERTIES = ["text", "background", "border"];
const cleanRule = (rule) => ({ path: rule.path, selector: rule.selector, ...Object.fromEntries(PROPERTIES.filter((key) => typeof rule[key] === "string" && rule[key]).map((key) => [key, rule[key]])) });
const cleanRules = (rules = []) => rules.map(cleanRule).filter((rule) => rule.text || rule.background || rule.border);
const cleanEntries = (rules = [], property) => (Array.isArray(rules) ? rules : []).filter((rule) => rule?.path && rule?.selector && rule[property] !== undefined && rule[property] !== null && rule[property] !== "").map((rule) => ({ ...rule }));
const cleanStyles = (rules = []) =>
  (Array.isArray(rules) ? rules : [])
    .filter((rule) => rule?.path && rule?.selector && rule.props && Object.keys(rule.props).length)
    .map((rule) => ({ path: rule.path, selector: rule.selector, ...(rule.kind ? { kind: rule.kind } : {}), props: { ...rule.props } }));
const pick = (settings) => ({
  ...Object.fromEntries(keys.filter((key) => settings[key] !== undefined).map((key) => [key, settings[key]])),
  visual_colors: cleanRules(settings.visual_colors),
  visual_texts: cleanEntries(settings.visual_texts, "text"),
  visual_images: cleanEntries(settings.visual_images, "url"),
  visual_shapes: cleanEntries(settings.visual_shapes, "radius"),
  visual_styles: cleanStyles(settings.visual_styles),
  visual_global: { ...(settings.visual_global || {}) },
});
const EMPTY_VISUALS = { visual_colors: [], visual_texts: [], visual_images: [], visual_shapes: [], visual_styles: [], visual_moves: [], visual_global: {} };

export default function useVisualColorStudio() {
  const { settings } = useSiteSettings();
  const router = useRouter(), group = useRef(null);
  const [state, setState] = useState(() => ({ draft: pick(settings), past: [] }));
  const [baseline, setBaseline] = useState(() => JSON.stringify(pick(settings)));
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [message, setMessage] = useState("");
  const [clipboard, setClipboard] = useState(null);
  const change = (updater, transaction = null) => {
    if (busy) return;
    setError(""); setMessage("");
    const same = transaction && group.current === transaction; group.current = transaction;
    setState((current) => { const draft = updater(current.draft); return JSON.stringify(draft) === JSON.stringify(current.draft) ? current : { draft, past: same ? current.past : [...current.past.slice(-99), current.draft] }; });
  };
  const color = (selection, property, value) => change((draft) => {
    const rules = [...draft.visual_colors];
    const index = rules.findIndex((rule) => rule.path === selection.path && rule.selector === selection.selector);
    const rule = cleanRule({ ...(rules[index] || { path: selection.path, selector: selection.selector }), [property]: value });
    if (index < 0) rules.push(rule); else rules[index] = rule;
    return { ...draft, visual_colors: cleanRules(rules) };
  }, `${selection.path}|${selection.selector}|${property}`);
  const overwrite = (listKey, property, selection, value) => change((draft) => {
    const rules = [...(draft[listKey] || [])];
    const index = rules.findIndex((rule) => rule.path === selection.path && rule.selector === selection.selector);
    if (value === "" || value === null || value === undefined) { if (index >= 0) rules.splice(index, 1); return { ...draft, [listKey]: rules }; }
    const next = { ...(rules[index] || { path: selection.path, selector: selection.selector }), [property]: value };
    if (index < 0) rules.push(next); else rules[index] = next;
    return { ...draft, [listKey]: rules };
  }, `${listKey}|${selection.path}|${selection.selector}`);
  const text = (selection, value) => overwrite("visual_texts", "text", selection, (value || "").slice(0, 600));
  const image = (selection, url) => overwrite("visual_images", "url", selection, url || "");
  const shape = (selection, radius) => overwrite("visual_shapes", "radius", selection, radius === null ? null : Math.min(1000, Math.max(0, Math.round(Number(radius) || 0))));
  const styleRule = (selection) => (state.draft.visual_styles || []).find((rule) => rule.path === selection?.path && rule.selector === selection?.selector);
  const styleProps = (selection) => styleRule(selection)?.props || {};
  const writeStyle = (selection, mutate, transaction) => change((draft) => {
    const list = [...(draft.visual_styles || [])];
    const index = list.findIndex((rule) => rule.path === selection.path && rule.selector === selection.selector);
    const current = list[index] || { path: selection.path, selector: selection.selector, kind: selection.kind, props: {} };
    const next = { ...current, ...(selection.kind ? { kind: selection.kind } : {}), props: mutate({ ...current.props }) };
    if (index < 0) list.push(next); else list[index] = next;
    return { ...draft, visual_styles: list.filter((rule) => Object.keys(rule.props || {}).length > 0) };
  }, transaction);
  const style = (selection, key, value) => writeStyle(selection, (props) => {
    const next = { ...props };
    if (value === "" || value === null || value === undefined || value === false) delete next[key]; else next[key] = value;
    return next;
  }, `style|${selection.path}|${selection.selector}|${key}`);
  const applyProps = (selection, patch) => writeStyle(selection, (props) => {
    const next = { ...props };
    for (const [key, value] of Object.entries(patch)) {
      if (value === "" || value === null || value === undefined || value === false) delete next[key]; else next[key] = value;
    }
    return next;
  }, `style|${selection.path}|${selection.selector}|bulk`);
  const copyStyle = (selection) => setClipboard({ ...styleProps(selection) });
  const pasteStyle = (selection) => { if (clipboard) applyProps(selection, clipboard); };
  const applyToSimilar = (selection, selectors = []) => {
    const props = { ...styleProps(selection) };
    if (!Object.keys(props).length) return;
    change((draft) => {
      const list = [...(draft.visual_styles || [])];
      for (const selector of selectors) {
        const index = list.findIndex((rule) => rule.path === selection.path && rule.selector === selector);
        const base = list[index] || { path: selection.path, selector, kind: selection.kind, props: {} };
        const next = { ...base, props: { ...base.props, ...props } };
        if (index < 0) list.push(next); else list[index] = next;
      }
      return { ...draft, visual_styles: list };
    }, `similar|${selection.path}|${selection.selector}`);
  };
  const move = (selection, direction) => change((draft) => {
    const list = [...(draft.visual_moves || [])];
    const index = list.findIndex((rule) => rule.path === selection.path && rule.selector === selection.selector);
    const same = index >= 0 && list[index].direction === direction;
    if (index >= 0) list.splice(index, 1);
    if (!same) list.push({ path: selection.path, selector: selection.selector, direction });
    return { ...draft, visual_moves: list };
  }, `move|${selection.path}|${selection.selector}`);
  const resetElement = (selection) => change((draft) => {
    const keep = (rule) => !(rule.path === selection.path && rule.selector === selection.selector);
    return {
      ...draft,
      visual_colors: (draft.visual_colors || []).filter(keep),
      visual_texts: (draft.visual_texts || []).filter(keep),
      visual_images: (draft.visual_images || []).filter(keep),
      visual_shapes: (draft.visual_shapes || []).filter(keep),
      visual_styles: (draft.visual_styles || []).filter(keep),
      visual_moves: (draft.visual_moves || []).filter(keep),
    };
  }, `reset|${selection.path}|${selection.selector}`);
  const setGlobal = (key, value) => change((draft) => {
    const next = { ...(draft.visual_global || {}) };
    if (value === "" || value === null || value === undefined) delete next[key]; else next[key] = value;
    return { ...draft, visual_global: next };
  }, `global|${key}`);
  const menuList = (draft) => (Array.isArray(draft.menu_items) && draft.menu_items.length ? draft.menu_items : DEFAULT_NAV).map((item) => ({ ...item }));
  const menuLabel = (to, label) => change((draft) => {
    const items = menuList(draft);
    const index = items.findIndex((item) => item.to === to);
    if (index < 0) items.push({ to, label }); else items[index] = { ...items[index], label: (label || "").slice(0, 80) };
    return { ...draft, menu_items: items };
  }, `menu|${to}`);
  const menuToggle = (to, enabled) => change((draft) => ({ ...draft, menu_items: menuList(draft).map((item) => (item.to === to ? { ...item, enabled } : item)) }), `menu|${to}|state`);
  const undo = () => { group.current = null; setError(""); setMessage(""); setState((current) => current.past.length ? { draft: current.past.at(-1), past: current.past.slice(0, -1) } : current); };
  const reset = () => {
    if (!window.confirm("সব রঙ, লেখা, ছবি, স্টাইল ও আকার ডিফল্টে ফেরাবেন? কার্যকর করতে সংরক্ষণ করতে হবে।")) return;
    change((draft) => ({ ...draft, ...EMPTY_VISUALS, theme_colors: { ...DEFAULT_COLORS }, theme_primary: defaultSettings.theme_primary, theme_accent: defaultSettings.theme_accent, theme_surface: defaultSettings.theme_surface, menu_items: menuList(draft).map(({ color: _color, ...item }) => item) }));
  };
  const save = async () => {
    setBusy(true); setError(""); setMessage(""); group.current = null;
    try { validateDesign({ ...settings, ...state.draft }); const saved = await saveSiteSettings(state.draft); const draft = pick(saved); setState((current) => ({ ...current, draft })); setBaseline(JSON.stringify(draft)); await router.invalidate(); setMessage("পরিবর্তন স্থায়ীভাবে সংরক্ষিত হয়েছে; রিলোডেও থাকবে।"); }
    catch (err) { setError(err.message || "সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।"); }
    finally { setBusy(false); }
  };
  const previewSettings = useMemo(() => ({ ...settings, ...state.draft }), [settings, state.draft]);
  return { ...state, settings: previewSettings, dirty: JSON.stringify(state.draft) !== baseline, busy, error, message, color, text, image, shape, menuLabel, menuToggle, undo, reset, save, styleRule, styleProps, style, applyProps, copyStyle, pasteStyle, applyToSimilar, hasClipboard: Boolean(clipboard), move, resetElement, setGlobal, endEdit: () => { group.current = null; }, set: (key, value) => change((draft) => ({ ...draft, [key]: value }), key), preset: (preset) => change((draft) => ({ ...draft, visual_colors: [], theme_colors: { ...DEFAULT_COLORS, ...preset.colors } })) };
}