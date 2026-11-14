import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import ProjectForm from "@/components/admin/ProjectForm";
import { base44 } from "@/api/base44Client";
import { formatTaka, percent } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/admin/projects")({
  head: () => ({ meta: [{ title: "প্রকল্প — অ্যাডমিন" }] }),
  component: AdminProjects,
});

const STATUS_LABEL = { active: "চলমান", paused: "সাময়িক বন্ধ", completed: "সম্পন্ন" };

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const load = () => {
    setLoading(true);
    base44.entities.Project.list({ sort: "sort_order", limit: 100 })
      .then((page) => setProjects(page.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const togglePublished = async (project) => {
    await base44.entities.Project.update(project.id, { is_published: project.is_published === false });
    load();
  };

  const remove = async (project) => {
    if (!window.confirm(`“${project.title}” প্রকল্পটি স্থায়ীভাবে মুছে ফেলবেন?`)) return;
    await base44.entities.Project.delete(project.id);
    toast.success("প্রকল্প মুছে ফেলা হয়েছে।");
    load();
  };

  return (
    <div>
      <PageHeader
        title="আমাদের প্রকল্প"
        description="হোমপেজের ‘আমাদের প্রকল্প’ সেকশনে যেসব প্রকল্প দেখা যাবে সেগুলো এখান থেকে যোগ, সম্পাদনা ও চালু/বন্ধ করুন। প্রতিটি প্রকল্পের ‘দান করুন’ বাটন পেমেন্ট গেটওয়েতে নিয়ে যাবে।"
        action={
          <button
            onClick={() => { setEditing(null); setOpen(true); }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> নতুন প্রকল্প
          </button>
        }
      />

      {open && (
        <div className="mb-5">
          <ProjectForm
            project={editing}
            onCancel={() => setOpen(false)}
            onDone={() => { setOpen(false); load(); toast.success("প্রকল্প সংরক্ষিত হয়েছে।"); }}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-[13px] text-muted-foreground">
          এখনো কোনো প্রকল্প নেই। উপরে ‘নতুন প্রকল্প’ চাপ দিয়ে শুরু করুন।
        </div>
      ) : (
        <div className="space-y-2.5">
          {projects.map((project) => (
            <article key={project.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-white p-4">
              <img src={project.image_url} alt="" className="h-16 w-24 shrink-0 rounded-xl bg-secondary object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-heading text-[15px] font-semibold text-primary">{project.title}</p>
                <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                  {STATUS_LABEL[project.status]} · {project.location || "—"} · {formatTaka(project.raised_amount)} / {formatTaka(project.target_amount)} ({percent(project.raised_amount, project.target_amount)}%)
                </p>
                <p className="mt-1 text-[10.5px] text-muted-foreground">
                  ক্রম {project.sort_order ?? 0} · {project.is_published === false ? "ওয়েবসাইটে বন্ধ" : "ওয়েবসাইটে দৃশ্যমান"}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => togglePublished(project)} className="rounded-lg border border-border px-2.5 py-1.5 text-[11.5px]">
                  {project.is_published === false ? "চালু করুন" : "বন্ধ করুন"}
                </button>
                <button
                  onClick={() => { setEditing(project); setOpen(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="rounded-lg border border-border p-2 text-primary"
                  title="সম্পাদনা"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => remove(project)} className="rounded-lg border border-border p-2 text-destructive" title="মুছুন">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}