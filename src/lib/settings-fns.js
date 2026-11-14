import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { COLOR_GROUPS, validateDesign } from "@/lib/site-design";
import { defaultSettings } from "@/data/sampleContent";
import { VISUAL_SELECTOR } from "@/lib/visual-colors";

const STRUCTURED_KEYS = [
  "hero_slides", "hero_slides_enabled", "hero_interval", "hero_effect",
  "carousel_enabled", "carousel_interval", "mission_items", "faqs", "footer_links",
  "overview_enabled", "overview_interval", "overview_media", "projects_enabled",
];

const strings = Object.fromEntries(
  Object.keys(defaultSettings)
    .filter((key) => !STRUCTURED_KEYS.includes(key))
    .map((key) => [key, z.string().max(5000).optional()]),
);

const colorFields = Object.fromEntries(COLOR_GROUPS.flatMap((group) => group.fields.map(([key]) => [key, z.string().regex(/^#[0-9a-f]{6}$/i).optional()])));
const options = z.object({ card_radius: z.number().min(0).max(48).nullish(), button_radius: z.number().min(0).max(50).nullish(), input_radius: z.number().min(0).max(32).nullish(), content_width: z.number().min(960).max(1600).nullish(), section_spacing: z.number().min(50).max(160).nullish(), text_scale: z.number().min(85).max(125).nullish(), motion_enabled: z.boolean().nullish() }).strict();

const input = z.object({
  ...strings,
  hero_slides: z.array(z.object({
    image_url: z.string().max(1200),
    title: z.string().max(200).optional().default(""),
    subtitle: z.string().max(400).optional().default(""),
    enabled: z.boolean().optional().default(true),
  })).max(12).optional(),
  hero_slides_enabled: z.boolean().optional(),
  hero_interval: z.number().min(2).max(30).optional(),
  hero_effect: z.enum(["fade", "slide"]).optional(),
  carousel_enabled: z.boolean().optional(),
  carousel_interval: z.number().min(2).max(20).optional(),
  overview_enabled: z.boolean().optional(),
  overview_interval: z.number().min(2).max(30).optional(),
  overview_media: z.array(z.object({
    media_type: z.enum(["image", "video"]).optional().default("image"),
    url: z.string().max(1200),
    title: z.string().max(200).optional().default(""),
    caption: z.string().max(400).optional().default(""),
    enabled: z.boolean().optional().default(true),
  })).max(20).optional(),
  projects_enabled: z.boolean().optional(),
  mission_items: z.array(z.object({ title: z.string().max(200), description: z.string().max(1000).optional().default("") })).max(30).optional(),
  faqs: z.array(z.object({ question: z.string().max(300), answer: z.string().max(2000).optional().default("") })).max(30).optional(),
  footer_links: z.array(z.object({ label: z.string().max(80), to: z.string().max(300) })).max(15).optional(),
  visual_texts: z.array(z.object({
    path: z.string().max(250).regex(/^(?:\*|\/(?!\/)[a-zA-Z0-9_/-]*)$/),
    selector: z.string().max(1200).regex(VISUAL_SELECTOR),
    text: z.string().max(600),
  }).strict()).max(300).optional(),
  visual_images: z.array(z.object({
    path: z.string().max(250).regex(/^(?:\*|\/(?!\/)[a-zA-Z0-9_/-]*)$/),
    selector: z.string().max(1200).regex(VISUAL_SELECTOR),
    url: z.string().max(1200).regex(/^(?:https?:\/\/|\/(?!\/))/),
  }).strict()).max(300).optional(),
  visual_shapes: z.array(z.object({
    path: z.string().max(250).regex(/^(?:\*|\/(?!\/)[a-zA-Z0-9_/-]*)$/),
    selector: z.string().max(1200).regex(VISUAL_SELECTOR),
    radius: z.number().min(0).max(1000),
  }).strict()).max(300).optional(),
  visual_styles: z.array(z.object({
    path: z.string().max(250).regex(/^(?:\*|\/(?!\/)[a-zA-Z0-9_/-]*)$/),
    selector: z.string().max(1200).regex(VISUAL_SELECTOR),
    kind: z.string().max(40).optional(),
    props: z.object({
      color: z.string().max(20).optional(),
      background: z.string().max(20).optional(),
      background2: z.string().max(20).optional(),
      gradient_angle: z.number().optional(),
      border_color: z.string().max(20).optional(),
      border_width: z.number().min(0).max(40).optional(),
      border_style: z.enum(["solid", "dashed", "dotted", "none"]).optional(),
      shadow: z.enum(["none", "sm", "md", "lg"]).optional(),
      radius: z.number().min(0).max(999).optional(),
      radius_tl: z.number().min(0).max(999).optional(),
      radius_tr: z.number().min(0).max(999).optional(),
      radius_br: z.number().min(0).max(999).optional(),
      radius_bl: z.number().min(0).max(999).optional(),
      padding: z.number().min(0).max(400).optional(),
      margin: z.number().min(-200).max(400).optional(),
      width: z.number().min(0).max(2400).optional(),
      height: z.number().min(0).max(2400).optional(),
      opacity: z.number().min(0).max(100).optional(),
      font_family: z.string().max(120).optional(),
      font_size: z.number().min(6).max(160).optional(),
      font_weight: z.number().min(100).max(900).optional(),
      line_height: z.number().min(0.8).max(3).optional(),
      align: z.enum(["left", "center", "right"]).optional(),
      fit: z.enum(["cover", "contain"]).optional(),
      hidden: z.boolean().optional(),
    }).strip().optional(),
  }).strict()).max(400).optional(),
  visual_global: z.object({
    card_radius: z.number().min(0).max(999).nullish(),
    button_radius: z.number().min(0).max(999).nullish(),
    input_radius: z.number().min(0).max(999).nullish(),
    image_radius: z.number().min(0).max(999).nullish(),
    shadow: z.enum(["none", "sm", "md", "lg"]).nullish(),
    font_family: z.string().max(120).nullish(),
  }).strip().optional(),
  visual_moves: z.array(z.object({
    path: z.string().max(250).regex(/^(?:\*|\/(?!\/)[a-zA-Z0-9_/-]*)$/),
    selector: z.string().max(1200).regex(VISUAL_SELECTOR),
    direction: z.enum(["up", "down"]),
  }).strict()).max(200).optional(),
  visual_colors: z.array(z.object({
    path: z.string().max(250).regex(/^(?:\*|\/(?!\/)[a-zA-Z0-9_/-]*)$/),
    selector: z.string().max(1200).regex(VISUAL_SELECTOR),
    text: z.string().regex(/^#[0-9a-f]{6}$/i).nullish(),
    background: z.string().regex(/^#[0-9a-f]{6}$/i).nullish(),
    border: z.string().regex(/^#[0-9a-f]{6}$/i).nullish(),
  }).strict()).max(300).optional(),
  theme_colors: z.object(colorFields).strip().optional(),
  theme_options: options.optional(),
  theme_custom_css: z.string().max(20000).optional(),
  content_text: z.record(z.string().max(80), z.string().max(2000)).refine((v) => Object.keys(v).length <= 500).optional(),
  menu_items: z.array(z.object({ label: z.string().max(80), to: z.string().regex(/^\/(?!\/)/).max(200), color: z.string().regex(/^#[0-9a-f]{6}$/i).optional(), enabled: z.boolean().optional() })).max(30).optional(),
}).strict();

export const loadSiteSettings = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const { readSiteSettings } = await import("@/lib/site-settings.server");
  return readSiteSettings(context.getBase44());
});

export const persistSiteSettings = createServerFn({ method: "POST" }).middleware([requireUser]).validator(input).handler(async ({ data, context }) => {
  if (context.user.role !== "admin") throw new Error("শুধু অ্যাডমিন সেটিংস পরিবর্তন করতে পারেন।");
  const { readSiteSettings } = await import("@/lib/site-settings.server");
  const base44 = context.getBase44();
  const existing = await readSiteSettings(base44);
  if (data.theme_options) data.theme_options = Object.fromEntries(Object.entries(data.theme_options).filter(([, value]) => value != null));
  if (data.visual_global) data.visual_global = Object.fromEntries(Object.entries(data.visual_global).filter(([, value]) => value !== null && value !== undefined && value !== ""));
  if (data.visual_styles) data.visual_styles = data.visual_styles.map((rule) => ({
    path: rule.path,
    selector: rule.selector,
    ...(rule.kind ? { kind: rule.kind } : {}),
    props: Object.fromEntries(Object.entries(rule.props || {}).filter(([, value]) => value !== null && value !== undefined && value !== "" && value !== false)),
  })).filter((rule) => Object.keys(rule.props).length > 0);
  if (data.visual_colors) data.visual_colors = data.visual_colors.map(({ path, selector, text, background, border }) => ({ path, selector, ...Object.fromEntries(Object.entries({ text, background, border }).filter(([, value]) => typeof value === "string" && value)) }));
  validateDesign({ ...existing, ...data });
  const saved = existing.id ? await base44.entities.SiteSettings.update(existing.id, data) : await base44.entities.SiteSettings.create(data);
  return { ...existing, ...data, ...saved };
});