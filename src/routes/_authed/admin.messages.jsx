import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Mail, Phone, Trash2, CheckCheck } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { base44 } from "@/api/base44Client";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_authed/admin/messages")({
  head: () => ({ meta: [{ title: "বার্তা — অ্যাডমিন" }] }),
  component: AdminMessages,
});

function AdminMessages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    base44.entities.ContactMessage
      .list({ sort: "-created_date", limit: 100 })
      .then((page) => setItems(page.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const markRead = async (m) => {
    await base44.entities.ContactMessage.update(m.id, { status: "read" });
    load();
  };

  const remove = async (m) => {
    if (!window.confirm("বার্তাটি মুছে ফেলবেন?")) return;
    await base44.entities.ContactMessage.delete(m.id);
    load();
  };

  return (
    <div>
      <PageHeader title="যোগাযোগের বার্তা" description="ওয়েবসাইটের যোগাযোগ ফর্ম থেকে আসা সব বার্তা এখানে দেখা যাবে।" />

      <div className="space-y-3">
        {loading ? (
          [0, 1].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />)
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white py-16 text-center text-[13px] text-muted-foreground">
            কোনো বার্তা নেই।
          </div>
        ) : (
          items.map((m) => (
            <div key={m.id} className={`rounded-2xl border bg-white p-5 ${m.status === "new" ? "border-primary/30" : "border-border"}`}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-heading text-[15px] font-semibold text-primary">{m.name}</p>
                    {m.status === "new" && (
                      <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-semibold text-accent-foreground">নতুন</span>
                    )}
                    <span className="text-[11px] text-muted-foreground">{formatDateTime(m.created_date)}</span>
                  </div>
                  {m.subject && <p className="mt-1 text-[12.5px] font-medium text-foreground/80">{m.subject}</p>}
                  <p className="mt-2 max-w-3xl whitespace-pre-line text-[13px] leading-relaxed text-foreground/75">{m.message}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-[11.5px] text-muted-foreground">
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 hover:text-primary">
                        <Mail className="h-3.5 w-3.5" /> {m.email}
                      </a>
                    )}
                    {m.phone && (
                      <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1.5 hover:text-primary">
                        <Phone className="h-3.5 w-3.5" /> {m.phone}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  {m.status === "new" && (
                    <button onClick={() => markRead(m)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-[11.5px] font-medium text-primary hover:bg-secondary">
                      <CheckCheck className="h-3.5 w-3.5" /> পঠিত
                    </button>
                  )}
                  <button onClick={() => remove(m)} className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}