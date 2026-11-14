import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  HeartHandshake, Wallet, Users, FolderHeart, Clock, ArrowRight, TrendingUp, TrendingDown, MessageSquare,
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import { base44 } from "@/api/base44Client";
import { formatTaka, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authed/admin/")({
  head: () => ({ meta: [{ title: "ড্যাশবোর্ড — অ্যাডমিন প্যানেল" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [
          pendingDonations, donationSum, pendingMembers, activityCount, ledger, newMessages,
          recentDonations, recentLedger,
        ] = await Promise.all([
          base44.entities.Donation.count({ status: "pending" }),
          base44.entities.Donation.aggregate({ query: { status: "verified" }, sum: ["amount"] }),
          base44.entities.Member.count({ status: "pending" }),
          base44.entities.Activity.count({}),
          base44.entities.LedgerEntry.aggregate({ groupBy: "entry_type", sum: ["amount"] }),
          base44.entities.ContactMessage.count({ status: "new" }),
          base44.entities.Donation.list({ sort: "-created_date", limit: 5 }),
          base44.entities.LedgerEntry.list({ sort: "-created_date", limit: 5 }),
        ]);

        const rows = ledger.rows || [];
        setData({
          pendingDonations,
          donationTotal: donationSum.rows?.[0]?.sum_amount || 0,
          pendingMembers,
          activityCount,
          income: rows.find((r) => r.entry_type === "income")?.sum_amount || 0,
          expense: rows.find((r) => r.entry_type === "expense")?.sum_amount || 0,
          newMessages,
          recentDonations: recentDonations.items || [],
          recentLedger: recentLedger.items || [],
        });
      } catch {
        setData(null);
      }
    };
    load();
  }, []);

  if (!data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />)}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="ড্যাশবোর্ড"
        description="ফাউন্ডেশনের অনুদান, খরচ, সদস্য ও কার্যক্রমের সারসংক্ষেপ এক নজরে।"
        action={
          <Link to="/admin/donations" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground">
            অনুদান যাচাই <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={HeartHandshake} label="মোট যাচাইকৃত অনুদান" value={formatTaka(data.donationTotal)} tone="accent" />
        <StatCard icon={Clock} label="যাচাই অপেক্ষমাণ" value={`${data.pendingDonations} টি`} hint="অনুদান যাচাই করুন" tone="warn" />
        <StatCard icon={Users} label="সদস্য আবেদন" value={`${data.pendingMembers} টি`} hint="অনুমোদনের অপেক্ষায়" />
        <StatCard icon={FolderHeart} label="মোট কার্যক্রম" value={`${data.activityCount} টি`} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">মোট আয়</p>
            <TrendingUp className="h-4 w-4 text-primary/60" />
          </div>
          <p className="mt-2 font-heading text-[21px] font-semibold text-primary">{formatTaka(data.income)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">মোট ব্যয়</p>
            <TrendingDown className="h-4 w-4 text-destructive/60" />
          </div>
          <p className="mt-2 font-heading text-[21px] font-semibold text-destructive">{formatTaka(data.expense)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">বর্তমান তহবিল</p>
            <Wallet className="h-4 w-4 text-primary/60" />
          </div>
          <p className="mt-2 font-heading text-[21px] font-semibold text-primary">{formatTaka(data.income - data.expense)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <p className="font-heading text-[14.5px] font-semibold text-primary">সাম্প্রতিক অনুদান</p>
            <Link to="/admin/donations" className="text-[12px] font-medium text-primary hover:underline">সব দেখুন</Link>
          </div>
          {data.recentDonations.length === 0 ? (
            <p className="px-5 py-10 text-center text-[13px] text-muted-foreground">এখনো কোনো অনুদান জমা হয়নি।</p>
          ) : (
            <ul className="divide-y divide-border">
              {data.recentDonations.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-foreground">{d.donor_name}</p>
                    <p className="text-[11.5px] text-muted-foreground">{d.receipt_no} · {formatDate(d.created_date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-semibold text-primary">{formatTaka(d.amount)}</p>
                    <p className="text-[10.5px] uppercase tracking-wide text-muted-foreground">{d.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <p className="font-heading text-[14.5px] font-semibold text-primary">সাম্প্রতিক আয়-ব্যয়</p>
            <Link to="/admin/ledger" className="text-[12px] font-medium text-primary hover:underline">সব দেখুন</Link>
          </div>
          {data.recentLedger.length === 0 ? (
            <p className="px-5 py-10 text-center text-[13px] text-muted-foreground">এখনো কোনো এন্ট্রি নেই।</p>
          ) : (
            <ul className="divide-y divide-border">
              {data.recentLedger.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-foreground">{e.title}</p>
                    <p className="text-[11.5px] text-muted-foreground">{e.receipt_no} · {formatDate(e.entry_date || e.created_date)}</p>
                  </div>
                  <p className={`text-[13px] font-semibold ${e.entry_type === "income" ? "text-primary" : "text-destructive"}`}>
                    {e.entry_type === "income" ? "+" : "−"} {formatTaka(e.amount)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <QuickLink to="/admin/activities" icon={FolderHeart} label="কার্যক্রম প্রকাশ করুন" />
        <QuickLink to="/admin/members" icon={Users} label="সদস্য অনুমোদন" />
        <QuickLink to="/admin/messages" icon={MessageSquare} label={`বার্তা (${data.newMessages} নতুন)`} />
      </div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, label }) {
  return (
    <Link to={to} className="group flex items-center justify-between rounded-2xl border border-border bg-white px-5 py-4 transition-colors hover:border-primary">
      <span className="flex items-center gap-3 text-[13px] font-medium text-primary">
        <Icon className="h-4 w-4" /> {label}
      </span>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </Link>
  );
}