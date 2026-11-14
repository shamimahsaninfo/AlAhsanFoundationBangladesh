import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";

const assertAdmin = (context) => {
  if (context.user?.role !== "admin") throw new Error("শুধুমাত্র অ্যাডমিন এই কাজ করতে পারেন");
};

const DONATION_FIELDS = [
  "receipt_no", "donor_name", "amount", "payment_method", "status",
  "activity_title", "project_title", "message", "is_monthly", "created_date", "verified_at",
];

export const getMyDonations = createServerFn({ method: "GET" }).middleware([requireUser]).handler(async ({ context }) => {
  const email = String(context.user?.email || "").trim().toLowerCase();
  const admin = context.getBase44().asServiceRole;
  let items = [];
  for (const query of [{ email: context.user?.email || "" }, { email }]) {
    const page = await admin.entities.Donation.filter(query, { sort: "-created_date", limit: 60 }).catch(() => null);
    const rows = page?.items || [];
    if (rows.length) { items = rows; break; }
  }
  items = items.filter((row) => String(row.email || "").trim().toLowerCase() === email);
  return { email, donations: items.map((row) => Object.fromEntries(DONATION_FIELDS.map((key) => [key, row[key] ?? null]))) };
});

export const getMyRecurring = createServerFn({ method: "GET" }).middleware([requireUser]).handler(async ({ context }) => {
  const email = String(context.user?.email || "").trim().toLowerCase();
  if (!email) return { recurring: [] };
  const admin = context.getBase44().asServiceRole;
  const page = await admin.entities.RecurringDonation.filter({ email }, { sort: "-created_date", limit: 20 }).catch(() => ({ items: [] }));
  return { recurring: page.items || [] };
});

export const getReceiptPdf = createServerFn({ method: "POST" })
  .validator(z.object({ receipt_no: z.string().min(3).max(40) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const admin = base44.asServiceRole;
    const { lookupReceipt } = await import("@/lib/receipt-record.server");
    const record = await lookupReceipt(admin, data.receipt_no.trim());
    if (!record) throw new Error("রসিদ পাওয়া যায়নি");
    const { readSiteSettings } = await import("@/lib/site-settings.server");
    const settings = await readSiteSettings(base44);
    const { buildReceiptPdf } = await import("@/lib/receipt-pdf.server");
    return buildReceiptPdf(record, settings, { ledger: record.kind === "ledger" });
  });

export const listRecurringDonations = createServerFn({ method: "GET" }).middleware([requireUser]).handler(async ({ context }) => {
  assertAdmin(context);
  const admin = context.getBase44().asServiceRole;
  const page = await admin.entities.RecurringDonation.list({ sort: "-created_date", limit: 200 });
  return { recurring: page.items || [] };
});

export const setRecurringStatus = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ id: z.string().min(3), status: z.enum(["active", "paused", "cancelled"]) }))
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const admin = context.getBase44().asServiceRole;
    await admin.entities.RecurringDonation.update(data.id, { status: data.status });
    return { ok: true };
  });

export const remindRecurringDonor = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ id: z.string().min(3) }))
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const base44 = context.getBase44();
    const admin = base44.asServiceRole;
    const record = await admin.entities.RecurringDonation.get(data.id);
    if (!record.email) throw new Error("এই দাতার ইমেইল সংরক্ষিত নেই।");
    const { readSiteSettings } = await import("@/lib/site-settings.server");
    const settings = await readSiteSettings(base44);
    const link = `https://al-ahsan-foundation-bangladesh-b0808e7b.base44.app/donate?amount=${encodeURIComponent(record.amount || "")}`;
    const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto"><h2 style="color:#004D40">${settings.site_name}</h2><p>প্রিয় ${record.donor_name},</p><p>আপনার মাসিক অনুদান (৳ ${Number(record.amount || 0).toLocaleString("en-US")}) দেওয়ার সময় হয়েছে। জাযাকাল্লাহু খাইরান।</p><p><a href="${link}" style="background:#004D40;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none">এখনই অনুদান দিন</a></p><p style="font-size:12px;color:#777">হটলাইন: ${settings.hotline}</p></div>`;
    await base44.integrations.Core.SendEmail({ to: record.email, subject: `মাসিক অনুদানের অনুস্মারক — ${settings.site_name}`, html });
    await admin.entities.RecurringDonation.update(data.id, { notes: `অনুস্মারক পাঠানো হয়েছে ${new Date().toISOString().slice(0, 10)}` });
    return { ok: true };
  });