import DesignOptions from "@/components/admin/design/DesignOptions";
import { THEME_PRESETS } from "@/lib/theme-presets";

export default function VisualDesignExtras({ studio }) {
  return (
    <details className="mt-6 rounded-2xl border border-border bg-card p-4">
      <summary className="cursor-pointer text-sm font-semibold text-primary">অতিরিক্ত ডিজাইন: রেডিমেড থিম ও আকার</summary>
      <fieldset disabled={studio.busy} className="mt-4 space-y-4">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">{THEME_PRESETS.map((preset) => <button key={preset.id} type="button" onClick={() => studio.preset(preset)} className="rounded-xl border border-border bg-background p-3 text-left"><span className="text-sm font-semibold">{preset.name}</span><span className="mt-1 block text-xs text-muted-foreground">{preset.description}</span></button>)}</div>
        <DesignOptions form={studio.draft} set={studio.set} />
        <p className="text-xs text-muted-foreground">এগুলোর পরিবর্তনও উপরের ‘সংরক্ষণ করুন’ দিয়ে সংরক্ষণ করুন।</p>
      </fieldset>
    </details>
  );
}