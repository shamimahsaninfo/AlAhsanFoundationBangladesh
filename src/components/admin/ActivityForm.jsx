import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Loader2, ImagePlus } from "lucide-react";

const EMPTY = {
  title: "",
  category: "",
  location: "",
  event_date: "",
  summary: "",
  description: "",
  image_url: "",
  gallery: [],
  video_url: "",
  target_amount: 0,
  status: "active",
  is_featured: true,
  is_published: true,
};

export default function ActivityForm({ open, onOpenChange, activity, onSaved }) {
  const [form, setForm] = useState(activity || EMPTY);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const upload = async (files, multiple = false) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls = [];
      for (const file of Array.from(files)) {
        const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
        urls.push(file_url);
      }
      if (multiple) set("gallery", [...(form.gallery || []), ...urls]);
      else set("image_url", urls[0]);
    } catch {
      setError("ছবি আপলোড করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("কার্যক্রমের নাম লিখুন।");
    setBusy(true);
    try {
      const payload = {
        ...form,
        target_amount: Number(form.target_amount) || 0,
        gallery: Array.isArray(form.gallery) ? form.gallery.filter(Boolean) : [],
      };
      delete payload.id;
      delete payload.created_date;
      delete payload.updated_date;
      delete payload.created_by_id;
      if (activity?.id) await base44.entities.Activity.update(activity.id, payload);
      else await base44.entities.Activity.create(payload);
      onSaved?.();
      onOpenChange(false);
    } catch {
      setError("সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{activity?.id ? "কার্যক্রম সম্পাদনা" : "নতুন কার্যক্রম যোগ করুন"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="শিরোনাম *" value={form.title} onChange={(v) => set("title", v)} required />
            <Field label="ক্যাটাগরি" value={form.category} onChange={(v) => set("category", v)} placeholder="খাদ্য সহায়তা / শিক্ষা…" />
            <Field label="স্থান" value={form.location} onChange={(v) => set("location", v)} />
            <Field label="তারিখ" type="date" value={form.event_date} onChange={(v) => set("event_date", v)} />
            <Field label="লক্ষ্য পরিমাণ (৳)" type="number" value={form.target_amount} onChange={(v) => set("target_amount", v)} />
            <div>
              <label className="text-[12px] font-medium text-foreground/70">স্ট্যাটাস</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-[13.5px] outline-none focus:border-primary"
              >
                <option value="active">চলমান</option>
                <option value="upcoming">আসন্ন</option>
                <option value="completed">সম্পন্ন</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-foreground/70">সংক্ষিপ্ত বিবরণ</label>
            <textarea
              value={form.summary || ""}
              onChange={(e) => set("summary", e.target.value)}
              rows={2}
              className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-[13.5px] outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-[12px] font-medium text-foreground/70">বিস্তারিত বিবরণ</label>
            <textarea
              value={form.description || ""}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-[13.5px] outline-none focus:border-primary"
            />
          </div>

          <div className="rounded-xl border border-dashed border-border p-4">
            <p className="text-[12px] font-medium text-foreground/70">প্রধান ছবি (ওয়েবসাইটে প্রকাশ্যে থাকবে)</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {form.image_url && <img src={form.image_url} alt="" className="h-16 w-24 rounded-lg object-cover" />}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-[12.5px] font-medium text-primary hover:bg-secondary">
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                ছবি আপলোড
                <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files)} />
              </label>
              <input
                value={form.image_url || ""}
                onChange={(e) => set("image_url", e.target.value)}
                placeholder="অথবা ছবির লিংক"
                className="min-w-[200px] flex-1 rounded-lg border border-border px-3 py-2 text-[12.5px] outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-border p-4">
            <p className="text-[12px] font-medium text-foreground/70">গ্যালারি ছবি</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(form.gallery || []).map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt="" className="h-16 w-20 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => set("gallery", form.gallery.filter((_, idx) => idx !== i))}
                    className="absolute -right-1.5 -top-1.5 rounded-full bg-destructive px-1.5 text-[10px] text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
              <label className="inline-flex h-16 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary">
                <ImagePlus className="h-4 w-4" />
                <span className="text-[10px]">যোগ করুন</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files, true)} />
              </label>
            </div>
          </div>

          <Field label="ভিডিও লিংক (YouTube embed)" value={form.video_url || ""} onChange={(v) => set("video_url", v)} />

          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-[12.5px]">
              <input type="checkbox" checked={form.is_published !== false} onChange={(e) => set("is_published", e.target.checked)} className="h-4 w-4 accent-[#004D40]" />
              ওয়েবসাইটে প্রকাশ করুন
            </label>
            <label className="flex items-center gap-2 text-[12.5px]">
              <input type="checkbox" checked={form.is_featured !== false} onChange={(e) => set("is_featured", e.target.checked)} className="h-4 w-4 accent-[#004D40]" />
              হোম পেজে দেখান
            </label>
          </div>

          {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-[12px] text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => onOpenChange(false)} className="rounded-xl border border-border px-4 py-2.5 text-[13px] font-medium">
              বাতিল
            </button>
            <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground disabled:opacity-60">
              {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              সংরক্ষণ করুন
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