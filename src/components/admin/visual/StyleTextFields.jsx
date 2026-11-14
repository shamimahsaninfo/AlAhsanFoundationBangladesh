import VisualColorInput from "@/components/admin/visual/VisualColorInput";
import VisualTextControl from "@/components/admin/visual/VisualTextControl";
import VisualMenuList from "@/components/admin/visual/VisualMenuList";
import { StyleSection, StyleSelect, StyleSegmented, StyleSlider } from "@/components/admin/visual/StyleField";
import { ALIGN_OPTIONS, FONT_OPTIONS, WEIGHT_OPTIONS } from "@/lib/visual-style";

export default function StyleTextFields({ selection, props, set, studio, textRule }) {
  return (
    <>
      {selection.kind === "menu" && (
        <StyleSection title="মেনুর লেখা ও লিংক">
          <p className="text-[11px] text-muted-foreground">নিচের তালিকা থেকে এই মেনু আইটেমের নাম ও লিংক বদলাতে পারবেন।</p>
        </StyleSection>
      )}
      {selection.kind === "text" && <VisualTextControl selection={selection} studio={studio} rule={textRule} />}
      <StyleSection title="লেখার ধরন">
        <StyleSelect label="ফন্ট" value={props.font_family} options={FONT_OPTIONS} onChange={(value) => set("font_family", value)} />
        <StyleSlider label="লেখার সাইজ" value={props.font_size} fallback={selection.fontSize} min={10} max={96} suffix="px" onChange={(value) => set("font_size", value)} />
        <StyleSegmented label="ওজন (মোটা-পাতলা)" value={props.font_weight} fallback={String(selection.fontWeight)} options={WEIGHT_OPTIONS} onChange={(value) => set("font_weight", Number(value))} />
        <StyleSlider label="লাইনের উচ্চতা" value={props.line_height} fallback={selection.lineHeight} min={0.9} max={2.6} step={0.05} onChange={(value) => set("line_height", value)} />
        <StyleSegmented label="সারিবদ্ধতা" value={props.align} fallback={selection.align} options={ALIGN_OPTIONS} onChange={(value) => set("align", value)} />
        <VisualColorInput label="লেখার রঙ" value={props.color || selection.colors.text} changed={Boolean(props.color)} onChange={(value) => set("color", value)} onEnd={studio.endEdit} />
      </StyleSection>
      {selection.isHeader && <VisualMenuList studio={studio} />}
    </>
  );
}