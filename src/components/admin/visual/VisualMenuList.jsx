import { Eye, EyeOff } from "lucide-react";
import { DEFAULT_NAV } from "@/lib/nav";

export default function VisualMenuList({ studio }) {
  const items = studio.draft.menu_items?.length ? studio.draft.menu_items : DEFAULT_NAV;
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3">
      <p className="text-xs font-semibold text-foreground">মেনুর সব আইটেম</p>
      <div className="mt-2 space-y-1.5">
        {items.map((item) => (
          <div key={item.to} className="flex items-center gap-1.5">
            <input
              value={item.label || ""}
              maxLength={80}
              onChange={(event) => studio.menuLabel(item.to, event.target.value)}
              onBlur={studio.endEdit}
              aria-label={`${item.to} মেনুর লেখা`}
              className="min-w-0 flex-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[12.5px] text-foreground outline-none focus:border-primary"
            />
            <button
              type="button"
              aria-pressed={item.enabled === false}
              title={item.enabled === false ? "আবার দেখান" : "মেনু থেকে লুকান"}
              onClick={() => studio.menuToggle(item.to, item.enabled === false)}
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${item.enabled === false ? "border-destructive/40 text-destructive" : "border-border text-muted-foreground"}`}
            >
              {item.enabled === false ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-[10px] text-muted-foreground">লেখা বদলালেই প্রিভিউতে দেখা যাবে; চোখের চিহ্নে মেনু লুকানো বা ফিরিয়ে আনা যায়।</p>
    </div>
  );
}