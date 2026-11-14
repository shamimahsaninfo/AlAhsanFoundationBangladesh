import ProjectCard from "@/components/home/ProjectCard";

export default function ProjectsSection({ settings, projects = [], loading = false }) {
  if (settings?.projects_enabled === false) return null;
  if (!loading && !projects.length) return null;

  return (
    <section data-color-key="home-projects" data-color-label="আমাদের প্রকল্প" className="bg-background py-12 sm:py-16">
      <div className="shell">
        <div className="text-center">
          <span className="eyebrow">চলমান কাজ</span>
          <h2 className="text-heading mt-2 font-heading text-[23px] font-bold sm:text-[30px]">
            {settings?.projects_title || "আমাদের প্রকল্প"}
          </h2>
          {settings?.projects_subtitle && (
            <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">{settings.projects_subtitle}</p>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? [0, 1, 2].map((i) => <div key={i} className="h-80 animate-pulse rounded-[22px] border border-border bg-secondary" />)
            : projects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </div>
    </section>
  );
}