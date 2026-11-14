import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Printer, ShieldCheck } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import { useSettings } from "@/components/site/SettingsContext";
import BrandMark from "@/components/site/BrandMark";
import { QrCode } from "@/components/receipt/ReceiptCard";
import { getCertificate } from "@/lib/server-fns";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/certificate/$membershipNo")({
  head: () => ({ meta: [{ title: "সদস্য সার্টিফিকেট — আল আহসান ফাউন্ডেশন বাংলাদেশ" }] }),
  component: CertificatePage,
});

const TYPE_LABEL = { general: "সাধারণ সদস্য", volunteer: "স্বেচ্ছাসেবী সদস্য", life: "আজীবন সদস্য" };

function CertificatePage() {
  return (
    <SiteShell>
      <CertificateContent />
    </SiteShell>
  );
}

function CertificateContent() {
  const settings = useSettings();
  const { membershipNo } = Route.useParams();
  const lookup = useServerFn(getCertificate);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lookup({ data: { membership_no: membershipNo } })
      .then(setMember)
      .catch(() => setMember(null))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membershipNo]);

  if (loading) {
    return <div className="shell flex justify-center py-24"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>;
  }

  if (!member) {
    return (
      <div className="shell py-24 text-center">
        <h1 className="font-heading text-[22px] font-semibold text-primary">সার্টিফিকেট পাওয়া যায়নি</h1>
        <p className="mt-2 text-[13.5px] text-muted-foreground">সদস্য নম্বরটি সঠিক কিনা যাচাই করুন।</p>
        <Link to="/verify" className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground">
          যাচাই করুন
        </Link>
      </div>
    );
  }

  const verifyUrl = typeof window !== "undefined" ? `${window.location.origin}/certificate/${member.membership_no}` : "";

  return (
    <div className="shell py-14">
      <div className="no-print mx-auto mb-6 flex max-w-3xl justify-end">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[13px] font-medium text-primary hover:bg-secondary"
        >
          <Printer className="h-4 w-4" /> প্রিন্ট / PDF ডাউনলোড
        </button>
      </div>

      <div className="mx-auto max-w-3xl rounded-[var(--site-card-radius)] border-2 border-accent/60 bg-card p-2 shadow-lg">
        <div className="rounded-[20px] border border-accent/40 p-8 sm:p-12">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <BrandMark className="h-12 w-12" />
              <div>
                <p className="font-heading text-[17px] font-semibold text-primary">{settings.site_name}</p>
                <p className="text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground">Membership Certificate</p>
              </div>
            </div>
            <div className="rounded-xl border border-dashed border-accent/60 p-2">
              <QrCode value={verifyUrl} size={104} />
            </div>
          </div>

          <p className="mt-10 text-center text-[12px] uppercase tracking-[0.24em] text-muted-foreground">
            সদস্যপদ সার্টিফিকেট
          </p>
          <h1 className="mt-3 text-center font-heading text-[30px] font-semibold text-primary sm:text-[38px]">
            {member.full_name}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-center text-[14px] leading-relaxed text-foreground/75">
            এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, উপরোক্ত ব্যক্তি <strong>{settings.site_name}</strong>-এর একজন
            <strong> {TYPE_LABEL[member.membership_type] || "সদস্য"}</strong> হিসেবে নিবন্ধিত হয়েছেন এবং
            ফাউন্ডেশনের মানবিক কার্যক্রমে সক্রিয় অংশগ্রহণের জন্য অনুমোদিত।
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl bg-secondary/70 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">সদস্য নম্বর</p>
              <p className="mt-1 font-mono text-[13.5px] font-semibold text-primary">{member.membership_no}</p>
            </div>
            <div className="rounded-xl bg-secondary/70 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">অনুমোদনের তারিখ</p>
              <p className="mt-1 text-[13.5px] font-semibold text-primary">{formatDate(member.approved_at)}</p>
            </div>
            <div className="rounded-xl bg-secondary/70 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">জেলা</p>
              <p className="mt-1 text-[13.5px] font-semibold text-primary">{member.district || "—"}</p>
            </div>
          </div>

          <div className="mt-12 flex items-end justify-between gap-6">
            <div className="text-center">
              <div className="h-px w-36 bg-foreground/30" />
              <p className="mt-2 text-[11px] text-muted-foreground">অনুমোদনকারী কর্তৃপক্ষ</p>
            </div>
            <p className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-accent-foreground" /> QR স্ক্যান করে যাচাইযোগ্য
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}