import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const EMPTY = {
  title: "", summary: "", description: "", image_url: "", location: "", category: "",
  target_amount: 0, raised_amount: 0, donor_count: 0, status: "active", is_published: true, sort_order: 0,
};

export default function ProjectForm({ project, onDone, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, ...(project || {}) });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      set("image_url", file_url);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        summary: form.summary || "",
        description: form.description || "",
        image_url: form.image_url || "",
        location: form.location || "",
        category: form.category || "",
        target_amount: Number(form.target_amount || 0),
        raised_amount: Number(form.raised_amount || 0),
        donor_count: Number(form.donor_count || 0),
        status: form.status || "active",
        is_published: form.is_published !== false,
        sort_order: Number(form.sort_order || 0),
      };
      if (project?.id) await base44.entities.Project.update(project.id, payload);
      else await base44.entities.Project.create(payload);
      onDone();
    } catch (err) {
      setError(err?.message || "প্রকল্প সংরক্ষণ করা যায়নি।");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="rounded-2xl border border-primary/30 bg-card p-5">
      <h2 className="font-heading text-[17px] font-semibold text-primary">{project?.id ? "প্রকল্প সম্পাদনা" : "নতুন প্রকল্প"}</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-[12.5px] font-medium">প্রকল্পের নাম
          <input value={form.title} onChange={(event) => set("title", event.target.value)} required maxLength={140} className="input-app mt-1.5 py-2.5 text-[13px]" />
        </label>
        <label className="block text-[12.5px] font-medium">ক্যাটাগরি
          <input value={form.category} onChange={(event) => set("category", event.target.value)} maxLength={60} placeholder="শিক্ষা, খাদ্য, পানি…" className="input-app mt-1.5 py-2.5 text-[13px]" />
        </label>
        <label className="block text-[12.5px] font-medium">কোথায় চলছে (এলাকা)
          <input value={form.location} onChange={(event) => set("location", event.target.value)} maxLength={90} className="input-app mt-1.5 py-2.5 text-[13px]" />
        </label>
        <label className="block text-[12.5px] font-medium">ক্রম (ছোট সংখ্যা আগে)
          <input type="number" value={form.sort_order} onChange={(event) => set("sort_order", event.target.value)} className="input-app mt-1.5 py-2.5 text-[13px]" />
        </label>
        <label className="block text-[12.5px] font-medium">লক্ষ্যমাত্রা (টাকা)
          <input type="number" min="0" value={form.target_amount} onChange={(event) => set("target_amount", event.target.value)} className="input-app mt-1.5 py-2.5 text-[13px]" />
        </label>
        <label className="block text-[12.5px] font-medium">সংগৃহীত (টাকা)
          <input type="number" min="0" value={form.raised_amount} onChange={(event) => set("raised_amount", event.target.value)} className="input-app mt-1.5 py-2.5 text-[13px]" />
        </label>
        <label className="block text-[12.5px] font-medium">অবস্থা
          <select value={form.status} onChange={(event) => set("status", event.target.value)} className="input-app mt-1.5 py-2.5 text-[13px]">
            <option value="active">চলমান</option>
            <option value="paused">সাময়িক বন্ধ</option>
            <option value="completed">সম্পন্ন</option>
          </select>
        </label>
        <label className="block text-[12.5px] font-medium">ওয়েবসাইটে দেখাবে
          <select value={form.is_published === false ? "off" : "on"} onChange={(event) => set("is_published", event.target.value === "on")} className="input-app mt-1.5 py-2.5 text-[13px]">
            <option value="on">চালু</option>
            <option value="off">বন্ধ</option>
          </select>
        </label>
      </div>

      <label className="mt-3 block text-[12.5px] font-medium">সংক্ষিপ্ত বিবরণ
        <textarea value={form.summary} onChange={(event) => set("summary", event.target.value)} rows={2} maxLength={400} className="input-app mt-1.5 py-2.5 text-[13px]" />
      </label>
      <label className="mt-3 block text-[12.5px] font-medium">বিস্তারিত বিবরণ
        <textarea value={form.description} onChange={(event) => set("description", event.target.value)} rows={4} maxLength={4000} className="input-app mt-1.5 py-2.5 text-[13px]" />
      </label>

      <div className="mt-3 flex flex-wrap items-end gap-2">
        <label className="min-w-[200px] flex-1 text-[12.5px] font-medium">ছবির লিংক
          <input value={form.image_url} onChange={(event) => set("image_url", event.target.value)} maxLength={1200} className="input-app mt-1.5 py-2.5 text-[13px]" />
        </label>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2.5 text-[12.5px]">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />} ছবি আপলোড
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={upload} className="hidden" />
      </div>

      {form.image_url && <img src={form.image_url} alt="" className="mt-3 h-28 w-full max-w-xs rounded-xl object-cover" />}
      {error && <p className="mt-3 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-[12.5px] text-destructive">{error}</p>}

      <div className="mt-4 flex items-center gap-2">
        <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} সংরক্ষণ করুন
        </button>
        <button type="button" onClick={onCancel} className="rounded-xl border border-border px-4 py-2.5 text-sm">বাতিল</button>
      </div>
    </form>
  );
}