import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Loader2, Paperclip } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { createLedgerEntry } from "@/lib/ledger-fns";

const EMPTY = {
  entry_type: "expense",
  title: "",
  category: "",
  amount: 0,
  entry_date: new Date().toISOString().slice(0, 10),
  method: "cash",
  reference: "",
  attachment_url: "",
  description: "",
};

export default function LedgerForm({ open, onOpenChange, onSaved }) {
  const createEntry = useServerFn(createLedgerEntry);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      set("attachment_url", file_uri);
    } catch {
      setError("ফাইল আপলোড করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("বিবরণ লিখুন।");
    if (!Number(form.amount)) return setError("সঠিক পরিমাণ লিখুন।");
    setBusy(true);
    try {
      const result = await createEntry({ data: { ...form, amount: Number(form.amount) } });
      setForm(EMPTY);
      onSaved?.(result);
      onOpenChange(false);
    } catch {
      setError("সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>নতুন আয় / ব্যয় এন্ট্রি</DialogTitle>
        </DialogHeader>

        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "income", label: "আয় (Income)" },
              { id: "expense", label: "ব্যয় (Expense)" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => set("entry_type", t.id)}
                className={`rounded-xl border py-2.5 text-[13px] font-medium transition-colors ${
                  form.entry_type === t.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground/70"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Field label="বিবরণ *" value={form.title} onChange={(v) => set("title", v)} required placeholder="যেমন: ৬০টি কম্বল ক্রয়" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="খাত" value={form.category} onChange={(v) => set("category", v)} placeholder="শীতবস্ত্র / চিকিৎসা…" />
            <Field label="পরিমাণ (৳) *" type="number" value={form.amount} onChange={(v) => set("amount", v)} required />
            <Field label="তারিখ" type="date" value={form.entry_date} onChange={(v) => set("entry_date", v)} />
            <div>
              <label className="text-[12px] font-medium text-foreground/70">মাধ্যম</label>
              <select
                value={form.method}
                onChange={(e) => set("method", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-[13.5px] outline-none focus:border-primary"
              >
                <option value="cash">নগদ</option>
                <option value="bkash">বিকাশ</option>
                <option value="nagad">নগদ (Nagad)</option>
                <option value="rocket">রকেট</option>
                <option value="bank">ব্যাংক</option>
              </select>
            </div>
          </div>

          <Field label="রেফারেন্স / ভাউচার নম্বর" value={form.reference} onChange={(v) => set("reference", v)} />

          <div>
            <label className="text-[12px] font-medium text-foreground/70">বিবরণ / নোট</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-[13.5px] outline-none focus:border-primary"
            />
          </div>

          <div className="rounded-xl border border-dashed border-border p-4">
            <p className="text-[12px] font-medium text-foreground/70">বিল / ভাউচার সংযুক্তি (গোপনীয়)</p>
            <div className="mt-2 flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-[12.5px] font-medium text-primary hover:bg-secondary">
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                ফাইল আপলোড
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
              </label>
              {form.attachment_url && (
                <span className="inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                  <Paperclip className="h-3.5 w-3.5" /> সংযুক্ত হয়েছে
                </span>
              )}
            </div>
          </div>

          {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-[12px] text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => onOpenChange(false)} className="rounded-xl border border-border px-4 py-2.5 text-[13px] font-medium">
              বাতিল
            </button>
            <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground disabled:opacity-60">
              {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              সংরক্ষণ ও রসিদ তৈরি
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder }) {
  return (
    <div>
      <label className="text-[12px] font-medium text-foreground/70">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-[13.5px] outline-none focus:border-primary"
      />
    </div>
  );
}