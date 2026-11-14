import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, QrCode, TrendingUp, TrendingDown, Wallet, ShieldCheck, Loader2, Download } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import { useSettings } from "@/components/site/SettingsContext";
import { base44 } from "@/api/base44Client";
import { formatTaka, formatDate } from "@/lib/format";

export const Route = createFileRoute("/transparency")({
  head: () => ({
    meta: [
      { title: "স্বচ্ছতার লেজার — আল আহসান ফাউন্ডেশন বাংলাদেশ" },
      { name: "description", content: "প্রতিটি আয় ও ব্যয়ের সম্পূর্ণ হিসাব, রসিদ নম্বর ও QR যাচাইসহ।" },
    ],
  }),
  component: TransparencyPage,
});

function TransparencyPage() {
  return (
    <SiteShell>
      <TransparencyContent />
    </SiteShell>
  );
}

function TransparencyContent() {
  const settings = useSettings();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    base44.entities.LedgerEntry
      .list({ sort: "-entry_date", limit: 200 })
      .then((page) => setEntries(page.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    entries.forEach((e) => {
      if (e.entry_type === "income") income += Number(e.amount || 0);
      else expense += Number(e.amount || 0);
    });
    return { income, expense, balance: income - expense };
  }, [entries]);

  const visible = useMemo(() => {
    return entries.filter((e) => {
      const typeOk = filter === "all" || e.entry_type === filter;
      const q = query.trim().toLowerCase();
      const queryOk =
        !q ||
        (e.title || "").toLowerCase().includes(q) ||
        (e.receipt_no || "").toLowerCase().includes(q) ||
        (e.category || "").toLowerCase().includes(q);
      return typeOk && queryOk;
    });
  }, [entries, filter, query]);

  const cards = [
    { icon: TrendingUp, label: "মোট আয়", value: formatTaka(totals.income) },
    { icon: TrendingDown, label: "মোট ব্যয়", value: formatTaka(totals.expense) },
    { icon: Wallet, label: "বর্তমান তহবিল", value: formatTaka(totals.balance) },
    {
      icon: ShieldCheck,
      label: "তহবিল ব্যবহার",
      value: totals.income ? `${Math.round((totals.expense / totals.income) * 100)}%` : "0%",
    },
  ];

  return (
    <div className="shell py-14">
      <div className="max-w-2xl">
        <p className="eyebrow">স্বচ্ছতার লেজার</p>
        <h1 className="mt-3 font-heading text-[32px] font-semibold leading-tight text-primary sm:text-[42px]">
          প্রতিটি টাকার হিসাব — প্রকাশ্যে
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          অ্যাডমিন প্যানেল থেকে এন্ট্রি করা প্রতিটি আয় ও ব্যয় এখানে প্রকাশিত। যেকোনো রসিদ নম্বর
          লিখে সার্চ করলে সেই রসিদের অফিসিয়াল রেকর্ড দেখতে পাবেন, অথবা QR কোড স্ক্যান করুন।
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5">
            <c.icon className="h-4 w-4 text-accent-foreground" />
            <p className="mt-3 font-heading text-[21px] font-semibold text-primary">{c.value}</p>
            <p className="text-[12px] text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {[
            { id: "all", label: "সব" },
            { id: "income", label: "আয়" },
            { id: "expense", label: "ব্যয়" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`rounded-full border px-4 py-2 text-[12.5px] font-medium transition-colors ${
                filter === t.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground/70 hover:border-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 sm:w-80">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="রসিদ নম্বর বা খাত লিখুন…"
            className="w-full bg-transparent text-[13.5px] outline-none"
          />
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[22px] border border-border bg-card">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : visible.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-heading text-[16px] font-semibold text-primary">কোনো এন্ট্রি পাওয়া যায়নি</p>
            <p className="mt-1 text-[13px] text-muted-foreground">অন্য রসিদ নম্বর বা খাত দিয়ে চেষ্টা করুন।</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-secondary/60 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5">তারিখ</th>
                  <th className="px-5 py-3.5">বিবরণ</th>
                  <th className="px-5 py-3.5">খাত</th>
                  <th className="px-5 py-3.5">রসিদ নম্বর</th>
                  <th className="px-5 py-3.5 text-right">পরিমাণ</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-[13.5px]">
                {visible.map((e) => (
                  <tr key={e.id} className="hover:bg-secondary/40">
                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{formatDate(e.entry_date || e.created_date)}</td>
                    <td className="px-5 py-4 font-medium text-foreground">{e.title}</td>
                    <td className="px-5 py-4 text-muted-foreground">{e.category || "—"}</td>
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-[12px] text-muted-foreground">{e.receipt_no}</td>
                    <td className={`whitespace-nowrap px-5 py-4 text-right font-semibold ${e.entry_type === "income" ? "text-primary" : "text-destructive"}`}>
                      {e.entry_type === "income" ? "+" : "−"} {formatTaka(e.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        to="/verify"
                        search={{ code: e.receipt_no }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[11.5px] text-primary hover:bg-secondary"
                      >
                        <QrCode className="h-3.5 w-3.5" /> যাচাই
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-secondary p-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-heading text-[15.5px] font-semibold text-primary">রসিদ যাচাই করতে চান?</p>
          <p className="mt-1 text-[12.5px] text-muted-foreground">রসিদ নম্বর লিখে অথবা QR স্ক্যান করে যাচাই করুন।</p>
        </div>
        <div className="flex gap-2">
          <Link to="/verify" className="rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground">
            রসিদ যাচাই
          </Link>
          <a
            href={`mailto:${settings.email}?subject=Annual report request`}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-primary"
          >
            <Download className="h-3.5 w-3.5" /> রিপোর্ট চান
          </a>
        </div>
      </div>
    </div>
  );
}