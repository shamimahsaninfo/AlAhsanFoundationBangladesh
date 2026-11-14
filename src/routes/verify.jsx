import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search, ShieldCheck, ShieldAlert, Loader2, ArrowRight } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import { getReceipt, getCertificate } from "@/lib/server-fns";
import { formatTaka, formatDate } from "@/lib/format";

export const Route = createFileRoute("/verify")({
  validateSearch: (search) => ({ code: search.code ? String(search.code) : undefined }),
  head: () => ({
    meta: [
      { title: "রসিদ ও সার্টিফিকেট যাচাই — আল আহসান ফাউন্ডেশন বাংলাদেশ" },
      { name: "description", content: "রসিদ নম্বর বা সদস্য নম্বর দিয়ে অফিসিয়াল রেকর্ড যাচাই করুন।" },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  return (
    <SiteShell>
      <VerifyContent />
    </SiteShell>
  );
}

function VerifyContent() {
  const { code } = Route.useSearch();
  const receiptLookup = useServerFn(getReceipt);
  const certificateLookup = useServerFn(getCertificate);

  const [value, setValue] = useState(code || "");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const runLookup = async (raw) => {
    const codeValue = (raw || "").trim();
    if (!codeValue) return;
    setBusy(true);
    setSearched(true);
    setResult(null);
    try {
      const receipt = await receiptLookup({ data: { receipt_no: codeValue } });
      if (receipt) {
        setResult({ type: "receipt", data: receipt });
        return;
      }
      const member = await certificateLookup({ data: { membership_no: codeValue } });
      if (member) setResult({ type: "member", data: member });
    } catch {
      setResult(null);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (code) runLookup(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div className="shell py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">যাচাই</p>
        <h1 className="mt-3 font-heading text-[32px] font-semibold leading-tight text-primary sm:text-[40px]">
          রসিদ ও সদস্য সার্টিফিকেট যাচাই
        </h1>
        <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
          রসিদে থাকা QR কোড স্ক্যান করুন, অথবা নিচে রসিদ নম্বর (যেমন AAF-2026-000482) অথবা
          সদস্য নম্বর (AAF-M-00124) লিখুন।
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runLookup(value);
        }}
        className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-border bg-card p-2"
      >
        <Search className="ml-2 h-4 w-4 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="রসিদ বা সদস্য নম্বর লিখুন…"
          className="w-full bg-transparent px-1 py-2.5 text-[14px] outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[13.5px] font-semibold text-primary-foreground disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4 text-accent" />}
          যাচাই
        </button>
      </form>

      {searched && !busy && !result && (
        <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <ShieldAlert className="mx-auto h-7 w-7 text-destructive" />
          <p className="mt-3 font-heading text-[16px] font-semibold text-destructive">কোনো রেকর্ড পাওয়া যায়নি</p>
          <p className="mt-1 text-[13px] text-muted-foreground">নম্বরটি সঠিকভাবে লিখুন অথবা আমাদের হটলাইনে যোগাযোগ করুন।</p>
        </div>
      )}

      {result?.type === "receipt" && (
        <div className="mx-auto mt-8 max-w-xl overflow-hidden rounded-2xl border border-primary/20 bg-card">
          <div className="flex items-center gap-3 bg-primary px-6 py-4 text-primary-foreground">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <div>
              <p className="font-heading text-[15px] font-semibold">{result.data.kind === "ledger" ? "বৈধ হিসাবের রসিদ" : "অনুদানের রেকর্ড"}</p>
              <p className="text-[11.5px] text-white/60">অফিসিয়াল ডেটাবেজে নিশ্চিত করা হয়েছে</p>
            </div>
          </div>
          <dl className="grid gap-y-3 px-6 py-5 text-[13.5px] sm:grid-cols-2">
            <dt className="text-muted-foreground">রসিদ নম্বর</dt>
            <dd className="font-mono font-semibold">{result.data.receipt_no}</dd>
            <dt className="text-muted-foreground">{result.data.kind === "ledger" ? "বিবরণ" : "দাতা"}</dt>
            <dd className="font-medium">{result.data.donor_name}</dd>
            <dt className="text-muted-foreground">পরিমাণ</dt>
            <dd className="font-semibold text-primary">{formatTaka(result.data.amount)}</dd>
            <dt className="text-muted-foreground">প্রকল্প</dt>
            <dd>{result.data.activity_title || "সাধারণ তহবিল"}</dd>
            <dt className="text-muted-foreground">তারিখ</dt>
            <dd>{formatDate(result.data.verified_at || result.data.created_date)}</dd>
            <dt className="text-muted-foreground">স্ট্যাটাস</dt>
            <dd className="font-medium">{result.data.status === "verified" ? "যাচাইকৃত" : "যাচাই অপেক্ষমাণ"}</dd>
          </dl>
          <Link
            to="/receipt/$receiptNo"
            params={{ receiptNo: result.data.receipt_no }}
            className="mx-6 mb-6 flex items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-[13px] font-semibold text-primary"
          >
            সম্পূর্ণ রসিদ দেখুন <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {result?.type === "member" && (
        <div className="mx-auto mt-8 max-w-xl overflow-hidden rounded-2xl border border-primary/20 bg-card">
          <div className="flex items-center gap-3 bg-primary px-6 py-4 text-primary-foreground">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <div>
              <p className="font-heading text-[15px] font-semibold">বৈধ সদস্য সার্টিফিকেট</p>
              <p className="text-[11.5px] text-white/60">অনুমোদিত সদস্য হিসেবে নিশ্চিত</p>
            </div>
          </div>
          <dl className="grid gap-y-3 px-6 py-5 text-[13.5px] sm:grid-cols-2">
            <dt className="text-muted-foreground">সদস্য নম্বর</dt>
            <dd className="font-mono font-semibold">{result.data.membership_no}</dd>
            <dt className="text-muted-foreground">নাম</dt>
            <dd className="font-medium">{result.data.full_name}</dd>
            <dt className="text-muted-foreground">ধরন</dt>
            <dd>{result.data.membership_type === "life" ? "আজীবন" : result.data.membership_type === "volunteer" ? "স্বেচ্ছাসেবী" : "সাধারণ"}</dd>
            <dt className="text-muted-foreground">অনুমোদনের তারিখ</dt>
            <dd>{formatDate(result.data.approved_at)}</dd>
          </dl>
          <Link
            to="/certificate/$membershipNo"
            params={{ membershipNo: result.data.membership_no }}
            className="mx-6 mb-6 flex items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-[13px] font-semibold text-primary"
          >
            সার্টিফিকেট দেখুন <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}