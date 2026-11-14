import { createFileRoute } from "@tanstack/react-router";
import SiteShell from "@/components/site/SiteShell";
import { useSettings } from "@/components/site/SettingsContext";
import HeroBanner from "@/components/home/HeroBanner";
import OverviewCarousel from "@/components/home/OverviewCarousel";
import ProjectsSection from "@/components/home/ProjectsSection";
import AboutMission from "@/components/home/AboutMission";
import AutoDonationBanner from "@/components/home/AutoDonationBanner";
import FeaturedVideo from "@/components/home/FeaturedVideo";
import QuickDonateHome from "@/components/home/QuickDonateHome";
import FundsSummary from "@/components/home/FundsSummary";
import TransparencySection from "@/components/home/TransparencySection";
import DuaShare from "@/components/home/DuaShare";
import FaqAccordion from "@/components/home/FaqAccordion";
import ContactSection from "@/components/home/ContactSection";
import StatsStrip from "@/components/home/StatsStrip";
import { useActivities } from "@/hooks/useActivities";
import { useProjects } from "@/hooks/useProjects";
import { usePublicStats } from "@/hooks/usePublicStats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "আল আহসান ফাউন্ডেশন বাংলাদেশ — মানবতার সেবায়, স্বচ্ছতার প্রতিশ্রুতিতে" },
      {
        name: "description",
        content:
          "শিক্ষা, খাদ্য, চিকিৎসা ও বিশুদ্ধ পানি — আল আহসান ফাউন্ডেশন বাংলাদেশের কার্যক্রমে অনুদান দিন, যাচাইযোগ্য ই-রসিদ পান।",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteShell>
      <HomeContent />
    </SiteShell>
  );
}

function HomeContent() {
  const settings = useSettings();
  const { activities } = useActivities({ featured: true, limit: 8 });
  const { projects, loading: projectsLoading } = useProjects();
  const { stats } = usePublicStats();
  const funds = activities.length ? activities : [];

  return (
    <>
      <HeroBanner settings={settings} />
      <OverviewCarousel settings={settings} />
      <ProjectsSection settings={settings} projects={projects} loading={projectsLoading} />
      <AboutMission settings={settings} />
      <AutoDonationBanner settings={settings} />
      <FeaturedVideo settings={settings} />
      <QuickDonateHome settings={settings} activities={funds} />
      <FundsSummary activities={funds} settings={settings} />
      <StatsStrip stats={stats} />
      <TransparencySection income={stats.income} expense={stats.expense} />
      <div className="band-canvas border-t border-border/60">
        <DuaShare settings={settings} />
        <FaqAccordion settings={settings} />
        <ContactSection settings={settings} />
      </div>
    </>
  );
}