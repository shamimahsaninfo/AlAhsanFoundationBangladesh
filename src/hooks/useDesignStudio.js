import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { defaultSettings } from "@/data/sampleContent";
import { saveSiteSettings, useSiteSettings } from "@/hooks/useSiteSettings";
import { DEFAULT_COLORS, validateDesign } from "@/lib/site-design";
import { DEFAULT_NAV } from "@/lib/nav";

export default function useDesignStudio() {
  const { settings } = useSiteSettings();
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const loading = false;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const set = (key, value) => { setMessage(""); setForm((current) => ({ ...current, [key]: value })); };

  const colors = { ...DEFAULT_COLORS, ...(form.theme_colors || {}) };

  const setColor = (token, value) => {
    setMessage("");
    setForm((current) => ({ ...current, theme_colors: { ...DEFAULT_COLORS, ...(current.theme_colors || {}), [token]: value } }));
  };

  const applyPreset = (preset) => {
    setForm((current) => ({ ...current, theme_colors: { ...DEFAULT_COLORS, ...preset.colors } }));
    setMessage(`‘${preset.name}’ থিম প্রিসেট প্রয়োগ হয়েছে — কার্যকর করতে সংরক্ষণ করুন।`);
  };

  const setMenuColor = (index, value) => {
    setForm((current) => {
      const items = [...(current.menu_items?.length ? current.menu_items : DEFAULT_NAV)];
      items[index] = { ...items[index], color: value || undefined };
      return { ...current, menu_items: items };
    });
    setMessage("");
  };

  const reset = () => {
    if (!window.confirm("সব রঙ ডিফল্টে ফিরিয়ে নেবেন? লেখা ও ছবি অপরিবর্তিত থাকবে। সংরক্ষণ না করা পর্যন্ত সাইট বদলাবে না।")) return;
    setForm((current) => ({ ...current, theme_primary: defaultSettings.theme_primary, theme_accent: defaultSettings.theme_accent, theme_surface: defaultSettings.theme_surface, theme_colors: { ...DEFAULT_COLORS }, theme_options: {}, theme_custom_css: "" }));
    setMessage("ডিফল্ট রঙ প্রস্তুত হয়েছে; কার্যকর করতে সংরক্ষণ করুন।");
  };

  const save = async (event) => {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      validateDesign({ ...form, theme_colors: colors });
      const values = {
        theme_primary: form.theme_primary ?? defaultSettings.theme_primary,
        theme_accent: form.theme_accent ?? defaultSettings.theme_accent,
        theme_surface: form.theme_surface ?? defaultSettings.theme_surface,
        theme_colors: colors,
        theme_options: form.theme_options || {},
        theme_custom_css: form.theme_custom_css || "",
        menu_items: (form.menu_items?.length ? form.menu_items : DEFAULT_NAV).map(({ label, to, color }) => ({ label, to, ...(color ? { color } : {}) })),
      };
      const saved = await saveSiteSettings(values);
      setForm(saved);
      await router.invalidate();
      setMessage("রঙ সংরক্ষিত হয়েছে। রিলোডেও এই থিম থাকবে।");
    } catch (err) { setError(err.message || "সংরক্ষণ করা যায়নি।"); }
    finally { setBusy(false); }
  };

  return { form, set, colors, setColor, setMenuColor, applyPreset, loading, busy, error, message, reset, save };
}