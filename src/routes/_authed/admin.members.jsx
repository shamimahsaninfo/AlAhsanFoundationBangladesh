import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, X, Loader2, IdCard } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { base44 } from "@/api/base44Client";
import { reviewMember } from "@/lib/server-fns";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authed/admin/members")({
  head: () => ({ meta: [{ title: "সদস্য ব্যবস্থাপনা — অ্যাডমিন" }] }),
  component: AdminMembers,
});

const TYPE = { general: "সাধারণ", volunteer: "স্বেচ্ছাসেবী", life: "আজীবন" };
const STATUS_STYLE = {
  pending: "bg-accent/20 text-accent-foreground",
  approved: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
};
const STATUS_LABEL = { pending: "অপেক্ষমাণ", approved: "অনুমোদিত", rejected: "বাতিল" };

function AdminMembers() {
  const review = useServerFn(reviewMember);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const query = filter === "all" ? {} : { status: filter };
    base44.entities.Member
      .filter(query, { sort: "-created_date", limit: 100 })
      .then((page) => setItems(page.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(load, [load]);

  const handle = async (member, status) => {
    setBusyId(member.id);
    try {
      const res = await review({ data: { id: member.id, status } });
      load();
      if (status === "approved" && res?.membership_no) {
        window.alert(`সদস্য অনুমোদিত হয়েছে। সদস্য নম্বর: ${res.membership_no}`);
      }
    } catch {
      window.alert("কাজটি সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setBusyId("");
    }
  };

  return (
    <div>
      <PageHeader
        title="সদস্য ব্যবস্থাপনা"
        description="আবেদন যাচাই করে অনুমোদন দিন — অনুমোদনের সাথে সাথেই সদস্য নম্বর তৈরি হবে এবং QR যাচাইযোগ্য সার্টিফিকেট লিংক ইমেইলে পাঠানোর চেষ্টা করা হবে।"
      />

      <div className="flex flex-wrap gap-2">
        {[
          { id: "pending", label: "অপেক্ষমাণ" },
          { id: "approved", label: "অনুমোদিত" },
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

      <div className="mt-4 space-y-3">
        {loading ? (
          [0, 1, 2].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-white" />)
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white py-16 text-center text-[13px] text-muted-foreground">
            এই তালিকায় কোনো আবেদন নেই।
          </div>
        ) : (
          items.map((m) => (
            <div key={m.id} className="rounded-2xl border border-border bg-white p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-heading text-[15.5px] font-semibold text-primary">{m.full_name}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold ${STATUS_STYLE[m.status]}`}>
                      {STATUS_LABEL[m.status]}
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10.5px] font-medium text-primary">
                      {TYPE[m.membership_type] || "সাধারণ"}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    {m.phone}{m.email ? ` · ${m.email}` : ""} · {m.district || "জেলা নেই"} · {formatDate(m.created_date)}
                  </p>
                  {m.motivation && <p className="mt-2 line-clamp-2 max-w-2xl text-[12px] leading-relaxed text-foreground/70">{m.motivation}</p>}
                  {m.membership_no && (
                    <p className="mt-2 font-mono text-[11.5px] font-semibold text-primary">সদস্য নম্বর: {m.membership_no}</p>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                  {m.status !== "approved" && (
                    <button
                      onClick={() => handle(m, "approved")}
                      disabled={busyId === m.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[11.5px] font-semibold text-primary-foreground disabled:opacity-50"
                    >
                      {busyId === m.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} অনুমোদন
                    </button>
                  )}
                  {m.status !== "rejected" && (
                    <button
                      onClick={() => handle(m, "rejected")}
                      disabled={busyId === m.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-[11.5px] font-medium text-destructive disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" /> বাতিল
                    </button>
                  )}
                  {m.membership_no && (
                    <Link
                      to="/certificate/$membershipNo"
                      params={{ membershipNo: m.membership_no }}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-[11.5px] font-medium text-primary hover:bg-secondary"
                    >
                      <IdCard className="h-3.5 w-3.5" /> সার্টিফিকেট
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}