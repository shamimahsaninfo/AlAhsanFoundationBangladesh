import VisualColorInput from "@/components/admin/visual/VisualColorInput";
import { StyleSection, StyleSlider } from "@/components/admin/visual/StyleField";

export default function StyleColorFields({ selection, props, set, studio }) {
  const gradient = Boolean(props.background && props.background2);
  return (
    <>
      <StyleSection title="রং">
        <VisualColorInput label="ব্যাকগ্রাউন্ড রঙ" value={props.background || selection.colors.background} changed={Boolean(props.background)} onChange={(value) => set("background", value)} onEnd={studio.endEdit} />
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => { if (gradient) set("background2", null); else set("background2", props.background || selection.colors.background || "#004D40"); }} className={`rounded-full border px-3 py-1.5 text-[11.5px] font-medium ${gradient ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground/75"}`}>
            {gradient ? "গ্রেডিয়েন্ট বন্ধ" : "গ্রেডিয়েন্ট যোগ করুন"}
          </button>
        </div>
        {gradient && (
          <>
            <VisualColorInput label="দ্বিতীয় রঙ" value={props.background2} changed onChange={(value) => set("background2", value)} onEnd={studio.endEdit} />
            <StyleSlider label="গ্রেডিয়েন্টের কোণ" value={props.gradient_angle} fallback={135} min={0} max={360} suffix="°" onChange={(value) => set("gradient_angle", value)} />
          </>
        )}
        <VisualColorInput label="বর্ডারের রঙ" value={props.border_color || selection.colors.border} changed={Boolean(props.border_color)} onChange={(value) => set("border_color", value)} onEnd={studio.endEdit} />
      </StyleSection>
    </>
  );
}