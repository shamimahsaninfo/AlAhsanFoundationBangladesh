import { StyleSection, StyleSegmented, StyleSlider } from "@/components/admin/visual/StyleField";
import { BORDER_STYLES, SHADOW_PRESETS } from "@/lib/visual-style";

export default function StyleBorderFields({ props, set }) {
  return (
    <>
      <StyleSection title="বর্ডার">
        <StyleSlider label="বর্ডারের পুরুত্ব" value={props.border_width} fallback={0} min={0} max={16} suffix="px" onChange={(value) => set("border_width", value)} />
        <StyleSegmented label="বর্ডারের ধরন" value={props.border_style} fallback="solid" options={BORDER_STYLES} onChange={(value) => { set("border_style", value); if (value === "none") set("border_width", 0); }} />
      </StyleSection>
      <StyleSection title="ছায়া">
        <StyleSegmented label="ছায়ার গাঢ়ত্ব" value={props.shadow} fallback="" options={SHADOW_PRESETS} onChange={(value) => set("shadow", value)} />
      </StyleSection>
    </>
  );
}