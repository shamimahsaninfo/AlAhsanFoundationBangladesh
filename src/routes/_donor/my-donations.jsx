import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Heart, HandCoins, Loader2, ReceiptText, ShieldCheck } from "lucide-react";
import ReceiptPdfButton from "@/components/receipt/ReceiptPdfButton";
import { getMyDonations, getMyRecurring } from "@/lib/donor-fns";
import { formatDate, formatTaka } from "@/lib/format";

export const Route = createFileRoute("/_donor/my-donations")({
  head: () => ({ meta: [{ title: "আমার দান — ডোনার ড্যাশবোর্ড" }] }),
  component: MyDonationsPage,
});

const STATUS = {
  verified: { label: "যাচাইকৃত", cls: "bg-primary/10 text-primary" },
  pending: { label: "অপেক্ষমাণ", cls: "bg-accent/20 text-accent-foreground" },
  rejected: { label: "বাতিল", cls: "bg-destructive/10 text-destructive" },
};

const RECURRING = {
  active: { label: "চালু", cls: "bg-primary/10 text-primary" },
  paused: { label: "সাময়িক বন্ধ", cls: "bg-accent/20 text-accent-foreground" },
  cancelled: { label: "বন্ধ", cls: "bg-destructive/10 text-destructive" },
};

function MyDonationsPage() {
  const loadDonations = useServerFn(getMyDonations);
  const loadRecurring = useServerFn(getMyRecurring);
  const [data, setData] = useState({ email: "", donations: [] });
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    Promise.all([loadDonations(), loadRecurring()])
      .then(([donations, plans]) => {
        if (!alive) return;
        setData(donations);
        setRecurring(plans.recurring || []);
      })
      .catch(() => alive && setError("আপনার দানের তথ্য আনতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verified = data.donations.filter((item) => item.status === "verified");
  const total = verified.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="shell py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow">ডোনার ড্যাশবোর্ড</span>
          <h1 className="mt-2 font-heading text-[24px] font-bold text-primary sm:text-[30px]">আমার দান ও রসিদ</h1>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            {data.email ? `${data.email} — এই ইমেইলে করা সব অনুদান এখানে দেখা যাবে।` : "আপনার অনুদানের ইতিহাস এখানে দেখা যাবে।"}
          </p>
        </div>
        <Link to="/donate" className="btn-donate inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[12.5px] font-bold">
          <Heart className="h-3.5 w-3.5" /> নতুন দান করুন
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="card-elev p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">মোট যাচাইকৃত দান</p>
          <p className="mt-1 font-heading text-[20px] font-semibold text-primary">{formatTaka(total)}</p>
        </div>
        <div className="card-elev p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">মোট দান সংখ্যা</p>
          <p className="mt-1 font-heading text-[20px] font-semibold text-primary">{verified.length} টি</p>
        </div>
        <div className="card-elev p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">মাসিক অনুদান</p>
          <p className="mt-1 font-heading text-[20px] font-semibold text-primary">{recurring.filter((r) => r.status === "active").length} টি চালু</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : error ? (
        <p className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive">{error}</p>
      ) : (
        <>
          <section className="mt-8">
            <h2 className="flex items-center gap-2 font-heading text-[17px] font-semibold text-primary">
              <ReceiptText className="h-4 w-4" /> দানের ইতিহাস
            </h2>
            {data.donations.length ? (
              <div className="mt-3 space-y-2.5">
                {data.donations.map((donation) => {
                  const status = STATUS[donation.status] || STATUS.pending;
                  return (
                    <article key={donation.receipt_no} className="card-elev flex flex-wrap items-center justify-between gap-3 p-4">
                      <div className="min-w-0">
                        <p className="font-heading text-[15px] font-semibold text-heading">
                          {formatTaka(donation.amount)}{" "}
                          {donation.is_monthly && <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-foreground/70">মাসিক</span>}
                        </p>
                        <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                          {donation.project_title || donation.activity_title || "সাধারণ তহবিল"} · {formatDate(donation.verified_at || donation.created_date)}
                        </p>
                        <p className="mt-0.5 font-mono text-[10.5px] text-muted-foreground">{donation.receipt_no}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${status.cls}`}>
                          {donation.status === "verified" && <ShieldCheck className="h-3 w-3" />} {status.label}
                        </span>
                        <Link
                          to="/receipt/$receiptNo"
                          params={{ receiptNo: donation.receipt_no }}
                          className="rounded-lg border border-border px-2.5 py-1.5 text-[11.5px] font-medium text-primary hover:bg-secondary"
                        >
                          দেখুন
                        </Link>
                        <ReceiptPdfButton receiptNo={donation.receipt_no} />
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-3 rounded-2xl border border-dashed border-border p-8 text-center">
                <p className="text-[13px] text-muted-foreground">
                  এই ইমেইলে এখনো কোনো অনুদান পাওয়া যায়নি। অনুদান দিলে স্বয়ংক্রিয়ভাবে এখানে যুক্ত হবে।
                </p>
                <Link to="/donate" className="btn-primary-app mx-auto mt-4 max-w-[220px] py-3 text-[13px]">এখনই দান করুন</Link>
              </div>
            )}
          </section>

          {recurring.length > 0 && (
            <section className="mt-8">
              <h2 className="flex items-center gap-2 font-heading text-[17px] font-semibold text-primary">
                <HandCoins className="h-4 w-4" /> মাসিক অটো-দান
              </h2>
              <div className="mt-3 space-y-2.5">
                {recurring.map((plan) => {
                  const status = RECURRING[plan.status] || RECURRING.active;
                  return (
                    <article key={plan.id} className="card-elev flex flex-wrap items-center justify-between gap-3 p-4">
                      <div>
                        <p className="font-heading text-[15px] font-semibold text-heading">{formatTaka(plan.amount)} / মাস</p>
                        <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                          পরবর্তী তারিখ: {plan.next_charge_date || "—"}{plan.project_title ? ` · ${plan.project_title}` : ""}
                        </p>
                      </div>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${status.cls}`}>{status.label}</span>
                    </article>
                  );
                })}
              </div>
              <p className="mt-3 text-[11.5px] text-muted-foreground">
                মাসিক অনুদান বন্ধ বা পরিবর্তন করতে ফাউন্ডেশনের হটলাইনে যোগাযোগ করুন — ০৯৬১১ ৩৯৯৩১৫।
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
}