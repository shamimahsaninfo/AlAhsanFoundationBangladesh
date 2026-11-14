import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";

const SITE = "আল আহসান ফাউন্ডেশন বাংলাদেশ";
const SITE_URL = "https://al-ahsan-foundation-bangladesh-b0808e7b.base44.app";

async function sendMail(base44, { to, subject, html }) {
  if (!to || !String(to).includes("@")) return false;
  try {
    await base44.integrations.Core.SendEmail({ to, subject, html });
    return true;
  } catch {
    return false;
  }
}

/* ---------------------------------- Donation --------------------------------- */

export const getReceipt = createServerFn({ method: "POST" })
  .validator(z.object({ receipt_no: z.string().min(3).max(40) }))
  .handler(async ({ data, context }) => {
    const admin = context.getBase44().asServiceRole;
    const { lookupReceipt } = await import("@/lib/receipt-record.server");
    return lookupReceipt(admin, data.receipt_no.trim());
  });

export const reviewDonation = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      id: z.string().min(3),
      status: z.enum(["verified", "rejected"]),
      notes: z.string().max(400).optional(),
    })
  )
  .handler(async ({ data, context }) => {
    if (context.user?.role !== "admin") throw new Error("শুধুমাত্র অ্যাডমিন এই কাজ করতে পারেন");
    const admin = context.getBase44().asServiceRole;
    const donation = await admin.entities.Donation.get(data.id);
    if (donation.status === data.status) return { ok: true, unchanged: true };

    const reviewed = await admin.entities.Donation.update(data.id, {
      status: data.status,
      notes: data.notes || "",
      verified_at: new Date().toISOString(),
    });

    if (data.status === "verified") {
      const { applyDonationEffects } = await import("@/lib/donation-settle.server");
      await applyDonationEffects(admin, { ...donation, ...reviewed }).catch(() => null);
    }

    const { notifyReceipt } = await import("@/lib/receipt-mail.server");
    const delivery = await notifyReceipt(admin, { ...donation, ...reviewed }).catch(() => ({ foundation_emailed: false, emailed: false }));
    return { ok: true, ...delivery };
  });

export const deleteDonation = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ id: z.string().min(3) }))
  .handler(async ({ data, context }) => {
    if (context.user?.role !== "admin") throw new Error("শুধুমাত্র অ্যাডমিন এই কাজ করতে পারেন");
    const admin = context.getBase44().asServiceRole;
    const donation = await admin.entities.Donation.get(data.id).catch(() => null);
    if (!donation) return { ok: true };

    if (donation.status === "verified") {
      const { reverseDonationEffects } = await import("@/lib/donation-settle.server");
      await reverseDonationEffects(admin, donation).catch(() => null);
    }

    await admin.entities.Donation.delete(data.id);
    return { ok: true };
  });

/* --------------------------------- Membership -------------------------------- */

export const submitMembership = createServerFn({ method: "POST" })
  .validator(
    z.object({
      full_name: z.string().min(2).max(90),
      email: z.string().max(120).optional().or(z.literal("")),
      phone: z.string().min(6).max(24),
      address: z.string().max(300).optional().or(z.literal("")),
      district: z.string().max(60).optional().or(z.literal("")),
      occupation: z.string().max(90).optional().or(z.literal("")),
      dob: z.string().max(20).optional().or(z.literal("")),
      motivation: z.string().max(800).optional().or(z.literal("")),
      membership_type: z.enum(["general", "volunteer", "life"]),
    })
  )
  .handler(async ({ data, context }) => {
    const admin = context.getBase44().asServiceRole;
    const created = await admin.entities.Member.create({
      ...data,
      status: "pending",
    });
    return { id: created.id };
  });

