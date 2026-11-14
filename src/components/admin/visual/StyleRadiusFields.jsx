import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { StyleSection, StyleSegmented, StyleSlider } from "@/components/admin/visual/StyleField";
import { RADIUS_PRESETS } from "@/lib/visual-style";

const CORNERS = [["radius_tl", "উপরে-বাম"], ["radius_tr", "উপরে-ডান"], ["radius_br", "নিচে-ডান"], ["radius_bl", "নিচে-বাম"]];

export default function StyleRadiusFields({ selection, props, set }) {
  const [separate, setSeparate] = useState(CORNERS.some(([key]) => props[key] !== undefined));
  return (
    <StyleSection title="কোণার ধরন">
      <StyleSegmented label="রেডিমেড কোণা" value={props.radius} fallback={selection.radius} options={RADIUS_PRESETS} onChange={(value) => { set("radius", value); CORNERS.forEach(([key]) => set(key, null)); }} />
      <StyleSlider label="কোণা গোল করার মাত্রা" value={props.radius} fallback={selection.radius} min={0} max={999} suffix="px" onChange={(value) => set("radius", value)} />
      <button type="button" onClick={() => { const next = !separate; setSeparate(next); if (!next) CORNERS.forEach(([key]) => set(key, null)); }} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11.5px] font-medium text-foreground/80">
        <SlidersHorizontal className="h-3.5 w-3.5" />{separate ? "চার কোণা একসাথে" : "প্রতিটি কোণা আলাদা"}
      </button>
      {separate && CORNERS.map(([key, label]) => (
        <StyleSlider key={key} label={label} value={props[key]} fallback={props.radius ?? selection.radius} min={0} max={999} suffix="px" onChange={(value) => set(key, value)} />
      ))}
    </StyleSection>
  );
}