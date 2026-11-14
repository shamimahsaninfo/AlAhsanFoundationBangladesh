import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Users } from "lucide-react";
import { Image } from "@/components/ui/image";
import { formatTaka, percent } from "@/lib/format";

const STATUS_LABEL = { active: "চলমান", paused: "সাময়িক বন্ধ", completed: "সম্পন্ন" };

export default function ProjectCard({ project }) {
  const progress = percent(project.raised_amount, project.target_amount);
  return (
    <article data-color-key={`project-${project.id}`} data-color-label="প্রকল্পের কার্ড" className="card-elev flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <Image src={project.image_url} alt={project.title} className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10.5px] font-semibold text-white backdrop-blur">
          {STATUS_LABEL[project.status] || "চলমান"}
        </span>
        {project.category && (
          <span className="absolute right-3 top-3 rounded-full bg-primary/85 px-2.5 py-1 text-[10.5px] font-semibold text-primary-foreground backdrop-blur">
            {project.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-heading text-[15.5px] font-semibold text-heading">{project.title}</h3>
        <p className="mt-1.5 line-clamp-3 text-[12.5px] leading-relaxed text-muted-foreground">
          {project.summary || project.description}
        </p>

        <div className="mt-3 flex items-center justify-between text-[11.5px]">
          <span className="font-semibold text-primary">{formatTaka(project.raised_amount)}</span>
          <span className="text-muted-foreground">লক্ষ্য {formatTaka(project.target_amount)}</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{progress}% পূর্ণ</span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{Number(project.donor_count || 0)} জন</span>
            {project.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{project.location}</span>}
          </span>
        </div>

        <Link
          to="/donate"
          search={{ project: project.id }}
          className="btn-donate mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12.5px] font-bold"
        >
          <Heart className="h-3.5 w-3.5" /> এই প্রকল্পে দান করুন
        </Link>
      </div>
    </article>
  );
}