export const reviewMember = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      id: z.string().min(3),
      status: z.enum(["approved", "rejected", "pending"]),
      notes: z.string().max(400).optional(),
    })
  )
  .handler(async ({ data, context }) => {
    if (context.user?.role !== "admin") throw new Error("শুধুমাত্র অ্যাডমিন এই কাজ করতে পারেন");
    const admin = context.getBase44().asServiceRole;
    const member = await admin.entities.Member.get(data.id);

    let membership_no = member.membership_no;
    if (data.status === "approved" && !membership_no) {
      const count = await admin.entities.Member.count({ status: "approved" });
      membership_no = `AAF-M-${String(count + 1).padStart(5, "0")}`;
    }

    await admin.entities.Member.update(data.id, {
      status: data.status,
      notes: data.notes || "",
      membership_no: membership_no || "",
      approved_at: data.status === "approved" ? new Date().toISOString() : member.approved_at || "",
    });

    let emailed = false;
    if (data.status === "approved") {
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e5e5e5;border-radius:14px;overflow:hidden">
          <div style="background:#004D40;color:#fff;padding:22px 24px">
            <p style="margin:0;font-size:13px;letter-spacing:2px;color:#D4AF37">${SITE}</p>
            <h2 style="margin:8px 0 0;font-size:20px">অভিনন্দন! আপনি অনুমোদিত সদস্য</h2>
          </div>
          <div style="padding:22px 24px;font-size:15px;color:#222">
            <p>প্রিয় ${member.full_name},</p>
            <p>আপনার সদস্যপদ অনুমোদিত হয়েছে। আপনার সদস্য নম্বর: <strong>${membership_no}</strong></p>
            <p>আপনার ডিজিটাল সদস্য সার্টিফিকেট ও QR যাচাইয়ের লিংক:</p>
            <p><a href="${SITE_URL}/certificate/${membership_no}" style="background:#004D40;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none">সার্টিফিকেট দেখুন</a></p>
          </div>
        </div>`;
      emailed = await sendMail(admin, {
        to: member.email,
        subject: `সদস্য সার্টিফিকেট ${membership_no} — ${SITE}`,
        html,
      });
    }

    return { ok: true, membership_no, emailed };
  });

export const getCertificate = createServerFn({ method: "POST" })
  .validator(z.object({ membership_no: z.string().min(3).max(40) }))
  .handler(async ({ data, context }) => {
    const admin = context.getBase44().asServiceRole;
    const rows = await admin.entities.Member.filter(
      { membership_no: data.membership_no.trim(), status: "approved" },
      { limit: 1 }
    );
    const m = (rows.items || [])[0];
    if (!m) return null;
    return {
      membership_no: m.membership_no,
      full_name: m.full_name,
      membership_type: m.membership_type,
      district: m.district,
      approved_at: m.approved_at,
      photo_url: m.photo_url,
    };
  });

/* -------------------------------- AI assistant ------------------------------- */

export const askAssistant = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ message: z.string().min(1).max(700) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();

    const activities = await base44.entities.Activity.filter({ is_published: true }, { limit: 8, sort: "-created_date" });
    const ledger = await base44.entities.LedgerEntry.aggregate({
      groupBy: "entry_type",
      sum: ["amount"],
    });

    const activityText = (activities.items || [])
      .map((a) => `- ${a.title} (${a.category || ""}, ${a.location || ""}) লক্ষ্য ${a.target_amount || 0} টাকা, সংগৃহীত ${a.raised_amount || 0} টাকা`)
      .join("\n");
    const ledgerText = (ledger.rows || [])
      .map((r) => `${r.entry_type === "income" ? "মোট আয়" : "মোট ব্যয়"}: ${r.sum_amount || 0} টাকা (${r.count}টি এন্ট্রি)`)
      .join(", ");
    const projectRows = await base44.entities.Project.filter({ is_published: true }, { sort: "sort_order", limit: 8 });
    const projectText = (projectRows.items || [])
      .map((p) => `- ${p.title} (${p.location || "বাংলাদেশ"}) লক্ষ্য ${p.target_amount || 0} টাকা, সংগৃহীত ${p.raised_amount || 0} টাকা — দান লিংক /donate?project=${p.id}`)
      .join("\n");

    const { readSiteSettings } = await import("@/lib/site-settings.server");
    const settings = await readSiteSettings(base44);

    const prompt = `তুমি "${SITE}"-এর অফিসিয়াল AI সহকারী "আল আহসান সাথী"। বাংলায় সংক্ষিপ্ত, সহানুভূতিশীল ও নির্ভুল উত্তর দাও।
সংস্থার তথ্য: হটলাইন ${settings.hotline} | ইমেইল ${settings.email}।
দান করার নিয়ম: ওয়েবসাইটের /donate পাতায় পরিমাণ ও (চাইলে) প্রকল্প নির্বাচন করে নাম, মোবাইল ও ইমেইল দিয়ে পেমেন্ট গেটওয়ে থেকে অনুদান দিতে হয়। মাসিক অটো-দানের জন্য /auto-donation পাতা। দাতা নিজের সব দান ও PDF রসিদ /my-donations পাতায় (লগইন করে) দেখতে পান।
চলমান কার্যক্রম:
${activityText || "কোনো কার্যক্রম এখনো প্রকাশিত হয়নি"}
চলমান প্রকল্প:
${projectText || "কোনো প্রকল্প এখনো প্রকাশিত হয়নি"}
হিসাব: ${ledgerText || "হিসাব এখনো এন্ট্রি হয়নি"}
ওয়েবসাইট পেজ: /donate (অনুদান), /auto-donation (মাসিক অটো-দান), /membership (সদস্যপদ), /transparency (হিসাব), /verify (রসিদ যাচাই), /my-donations (আমার দান)।

ব্যবহারকারীর প্রশ্ন: ${data.message}

নিয়ম: কখনো টাকা পেমেন্ট সম্পন্ন হয়েছে বলে দাবি করো না। শুধু গেটওয়ের যাচাইকৃত পেমেন্টেই অনুদান সম্পন্ন হয়। ট্রানজেকশন আইডি হাতে জমা দেওয়ার কোনো ব্যবস্থা নেই। রসিদ যাচাই করতে /verify পাতায় পাঠাও। উত্তর ৪-৬ বাক্যের মধ্যে রাখো।`;

    const { secrets } = await import("base44:runtime");
    const geminiKey = secrets.get("GEMINI_API_KEY");
    let reply = "";
    if (geminiKey) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.4, maxOutputTokens: 800 },
          }),
        }
      );
      const json = await response.json().catch(() => null);
      if (response.ok) {
        reply = (json?.candidates?.[0]?.content?.parts || []).map((part) => part?.text || "").join(" ").trim();
      }
    }

    if (!reply) {
      reply = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });
    }

    return { reply: String(reply || "দুঃখিত, এই মুহূর্তে উত্তর দেওয়া সম্ভব হচ্ছে না।") };
  });