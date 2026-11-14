import { createFileRoute, Link } from "@tanstack/react-router";
import PageHeader from "@/components/admin/PageHeader";
import SettingsForm from "@/components/admin/SettingsForm";

export const Route = createFileRoute("/_authed/admin/settings")({
  head: () => ({ meta: [{ title: "সাইট সেটিংস — অ্যাডমিন" }] }),
  component: AdminSettings,
});

function AdminSettings() {
  return (
    <div>
      <PageHeader
        title="সাইট সেটিংস"
        description="ওয়েবসাইটের সব তথ্য, থিমের রঙ, মেনু ও রসিদের টেক্সট এখান থেকেই পরিবর্তন করুন — কোড এডিট করার প্রয়োজন নেই।"
      />
      <Link to="/admin/design" className="mb-5 block rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 font-semibold text-primary">বিস্তারিত রঙ, আকার, কাস্টম CSS ও হোমপেজের লেখা পরিবর্তন করতে ডিজাইন স্টুডিও খুলুন</Link>
      <SettingsForm />
    </div>
  );
}