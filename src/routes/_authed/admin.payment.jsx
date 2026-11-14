import { createFileRoute } from "@tanstack/react-router";
import PageHeader from "@/components/admin/PageHeader";
import GatewayForm from "@/components/admin/GatewayForm";

export const Route = createFileRoute("/_authed/admin/payment")({
  head: () => ({ meta: [{ title: "পেমেন্ট গেটওয়ে — অ্যাডমিন" }] }),
  component: AdminPayment,
});

function AdminPayment() {
  return (
    <div>
      <PageHeader
        title="পেমেন্ট গেটওয়ে"
        description="আপনার নিজের প্রোভাইডারের বেস URL ও API কি দিয়ে অনলাইন অনুদান চালু করুন। সফল পেমেন্ট সার্ভারে যাচাই হয়, তারপর স্বয়ংক্রিয় রসিদ তৈরি ও ইমেইলে পাঠানো হয়।"
      />
      <GatewayForm />
    </div>
  );
}