import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Download, Loader2 } from "lucide-react";
import { getReceiptPdf } from "@/lib/donor-fns";

function saveBase64(base64, filename) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export default function ReceiptPdfButton({ receiptNo, className = "" }) {
  const fetchPdf = useServerFn(getReceiptPdf);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const download = async () => {
    setBusy(true);
    setError("");
    try {
      const result = await fetchPdf({ data: { receipt_no: receiptNo } });
      saveBase64(result.base64, result.filename);
    } catch {
      setError("PDF তৈরি করা যায়নি");
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={download}
        disabled={busy}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[11.5px] font-medium text-primary hover:bg-secondary disabled:opacity-50 ${className}`}
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
        {busy ? "তৈরি হচ্ছে…" : "PDF রসিদ"}
      </button>
      {error && <span className="mt-1 text-[10.5px] text-destructive">{error}</span>}
    </span>
  );
}