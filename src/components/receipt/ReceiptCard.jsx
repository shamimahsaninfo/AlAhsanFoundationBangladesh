import { useEffect, useState } from "react";
import { Printer, ShieldCheck, Clock, XCircle } from "lucide-react";
import { formatTaka, formatDate } from "@/lib/format";
import BrandMark from "@/components/site/BrandMark";

const STATUS = {
  verified: { label: "যাচাইকৃত", cls: "bg-primary/10 text-primary", Icon: ShieldCheck },
  pending: { label: "যাচাই অপেক্ষমাণ", cls: "bg-accent/20 text-accent-foreground", Icon: Clock },
  rejected: { label: "বাতিল", cls: "bg-destructive/10 text-destructive", Icon: XCircle },
};

const METHOD_LABEL = { bkash: "বিকাশ", nagad: "নগদ", rocket: "রকেট", bank: "ব্যাংক", cash: "নগদ (হাতে)" };

export function QrCode({ value, size = 160 }) {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  if (!origin) return <div style={{ width: size, height: size }} className="rounded-lg bg-secondary" />;
  const target = value?.startsWith("/") ? `${origin}${value}` : value || origin;
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=0&data=${encodeURIComponent(target)}`;
  return <img src={url} width={size} height={size} alt="QR কোড" className="rounded-lg" />;
}

export default function ReceiptCard({ receipt, settings, showPrint = true }) {
  const status = STATUS[receipt.status] || STATUS.pending;
  const ledger = receipt.kind === "ledger";
  const verifyUrl = `/receipt/${receipt.receipt_no}`;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="no-print mb-4 flex justify-end">
        {showPrint && (
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[13px] font-medium text-primary hover:bg-secondary"
          >
            <Printer className="h-4 w-4" /> প্রিন্ট / PDF
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-[var(--site-card-radius)] border border-border bg-card shadow-lg">
        <div className="flex items-start justify-between gap-4 bg-primary px-7 py-6 text-primary-foreground">
          <div className="flex items-center gap-3">
            <BrandMark light src={settings.logo_url} className="h-11 w-11" />
            <div>
              <p className="font-heading text-[15px] font-semibold">{settings.site_name}</p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-accent">{ledger ? (receipt.entry_type === "income" ? "আয়ের রসিদ" : "ব্যয়ের রসিদ") : settings.receipt_title}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">রসিদ নম্বর</p>
            <p className="font-mono text-[13.5px] font-semibold">{receipt.receipt_no}</p>
          </div>
        </div>

        <div className="grid gap-6 px-7 py-6 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{ledger ? "হিসাবের বিবরণ" : "দাতার নাম"}</p>
            <p className="font-heading text-[19px] font-semibold text-foreground">{receipt.donor_name}</p>

            <div className="mt-4 rounded-2xl bg-secondary px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{ledger ? "হিসাবের পরিমাণ" : "অনুদানের পরিমাণ"}</p>
              <p className="font-heading text-[26px] font-semibold text-primary">{formatTaka(receipt.amount)}</p>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-y-3 text-[13px]">
              <dt className="text-muted-foreground">প্রকল্প / খাত</dt>
              <dd className="text-right font-medium">{receipt.project_title || receipt.activity_title || "সাধারণ তহবিল"}</dd>
              <dt className="text-muted-foreground">মাধ্যম</dt>
              <dd className="text-right font-medium">{METHOD_LABEL[receipt.payment_method] || receipt.payment_method}</dd>
              <dt className="text-muted-foreground">তারিখ</dt>
              <dd className="text-right font-medium">{formatDate(receipt.verified_at || receipt.created_date)}</dd>
              <dt className="text-muted-foreground">ধরন</dt>
              <dd className="text-right font-medium">{ledger ? (receipt.entry_type === "income" ? "আয়" : "ব্যয়") : receipt.is_monthly ? "মাসিক অনুদান" : "এককালীন দান"}</dd>
              <dt className="text-muted-foreground">স্ট্যাটাস</dt>
              <dd className="flex justify-end">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${status.cls}`}>
                  <status.Icon className="h-3.5 w-3.5" /> {status.label}
                </span>
              </dd>
            </dl>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border p-4">
            <QrCode value={verifyUrl} size={150} />
            <p className="text-center text-[10.5px] leading-tight text-muted-foreground">
              স্ক্যান করে রসিদ যাচাই করুন
            </p>
          </div>
        </div>

        {receipt.message && (
          <div className="mx-7 mb-5 rounded-xl bg-secondary px-4 py-3 text-[12.5px] text-foreground/75">
            “{receipt.message}”
          </div>
        )}

        <div className="border-t border-border bg-secondary px-7 py-4 text-[11.5px] leading-relaxed text-muted-foreground">
          {settings.receipt_footer}
          <br />
          হটলাইন: {settings.hotline} · ইমেইল: {settings.email}
        </div>
      </div>
    </div>
  );
}