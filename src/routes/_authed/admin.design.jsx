import { createFileRoute } from "@tanstack/react-router";
import PageHeader from "@/components/admin/PageHeader";
import VisualColorEditor from "@/components/admin/visual/VisualColorEditor";
import VisualDesignExtras from "@/components/admin/visual/VisualDesignExtras";
import useVisualColorStudio from "@/hooks/useVisualColorStudio";

export const Route = createFileRoute("/_authed/admin/design")({
  head: () => ({ meta: [{ title: "ভিজ্যুয়াল রঙ এডিটর — অ্যাডমিন" }] }),
  component: ThemePage,
});

function ThemePage() {
  const studio = useVisualColorStudio();
  return <div className="min-w-0 pb-6">
    <PageHeader title="ভিজ্যুয়াল ডিজাইন এডিটর" description="প্রিভিউতে যেকোনো এলিমেন্টে ট্যাপ করলে নিচ থেকে ডিজাইন প্যানেল খুলবে — কোণা, রং, লেখা, ফন্ট, ছবি, বর্ডার, ছায়া, আকার ও ক্রম বদলান। সংরক্ষণ করলে মূল সাইটেও স্থায়ীভাবে কার্যকর হবে।" />
    <VisualColorEditor studio={studio} />
    <VisualDesignExtras studio={studio} />
  </div>;
}