import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { deleteLedgerEntry } from "@/lib/ledger-fns";
import { Plus, QrCode, Paperclip, Trash2, Printer } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import LedgerForm from "@/components/admin/LedgerForm";
import { base44 } from "@/api/base44Client";
import { formatTaka, formatDate } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/admin/ledger")({
  head: () => ({ meta: [{ title: "আয়-ব্যয় হিসাব — অ্যাডমিন" }] }),
  component: AdminLedger,
});

function AdminLedger() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const query = filter === "all" ? {} : { entry_type: filter };

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      base44.entities.LedgerEntry.filter(filter === "all" ? {} : { entry_type: filter }, { sort: "-entry_date", limit: 50 }),
      base44.entities.LedgerEntry.aggregate({ groupBy: "entry_type", sum: ["amount"] }),
    ]).then(([page, summary]) => {
      setItems(page.items || []); setNextCursor(page.next_cursor); setHasMore(page.has_more);
      const income = summary.rows.find((row) => row.entry_type === "income")?.sum_amount || 0;
      const expense = summary.rows.find((row) => row.entry_type === "expense")?.sum_amount || 0;
      setTotals({ income, expense, balance: income - expense });
    }).finally(() => setLoading(false));
  }, [filter]);
  useEffect(load, [load]);
  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const page = await base44.entities.LedgerEntry.filter(query, { sort: "-entry_date", limit: 50, cursor: nextCursor });
      setItems((current) => [...current, ...page.items]); setNextCursor(page.next_cursor); setHasMore(page.has_more);
    } finally { setLoadingMore(false); }
  };
  const visible = items;

  const openAttachment = async (uri) => {
    try {
      const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: uri });
      window.open(signed_url, "_blank", "noopener");
    } catch {
      window.alert("সংযুক্তি খোলা যায়নি।");
    }
  };

  const [removingId, setRemovingId] = useState("");
  const removeEntry = useServerFn(deleteLedgerEntry);

  const remove = async (item) => {
    if (!window.confirm(`"${item.title}" এন্ট্রিটি মুছে ফেলবেন? মোট আয়/ব্যয়ের হিসাবও আপডেট হবে।`)) return;
    setRemovingId(item.id);
    try {
      await removeEntry({ data: { id: item.id } });
      toast.success("এন্ট্রিটি মুছে ফেলা হয়েছে।");
      load();
    } catch (err) {
      toast.error(err?.message || "এন্ট্রি মোছা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setRemovingId("");
    }
  };

  return (
    <div>
      <PageHeader
        title="আয়-ব্যয় হিসাব"
        description="প্রতিটি আয় ও ব্যয় এন্ট্রি করুন — স্বয়ংক্রিয়ভাবে QR যাচাইযোগ্য রসিদ তৈরি হবে এবং ওয়েবসাইটের স্বচ্ছতা পাতায় প্রকাশ পাবে।"
        action={
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> নতুন এন্ট্রি
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">মোট আয়</p>
          <p className="mt-2 font-heading text-[21px] font-semibold text-primary">{formatTaka(totals.income)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">মোট ব্যয়</p>
          <p className="mt-2 font-heading text-[21px] font-semibold text-destructive">{formatTaka(totals.expense)}</p>
        </div>
        <div className="rounded-2xl border border-primary/20 bg-primary p-5 text-primary-foreground">
          <p className="text-[11px] uppercase tracking-[0.16em] opacity-70">বর্তমান তহবিল</p>
          <p className="mt-2 font-heading text-[21px] font-semibold">{formatTaka(totals.balance)}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        {[
          { id: "all", label: "সব" },
          { id: "income", label: "আয়" },
          { id: "expense", label: "ব্যয়" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`rounded-full border px-4 py-2 text-[12.5px] font-medium ${
              filter === t.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-white">
        {loading ? (
          <div className="space-y-2 p-4">
            {[0, 1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-secondary" />)}
          </div>
        ) : visible.length === 0 ? (
          <p className="py-16 text-center text-[13px] text-muted-foreground">কোনো এন্ট্রি নেই।</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[13px]">
              <thead className="bg-secondary/60 text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">তারিখ</th>
                  <th className="px-4 py-3">বিবরণ</th>
                  <th className="px-4 py-3">রসিদ</th>
                  <th className="px-4 py-3 text-right">পরিমাণ</th>
                  <th className="px-4 py-3">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visible.map((e) => (
                  <tr key={e.id} className="hover:bg-secondary/30">
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(e.entry_date || e.created_date)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{e.title}</p>
                      <p className="text-[11px] text-muted-foreground">{e.category || "—"} · {e.method || "cash"}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[11.5px] text-muted-foreground">{e.receipt_no}</td>
                    <td className={`whitespace-nowrap px-4 py-3 text-right font-semibold ${e.entry_type === "income" ? "text-primary" : "text-destructive"}`}>
                      {e.entry_type === "income" ? "+" : "−"} {formatTaka(e.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link to="/verify" search={{ code: e.receipt_no }} className="rounded-lg border border-border p-1.5 text-primary hover:bg-secondary" title="QR যাচাই">
                          <QrCode className="h-3.5 w-3.5" />
                        </Link>
                        {e.attachment_url && (
                          <button onClick={() => openAttachment(e.attachment_url)} className="rounded-lg border border-border p-1.5 text-primary hover:bg-secondary" title="সংযুক্তি">
                            <Paperclip className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <Link to="/receipt/$receiptNo" params={{ receiptNo: e.receipt_no }} target="_blank" className="rounded-lg border border-border p-1.5 text-primary hover:bg-secondary" title="রসিদ দেখুন / প্রিন্ট">
                          <Printer className="h-3.5 w-3.5" />
                        </Link>
                        <button onClick={() => remove(e)} disabled={removingId === e.id} className="rounded-lg border border-border p-1.5 text-destructive hover:bg-destructive/10 disabled:opacity-40" title="মুছুন">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {hasMore && <button type="button" onClick={loadMore} disabled={loadingMore} className="mt-4 rounded-xl border border-border bg-card px-5 py-3 text-sm text-primary disabled:opacity-50">{loadingMore ? "লোড হচ্ছে…" : "আরও দেখুন"}</button>}
      <LedgerForm open={open} onOpenChange={setOpen} onSaved={(result) => {
        load();
        if (result.foundation_emailed) toast.success(`রসিদ ${result.receipt_no} তৈরি ও অফিসিয়াল ইমেইলে পাঠানো হয়েছে।`);
        else toast.warning(`রসিদ ${result.receipt_no} সংরক্ষিত হয়েছে, কিন্তু অফিসিয়াল ইমেইলে পাঠানো যায়নি। রসিদ তালিকা থেকে খুলতে পারবেন।`);
      }} />
    </div>
  );
}