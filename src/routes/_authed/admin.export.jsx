import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Github, Loader2, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

export const Route = createFileRoute("/_authed/admin/export")({
  head: () => ({ meta: [{ title: "প্রজেক্ট জিপ / GitHub — অ্যাডমিন" }] }),
  component: AdminExport,
});

const STEPS = [
  "নিচের বাটনে চাপ দিয়ে প্রজেক্টের জিপ ফাইল ডাউনলোড করুন।",
  "ডাউনলোড হওয়া জিপ ফাইলটি আনজিপ (Extract) করুন।",
  "github.com এ গিয়ে নতুন একটি Repository তৈরি করুন।",
  "Repository-তে \"uploading an existing file\" বাটনে চাপ দিয়ে আনজিপ করা ফোল্ডারের ভেতরের সব ফাইল ও ফোল্ডার আপলোড করুন, তারপর Commit করুন।",
  "লাইভ লিংক পেতে GitHub Pages নয়, বরং Vercel, Netlify বা Cloudflare Pages-এ ওই Repository যুক্ত (Import) করুন।",
];

function AdminExport() {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const download = async () => {
    setBusy(true);
    setError("");
    setResult(null);
    setProgress(0);
    try {
      const { downloadProjectZip } = await import("@/lib/zip-export");
      const info = await downloadProjectZip(setProgress);
      setResult(info);
    } catch (e) {
      setError("জিপ তৈরি করা যায়নি। আবার চেষ্টা করুন।");
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="প্রজেক্ট জিপ ডাউনলোড"
        description="প্রজেক্টের সম্পূর্ণ সোর্স কোড জিপ ফাইল হিসেবে নামান এবং GitHub-এর মাধ্যমে লাইভ লিংকে যুক্ত করুন।"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Download className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-heading text-[17px] font-semibold text-primary">জিপ ডাউনলোড</h2>
              <p className="text-[12.5px] text-muted-foreground">একটি ক্লিকেই সব ফাইল একটি জিপে</p>
            </div>
          </div>

          <button
            type="button"
            onClick={download}
            disabled={busy}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {busy ? `তৈরি হচ্ছে… ${progress}%` : "জিপ ফাইল ডাউনলোড করুন"}
          </button>

          {busy && (
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}

          {result && (
            <p className="mt-4 flex items-center gap-2 text-[13px] text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              ডাউনলোড শুরু হয়েছে — {result.count}টি ফাইল, {(result.bytes / 1024 / 1024).toFixed(2)} MB
            </p>
          )}
          {error && <p className="mt-4 text-[13px] text-destructive">{error}</p>}
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Github className="h-5 w-5" />
            </span>
            <h2 className="font-heading text-[17px] font-semibold text-primary">GitHub-এ লাইভ করার ধাপ</h2>
          </div>
          <ol className="mt-5 space-y-3">
            {STEPS.map((step, index) => (
              <li key={index} className="flex gap-3 text-[13.5px] leading-relaxed text-foreground/85">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
