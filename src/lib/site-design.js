// প্রতিটি অংশ আলাদা কার্ডে — অ্যাডমিন থিম পাতায় সহজ বাংলায় রঙ বদলানোর জন্য।
export const COLOR_GROUPS = [
  {
    id: "header",
    title: "উপরের মেনু বার",
    description: "সাইটের সবচেয়ে উপরের মেনু, লোগো এলাকা ও সক্রিয় মেনুর রঙ।",
    fields: [
      ["header-bg", "মেনু বারের ব্যাকগ্রাউন্ড", "#FFFFFF"],
      ["header-text", "মেনুর লেখার রঙ", "#123B34"],
      ["header-active", "সক্রিয় মেনুর রঙ", "#0F5B4C"],
      ["header-topbar-bg", "উপরের পাতলা বার", "#004D40"],
      ["header-topbar-text", "পাতলা বারের লেখা", "#E9F5F1"],
      ["header-border", "মেনুর নিচের রেখা", "#E2DFD9"],
    ],
  },
  {
    id: "banner",
    title: "হিরো ব্যানার",
    description: "হোমপেজের বড় ব্যানার, তার গাঢ় স্তর ও লেখার রঙ।",
    fields: [
      ["banner-overlay-start", "ব্যানারের গাঢ় স্তর (উপরে)", "#06302B"],
      ["banner-overlay-end", "ব্যানারের গাঢ় স্তর (নিচে)", "#031A17"],
      ["banner-title", "ব্যানারের নাম ও স্লোগান", "#FFFFFF"],
      ["banner-subtitle", "ব্যানারের উপশিরোনাম", "#DBE7E2"],
      ["banner-accent", "ব্যানারের ছোট লেখা ও রেখা", "#D4AF37"],
    ],
  },
  {
    id: "donate-button",
    title: "দান করুন বাটন",
    description: "মেনু, কার্ড ও ফর্মে থাকা ‘দান করুন’ বাটনের রঙ।",
    fields: [
      ["donate-btn-bg", "বাটনের রঙ", "#D4AF37"],
      ["donate-btn-text", "বাটনের লেখা", "#0B2B27"],
      ["donate-btn-hover", "মাউস রাখলে বাটনের রঙ", "#C79E2C"],
    ],
  },
  {
    id: "auto-button",
    title: "অটো ডোনেশন বাটন",
    description: "মাসিক বা স্বয়ংক্রিয় অনুদানের বাটনের রঙ।",
    fields: [
      ["auto-btn-bg", "বাটনের রঙ", "#0F5B4C"],
      ["auto-btn-text", "বাটনের লেখা", "#FBFAF8"],
    ],
  },
  {
    id: "member-button",
    title: "সদস্য বাটন",
    description: "‘সদস্য হন’ ও সদস্যপদ সংক্রান্ত বাটনের রঙ।",
    fields: [
      ["member-btn-bg", "বাটনের রঙ", "#FFFFFF"],
      ["member-btn-text", "বাটনের লেখা", "#0B2B27"],
    ],
  },
  {
    id: "surfaces",
    title: "কার্ড ও সেকশন",
    description: "কার্যক্রমের কার্ড, ফর্ম বক্স, সেকশনের হালকা ব্যাকগ্রাউন্ড ও বর্ডার।",
    fields: [
      ["card", "কার্ডের ব্যাকগ্রাউন্ড", "#FFFFFF"],
      ["card-foreground", "কার্ডের লেখা", "#121212"],
      ["secondary", "সেকশনের হালকা ব্যাকগ্রাউন্ড", "#F6F3EA"],
      ["border", "বর্ডার ও রেখা", "#E2DFD9"],
      ["input", "ইনপুটের বর্ডার", "#E2DFD9"],
    ],
  },
  {
    id: "footer",
    title: "ফুটার",
    description: "ওয়েবসাইটের নিচের অংশ, তার লেখা ও লিংকের রঙ।",
    fields: [
      ["footer-bg", "ফুটারের ব্যাকগ্রাউন্ড", "#08211F"],
      ["footer-text", "ফুটারের লেখা", "#F1F5F3"],
      ["footer-accent", "ফুটারের শিরোনাম ও লিংক", "#D4AF37"],
    ],
  },
  {
    id: "text",
    title: "লেখার রঙ",
    description: "শিরোনাম, সাধারণ লেখা ও হালকা লেখার রঙ।",
    fields: [
      ["heading-text", "শিরোনামের লেখা", "#0B2B27"],
      ["foreground", "সাধারণ লেখা", "#121212"],
      ["muted-foreground", "হালকা লেখা", "#5C5C5C"],
    ],
  },
  {
    id: "background",
    title: "ব্যাকগ্রাউন্ড ও ব্যান্ড",
    description: "পুরো পেজের রঙ এবং গাঢ়/হালকা ব্যান্ড ও গ্রেডিয়েন্টের রঙ।",
    fields: [
      ["background", "পেজের ব্যাকগ্রাউন্ড", "#F9F9F9"],
      ["deep-start", "গাঢ় ব্যান্ডের শুরু", "#093A35"],
      ["deep-end", "গাঢ় ব্যান্ডের শেষ", "#09201F"],
      ["deep-glow", "গাঢ় ব্যান্ডের আলো", "#147563"],
      ["cream-end", "হালকা ব্যান্ডের শেষ", "#F5F1E8"],
      ["accent-end", "গোল্ড গ্রেডিয়েন্টের শেষ", "#D98D1B"],
      ["light", "উজ্জ্বল সাদা", "#FFFFFF"],
      ["shade", "ছায়ার রঙ", "#000000"],
    ],
  },
  {
    id: "brand",
    title: "ব্র্যান্ড, বাটন ও লিংক",
    description: "প্রধান রঙ, গোল্ড অ্যাকসেন্ট ও ফোকাস রিং — পুরো সাইটে ব্যবহৃত হয়।",
    fields: [
      ["primary", "প্রধান রঙ", "#004D40"],
      ["primary-foreground", "প্রধান রঙের উপরের লেখা", "#FBFAF8"],
      ["accent", "গোল্ড অ্যাকসেন্ট", "#D4AF37"],
      ["accent-foreground", "গোল্ডের উপরের লেখা", "#0B2B27"],
      ["ring", "ফোকাস রিং", "#004D40"],
    ],
  },
  {
    id: "status",
    title: "স্ট্যাটাস, পপআপ ও চার্ট",
    description: "সতর্কবার্তা, পপআপ এবং হিসাবের চার্টের রঙ।",
    fields: [
      ["destructive", "ত্রুটি / মুছে ফেলার রঙ", "#C62828"],
      ["destructive-foreground", "ত্রুটির লেখা", "#FFFFFF"],
      ["muted", "মিউটেড ব্যাকগ্রাউন্ড", "#F2F0ED"],
      ["popover", "পপআপ ব্যাকগ্রাউন্ড", "#FFFFFF"],
      ["popover-foreground", "পপআপের লেখা", "#121212"],
      ["chart-1", "চার্ট ১", "#004D40"],
      ["chart-2", "চার্ট ২", "#D4AF37"],
      ["chart-3", "চার্ট ৩", "#38758F"],
      ["chart-4", "চার্ট ৪", "#D18C47"],
      ["chart-5", "চার্ট ৫", "#4B9B80"],
    ],
  },
  {
    id: "admin",
    title: "অ্যাডমিন প্যানেল",
    description: "শুধু অ্যাডমিন প্যানেলের সাইডবারের রঙ।",
    fields: [
      ["sidebar-background", "সাইডবার", "#08211F"],
      ["sidebar-foreground", "সাইডবারের লেখা", "#F8F5F0"],
      ["sidebar-primary", "সাইডবারের প্রধান রঙ", "#D4AF37"],
      ["sidebar-primary-foreground", "প্রধান রঙের লেখা", "#00332E"],
      ["sidebar-accent", "সাইডবার অ্যাকসেন্ট", "#14342F"],
      ["sidebar-accent-foreground", "অ্যাকসেন্টের লেখা", "#F8F5F0"],
      ["sidebar-border", "সাইডবার বর্ডার", "#1E3E39"],
      ["sidebar-ring", "সাইডবার রিং", "#D4AF37"],
    ],
  },
];

