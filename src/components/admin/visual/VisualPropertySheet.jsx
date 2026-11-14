import { ArrowUp, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import VisualImageControl from "@/components/admin/visual/VisualImageControl";
import VisualMenuControl from "@/components/admin/visual/VisualMenuControl";
import StyleTextFields from "@/components/admin/visual/StyleTextFields";
import StyleRadiusFields from "@/components/admin/visual/StyleRadiusFields";
import StyleColorFields from "@/components/admin/visual/StyleColorFields";
import StyleBorderFields from "@/components/admin/visual/StyleBorderFields";
import StyleBoxFields from "@/components/admin/visual/StyleBoxFields";
import StyleActionFields from "@/components/admin/visual/StyleActionFields";

const TAB_CLASS = "min-h-9 rounded-full px-3 text-[11.5px] font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground";

function firstTab(kind) {
  if (kind === "image") return "image";
  if (kind === "text" || kind === "menu") return "text";
  return "radius";
}

export default function VisualPropertySheet({ selection, studio, onSimilar, onParent, onClear }) {
  const open = Boolean(selection);
  const props = selection ? studio.styleProps(selection) : {};
  const set = (key, value) => studio.style(selection, key, value);
  const textRule = (studio.draft.visual_texts || []).find((rule) => rule.path === selection?.path && rule.selector === selection?.selector);
  const imageRule = (studio.draft.visual_images || []).find((rule) => rule.path === selection?.path && rule.selector === selection?.selector);

  return (
    <Drawer open={open} onOpenChange={(next) => { if (!next) onClear(); }}>
      <DrawerContent className="max-h-[88dvh] border-primary/20">
        {selection && (
          <>
            <DrawerHeader className="px-4 pb-2 pt-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <DrawerTitle className="text-left text-[14px] font-semibold text-primary">
                    {selection.label}
                    <span className="ml-1.5 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{selection.kindLabel}</span>
                  </DrawerTitle>
                  <p className="truncate text-left text-[11px] text-muted-foreground">{selection.caption || "নির্বাচিত অংশ"}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button type="button" onClick={onParent} disabled={!selection.canParent} className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-[10.5px] disabled:opacity-40">
                    <ArrowUp className="h-3 w-3" />বড় অংশ
                  </button>
                  <button type="button" aria-label="প্যানেল বন্ধ করুন" onClick={onClear} className="rounded-lg p-1.5 text-muted-foreground"><X className="h-4 w-4" /></button>
                </div>
              </div>
            </DrawerHeader>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
              <Tabs key={`${selection.path}|${selection.selector}`} defaultValue={firstTab(selection.kind)}>
                <TabsList className="no-scrollbar mb-3 flex h-auto w-full flex-nowrap justify-start gap-1 overflow-x-auto rounded-full bg-secondary p-1">
                  {(selection.kind === "image" || selection.kind === "text" || selection.kind === "menu") && (
                    <TabsTrigger className={TAB_CLASS} value={selection.kind === "image" ? "image" : "text"}>{selection.kind === "image" ? "ছবি" : "লেখা"}</TabsTrigger>
                  )}
                  <TabsTrigger className={TAB_CLASS} value="radius">কোণা</TabsTrigger>
                  <TabsTrigger className={TAB_CLASS} value="color">রং</TabsTrigger>
                  <TabsTrigger className={TAB_CLASS} value="border">বর্ডার</TabsTrigger>
                  <TabsTrigger className={TAB_CLASS} value="box">আকার</TabsTrigger>
                  <TabsTrigger className={TAB_CLASS} value="action">কাজ</TabsTrigger>
                </TabsList>
                {(selection.kind === "text" || selection.kind === "menu") && (
                  <TabsContent value="text" className="space-y-3">
                    {selection.kind === "menu" && <VisualMenuControl selection={selection} studio={studio} />}
                    <StyleTextFields selection={selection} props={props} set={set} studio={studio} textRule={textRule} />
                  </TabsContent>
                )}
                {selection.kind === "image" && (
                  <TabsContent value="image" className="space-y-3">
                    <VisualImageControl selection={selection} studio={studio} rule={imageRule} />
                  </TabsContent>
                )}
                <TabsContent value="radius"><StyleRadiusFields selection={selection} props={props} set={set} /></TabsContent>
                <TabsContent value="color"><StyleColorFields selection={selection} props={props} set={set} studio={studio} /></TabsContent>
                <TabsContent value="border"><StyleBorderFields props={props} set={set} /></TabsContent>
                <TabsContent value="box"><StyleBoxFields selection={selection} props={props} set={set} /></TabsContent>
                <TabsContent value="action"><StyleActionFields selection={selection} studio={studio} onSimilar={onSimilar} props={props} /></TabsContent>
              </Tabs>
              <p className="mt-3 text-[10px] text-muted-foreground">
                {selection.path === "*" ? "এই অংশ সব পেজে একই থাকবে।" : "শুধু এই পেজে কার্যকর হবে।"} মোবাইল ও ডেস্কটপে একই নিয়ম খাটবে।
              </p>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}