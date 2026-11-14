import { StyleSection, StyleSegmented, StyleSlider } from "@/components/admin/visual/StyleField";

const FIT_OPTIONS = [["cover", "ভরাট (cover)"], ["contain", "পুরো ছবি (contain)"]];

export default function StyleBoxFields({ selection, props, set }) {
  return (
    <>
      <StyleSection title="ফাঁকা জায়গা ও আকার">
        <StyleSlider label="ভেতরের প্যাডিং" value={props.padding} fallback={selection.padding} min={0} max={96} suffix="px" onChange={(value) => set("padding", value)} />
        <StyleSlider label="বাইরের মার্জিন" value={props.margin} fallback={0} min={-40} max={96} suffix="px" onChange={(value) => set("margin", value)} />
        <StyleSlider label="প্রস্থ" value={props.width} fallback={0} min={0} max={1200} suffix="px" onChange={(value) => set("width", value)} />
        <p className="-mt-2 text-[10px] text-muted-foreground">০ মানে স্বাভাবিক প্রস্থ।</p>
        <StyleSlider label="উচ্চতা" value={props.height} fallback={0} min={0} max={1200} suffix="px" onChange={(value) => set("height", value)} />
        <StyleSlider label="স্বচ্ছতা" value={props.opacity} fallback={100} min={10} max={100} suffix="%" onChange={(value) => set("opacity", value)} />
      </StyleSection>
      {selection.kind === "image" && (
        <StyleSection title="ছবির ফিট">
          <StyleSegmented label="ছবি কীভাবে বসবে" value={props.fit} fallback="cover" options={FIT_OPTIONS} onChange={(value) => set("fit", value)} />
        </StyleSection>
      )}
    </>
  );
}