export const DESIGN_OPTIONS = [
  ["card_radius", "কার্ডের গোলাকার কোণা", 26, 0, 48, "px"],
  ["button_radius", "বাটনের গোলাকার কোণা", 16, 0, 50, "px"],
  ["input_radius", "ইনপুটের গোলাকার কোণা", 16, 0, 32, "px"],
  ["content_width", "সর্বোচ্চ কনটেন্ট প্রস্থ", 1280, 960, 1600, "px"],
  ["section_spacing", "বিভাগের ফাঁকা জায়গা", 100, 50, 160, "%"],
  ["text_scale", "লেখার স্কেল", 100, 85, 125, "%"],
];

export const ALL_TOKENS = COLOR_GROUPS.flatMap((group) => group.fields.map(([token]) => token));

export const DEFAULT_COLORS = Object.fromEntries(
  COLOR_GROUPS.flatMap((group) => group.fields.map(([token, , fallback]) => [token, fallback])),
);

export const colorValue = (form, field) =>
  field[3] ? form[field[3]] ?? field[2] : form.theme_colors?.[field[0]] ?? field[2];

export function validateDesign(values) {
  for (const group of COLOR_GROUPS) for (const field of group.fields) {
    if (!/^#[0-9a-f]{6}$/i.test(colorValue(values, field))) throw new Error(`${field[1]}: ছয় অক্ষরের HEX রঙ দিন।`);
  }
  const css = values.theme_custom_css || "";
  if (css.length > 20000) throw new Error("কাস্টম CSS সর্বোচ্চ ২০,০০০ অক্ষর হতে পারে।");
  if (/@import|url\s*\(|expression\s*\(|<\/?style|\\/i.test(css)) throw new Error("CSS-এ বাহিরের ফাইল, URL বা স্ক্রিপ্ট ব্যবহার করা যাবে না।");
}