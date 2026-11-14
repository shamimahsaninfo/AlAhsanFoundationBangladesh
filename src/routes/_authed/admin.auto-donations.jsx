import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Mail, Pause, Play, XCircle } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { listRecurringDonations, remindRecurringDonor, setRecurringStatus } from "@/lib/donor-fns";
import { formatTaka } from "@/lib/format";
import { frequencyLabel } from "@/lib/recurring";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/admin/auto-donations")({
  head: () => ({ meta: [{ title: "নিয়মিত অটো-দান — অ্যাডমিন" }] }),
  component: AdminAutoDonations,
});

const STATUS = {
  active: { label: "চালু", cls: "bg-primary/10 text-primary" },
  paused: { label: "সাময়িক বন্ধ", cls: "bg-accent/20 text-accent-foreground" },
  cancelled: { label: "বন্ধ", cls: "bg-destructive/10 text-destructive" },
};

function AdminAutoDonations() {
  const load = useServerFn(listRecurringDonations);
  const changeStatus = useServerFn(setRecurringStatus);
  const remind = useServerFn(remindRecurringDonor);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  const refresh = () => {
    setLoading(true);
    load()
      .then((result) => setItems(result.recurring || []))
      .catch(() => toast.error("তালিকা আনা যায়নি।"))
      .finally(() => setLoading(false));
  };

  useEffect(refresh, []);

  const setStatus = async (record, status) => {
    setBusyId(record.id);
    try {
      await changeStatus({ data: { id: record.id, status } });
      toast.success("অবস্থা পরিবর্তন হয়েছে।");
      refresh();
    } catch (err) {
      toast.error(err?.message || "পরিবর্তন করা যায়নি।");
    } finally {
      setBusyId("");
    }
  };

  const sendReminder = async (record) => {
    setBusyId(record.id);
    try {
      await remind({ data: { id: record.id } });
      toast.success("অনুস্মারক ইমেইল পাঠানো হয়েছে।");
      refresh();
    } catch (err) {
      toast.error(err?.message || "ইমেইল পাঠানো যায়নি।");
    } finally {
      setBusyId("");
    }
  };

  const active = items.filter((item) => item.status === "active");

  return (
    <div>
      <PageHeader
        title="নিয়মিত অটো-দান"
        description="পেমেন্ট গেটওয়ের মাধ্যমে চালু হওয়া দৈনিক, সাপ্তাহিক, পাক্ষিক, মাসিক ও কাস্টম সময়সূচির অনুদান এখানে দেখা যাবে। দাতাকে অনুস্মারক পাঠাতে, সাময়িকভাবে বন্ধ বা স্থায়ীভাবে বন্ধ করতে পারবেন।"
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">চালু আছে</p>
          <p className="mt-1 font-heading text-[20px] font-semibold text-primary">{active.length} টি</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">সক্রিয় প্রতিশ্রুতি</p>
          <p className="mt-1 font-heading text-[20px] font-semibold text-primary">
            {formatTaka(active.reduce((sum, item) => sum + Number(item.amount || 0), 0))}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">মোট রেকর্ড</p>
          <p className="mt-1 font-heading text-[20px] font-semibold text-primary">{items.length} টি</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-[13px] text-muted-foreground">
          এখনো কোনো মাসিক অটো-দান চালু হয়নি। দাতা ‘অটো ডোনেশন’ পাতায় গেটওয়ে দিয়ে চালু করলে এখানে দেখা যাবে।
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((record) => {
            const status = STATUS[record.status] || STATUS.active;
            return (
              <article key={record.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4">
                <div className="min-w-0">
                  <p className="font-heading text-[15px] font-semibold text-primary">
                    {record.donor_name} · {formatTaka(record.amount)}
                    <span className="ml-1.5 rounded-full bg-secondary px-2 py-0.5 text-[10.5px] font-semibold text-primary">
                      {frequencyLabel(record.frequency, record.interval_days)}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                    {record.email || "ইমেইল নেই"} · {record.phone || "মোবাইল নেই"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    পরবর্তী তারিখ: {record.next_charge_date || "—"} {record.project_title ? `· ${record.project_title}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${status.cls}`}>{status.label}</span>
                  <button onClick={() => sendReminder(record)} disabled={busyId === record.id || !record.email} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[11px] disabled:opacity-40">
                    <Mail className="h-3 w-3" /> অনুস্মারক
                  </button>
                  {record.status === "active" ? (
                    <button onClick={() => setStatus(record, "paused")} disabled={busyId === record.id} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[11px] disabled:opacity-40">
                      <Pause className="h-3 w-3" /> বিরতি
                    </button>
                  ) : (
                    <button onClick={() => setStatus(record, "active")} disabled={busyId === record.id} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[11px] disabled:opacity-40">
                      <Play className="h-3 w-3" /> চালু
                    </button>
                  )}
                  <button onClick={() => setStatus(record, "cancelled")} disabled={busyId === record.id} className="inline-flex items-center gap-1 rounded-lg border border-destructive/40 px-2.5 py-1.5 text-[11px] text-destructive disabled:opacity-40">
                    <XCircle className="h-3 w-3" /> বন্ধ
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}