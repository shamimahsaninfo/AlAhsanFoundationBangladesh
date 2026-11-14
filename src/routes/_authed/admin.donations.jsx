import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, X, Loader2, ExternalLink, Mail, Trash2 } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { base44 } from "@/api/base44Client";
import { deleteDonation, reviewDonation } from "@/lib/server-fns";
import { formatTaka, formatDate } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/admin/donations")({
  head: () => ({ meta: [{ title: "অনুদান ব্যবস্থাপনা — অ্যাডমিন" }] }),
  component: AdminDonations,
});

const METHOD = { bkash: "বিকাশ", nagad: "নগদ", rocket: "রকেট", bank: "ব্যাংক", cash: "নগদ" };

const STATUS_STYLE = {
  pending: "bg-accent/20 text-accent-foreground",
  verified: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
};
const STATUS_LABEL = { pending: "অপেক্ষমাণ", verified: "যাচাইকৃত", rejected: "বাতিল" };

function AdminDonations() {
  const review = useServerFn(reviewDonation);
  const removeDonation = useServerFn(deleteDonation);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const query = filter === "all" ? {} : { status: filter };
    base44.entities.Donation
      .filter(query, { sort: "-created_date", limit: 100 })
      .then((page) => setItems(page.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(load, [load]);

  const handle = async (donation, status) => {
    setBusyId(donation.id);
    try {
      const result = await review({ data: { id: donation.id, status } });
      load();
      if (!result.unchanged && (!result.foundation_emailed || (donation.email && !result.emailed))) toast.warning("রসিদ সংরক্ষিত, তবে এক বা একাধিক ইমেইল পাঠানো যায়নি। দাতাকে রসিদের লিংক দিন; অফিসিয়াল ইমেইল ও ডোমেইন সংযোগ পরীক্ষা করুন।");
      else if (!result.unchanged) toast.success("যাচাই সম্পন্ন ও রসিদ ইমেইলে পাঠানো হয়েছে।");
    } catch {
      window.alert("কাজটি সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setBusyId("");
    }
  };

  const remove = async (donation) => {
    if (!window.confirm(`${donation.donor_name} — ${formatTaka(donation.amount)} এর অনুদানটি স্থায়ীভাবে মুছে ফেলবেন?`)) return;
    setBusyId(donation.id);
    try {
      await removeDonation({ data: { id: donation.id } });
      toast.success("অনুদানটি মুছে ফেলা হয়েছে।");
      load();
    } catch (err) {
      toast.error(err?.message || "অনুদান মোছা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setBusyId("");
    }
  };

  return (
    <div>
      <PageHeader
        title="অনুদান যাচাই"
        description="দাতার দেওয়া ট্রানজেকশন আইডি যাচাই করে অনুদান অনুমোদন করুন — অনুমোদনের পর স্বয়ংক্রিয় ই-রসিদ ইমেইলে পাঠানো হয় এবং প্রকল্পের তহবিলে যোগ হয়।"
      />

      <div className="flex flex-wrap gap-2">
        {[
          { id: "pending", label: "অপেক্ষমাণ" },
          { id: "verified", label: "যাচাইকৃত" },
          { id: "rejected", label: "বাতিল" },
          { id: "all", label: "সব" },
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
          <div className="space-y-2 p-4">{[0, 1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-secondary" />)}</div>
        ) : items.length === 0 ? (
          <p className="py-16 text-center text-[13px] text-muted-foreground">এই তালিকায় কোনো অনুদান নেই।</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-[13px]">
              <thead className="bg-secondary/60 text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">দাতা</th>
                  <th className="px-4 py-3">রসিদ</th>
                  <th className="px-4 py-3">মাধ্যম / TrxID</th>
                  <th className="px-4 py-3 text-right">পরিমাণ</th>
                  <th className="px-4 py-3">স্ট্যাটাস</th>
                  <th className="px-4 py-3">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((d) => (
                  <tr key={d.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{d.donor_name}</p>
                      <p className="text-[11px] text-muted-foreground">{d.phone}{d.email ? ` · ${d.email}` : ""}</p>
                      <p className="text-[10.5px] text-muted-foreground">{formatDate(d.created_date)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-mono text-[11.5px] text-foreground">{d.receipt_no}</p>
                      <p className="max-w-[140px] truncate text-[11px] text-muted-foreground">{d.activity_title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[12px]">{METHOD[d.payment_method] || d.payment_method}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">{d.transaction_id}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-primary">{formatTaka(d.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${STATUS_STYLE[d.status]}`}>
                        {STATUS_LABEL[d.status]}
                      </span>
                      {d.is_monthly && <p className="mt-1 text-[10px] text-muted-foreground">মাসিক</p>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {d.status !== "verified" && (
                          <button
                            onClick={() => handle(d, "verified")}
                            disabled={busyId === d.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground disabled:opacity-50"
                          >
                            {busyId === d.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} যাচাই
                          </button>
                        )}
                        {d.status !== "rejected" && (
                          <button
                            onClick={() => handle(d, "rejected")}
                            disabled={busyId === d.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-medium text-destructive disabled:opacity-50"
                          >
                            <X className="h-3 w-3" /> বাতিল
                          </button>
                        )}
                        <Link
                          to="/receipt/$receiptNo"
                          params={{ receiptNo: d.receipt_no }}
                          target="_blank"
                          className="rounded-lg border border-border p-1.5 text-primary hover:bg-secondary"
                          title="রসিদ দেখুন"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => remove(d)}
                          disabled={busyId === d.id}
                          className="rounded-lg border border-border p-1.5 text-destructive hover:bg-destructive/10 disabled:opacity-40"
                          title="মুছুন"
                        >
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

      <p className="mt-4 flex items-start gap-2 text-[11.5px] leading-relaxed text-muted-foreground">
        <Mail className="mt-0.5 h-3.5 w-3.5" />
        ই-রসিদ পাঠানো সম্ভব হয় শুধুমাত্র নিবন্ধিত ইমেইলে অথবা কাস্টম ডোমেইন সংযুক্ত থাকলে অন্য ইমেইলে।
        অন্যথায় রসিদ লিংকটি দাতাকে হোয়াটসঅ্যাপ/এসএমএস-এ পাঠিয়ে দিন।
      </p>
    </div>
  );
}