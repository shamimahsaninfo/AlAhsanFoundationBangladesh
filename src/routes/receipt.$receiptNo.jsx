import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import { useSettings } from "@/components/site/SettingsContext";
import ReceiptCard from "@/components/receipt/ReceiptCard";
import { getReceipt } from "@/lib/server-fns";

export const Route = createFileRoute("/receipt/$receiptNo")({
  head: () => ({ meta: [{ title: "অনুদান রসিদ — আল আহসান ফাউন্ডেশন বাংলাদেশ" }] }),
  component: ReceiptPage,
});

function ReceiptPage() {
  return (
    <SiteShell>
      <ReceiptContent />
    </SiteShell>
  );
}

function ReceiptContent() {
  const settings = useSettings();
  const { receiptNo } = Route.useParams();
  const lookup = useServerFn(getReceipt);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lookup({ data: { receipt_no: receiptNo } })
      .then((r) => setReceipt(r))
      .catch(() => setReceipt(null))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiptNo]);

  return (
    <div className="shell py-14">
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : receipt ? (
        <>
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <p className="eyebrow">অফিসিয়াল রসিদ</p>
            <h1 className="mt-2 font-heading text-[26px] font-semibold text-primary">{receipt.kind === "ledger" ? "আয়-ব্যয়ের রসিদ" : "জাযাকাল্লাহু খাইরান"}</h1>
            <p className="mt-2 text-[13.5px] text-muted-foreground">
              এই রসিদটি আমাদের ডেটাবেজে সংরক্ষিত এবং QR কোড দিয়ে যাচাইযোগ্য।
            </p>
          </div>
          <ReceiptCard receipt={receipt} settings={settings} />
          <div className="mx-auto mt-8 max-w-2xl text-center no-print">
            <Link to="/transparency" className="text-[13px] font-medium text-primary underline">
              স্বচ্ছতার লেজারে সব হিসাব দেখুন
            </Link>
          </div>
        </>
      ) : (
        <div className="mx-auto max-w-md rounded-[24px] border border-border bg-card p-10 text-center">
          <h1 className="font-heading text-[20px] font-semibold text-primary">রসিদ পাওয়া যায়নি</h1>
          <p className="mt-2 text-[13.5px] text-muted-foreground">
            রসিদ নম্বরটি সঠিক কিনা যাচাই করুন অথবা আমাদের হটলাইনে যোগাযোগ করুন:{" "}
            <a href={`tel:${settings.hotline}`} className="font-semibold text-primary">{settings.hotline}</a>
          </p>
          <Link to="/verify" className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground">
            রসিদ যাচাই করুন
          </Link>
        </div>
      )}
    </div>
  );
}