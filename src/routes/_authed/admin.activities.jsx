import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, MapPin } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import ActivityForm from "@/components/admin/ActivityForm";
import { base44 } from "@/api/base44Client";
import { formatTaka, formatDate, percent } from "@/lib/format";

export const Route = createFileRoute("/_authed/admin/activities")({
  head: () => ({ meta: [{ title: "কার্যক্রম ব্যবস্থাপনা — অ্যাডমিন" }] }),
  component: AdminActivities,
});

function AdminActivities() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    base44.entities.Activity
      .list({ sort: "-created_date", limit: 100 })
      .then((page) => setItems(page.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const remove = async (item) => {
    if (!window.confirm(`"${item.title}" কার্যক্রমটি মুছে ফেলবেন?`)) return;
    await base44.entities.Activity.delete(item.id);
    load();
  };

  const togglePublish = async (item) => {
    await base44.entities.Activity.update(item.id, { is_published: !item.is_published });
    load();
  };

  return (
    <div>
      <PageHeader
        title="কার্যক্রম ব্যবস্থাপনা"
        description="ছবি, ভিডিও ও বিবরণসহ কার্যক্রম প্রকাশ করুন — প্রতিটি কার্যক্রমের নিচে স্বয়ংক্রিয়ভাবে দান করুন বাটন যুক্ত হবে।"
        action={
          <button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> নতুন কার্যক্রম
          </button>
        }
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-48 animate-pulse rounded-2xl bg-white" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
          <p className="font-heading text-[16px] font-semibold text-primary">এখনো কোনো কার্যক্রম নেই</p>
          <p className="mt-1 text-[13px] text-muted-foreground">প্রথম কার্যক্রম যোগ করে ওয়েবসাইটে প্রকাশ করুন।</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-border bg-white">
              <div className="relative h-40">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-secondary text-[12px] text-muted-foreground">ছবি নেই</div>
                )}
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${item.is_published ? "bg-white/90 text-primary" : "bg-destructive text-white"}`}>
                  {item.is_published ? "প্রকাশিত" : "অপ্রকাশিত"}
                </span>
              </div>
              <div className="p-4">
                <p className="line-clamp-1 font-heading text-[15px] font-semibold text-primary">{item.title}</p>
                <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {item.location || "—"} · {formatDate(item.event_date)}
                </p>
                <div className="mt-3">
                  <div className="flex justify-between text-[11.5px]">
                    <span className="font-medium text-primary">{formatTaka(item.raised_amount)}</span>
                    <span className="text-muted-foreground">{percent(item.raised_amount, item.target_amount)}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-primary" style={{ width: `${percent(item.raised_amount, item.target_amount)}%` }} />
                  </div>
                </div>
                <div className="mt-4 flex gap-1.5">
                  <button
                    onClick={() => {
                      setEditing(item);
                      setOpen(true);
                    }}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-[12px] font-medium text-primary hover:bg-secondary"
                  >
                    <Pencil className="h-3.5 w-3.5" /> সম্পাদনা
                  </button>
                  <button
                    onClick={() => togglePublish(item)}
                    className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-primary hover:bg-secondary"
                    title={item.is_published ? "অপ্রকাশিত করুন" : "প্রকাশ করুন"}
                  >
                    {item.is_published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => remove(item)}
                    className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ActivityForm
        key={editing?.id || "new"}
        open={open}
        onOpenChange={setOpen}
        activity={editing}
        onSaved={load}
      />
    </div>
  );
}