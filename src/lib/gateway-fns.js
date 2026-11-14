import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";

const PUBLISHED_ORIGIN = "https://al-ahsan-foundation-bangladesh-b0808e7b.base44.app";

const requestOrigin = () => {
  try {
    const request = getRequest();
    return request ? new URL(request.url).origin : PUBLISHED_ORIGIN;
  } catch { return PUBLISHED_ORIGIN; }
};

const assertAdmin = (context) => {
  if (context.user?.role !== "admin") throw new Error("শুধুমাত্র অ্যাডমিন এই কাজ করতে পারেন");
};

export const getGatewayStatus = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const { loadGateway, publicGatewayInfo } = await import("@/lib/gateway.server");
  return publicGatewayInfo(await loadGateway(context.getBase44()));
});

export const getGatewayConfig = createServerFn({ method: "GET" }).middleware([requireUser]).handler(async ({ context }) => {
  assertAdmin(context);
  const { loadGateway } = await import("@/lib/gateway.server");
  const config = await loadGateway(context.getBase44());
  return {
    provider_name: config?.provider_name || "",
    base_url: config?.base_url || "",
    api_key_set: Boolean(config?.api_key),
    api_key_hint: config?.api_key ? `••••${String(config.api_key).slice(-4)}` : "",
    enabled: Boolean(config?.enabled),
    instructions: config?.instructions || "",
    callback_url: `${requestOrigin()}/api/payments/callback`,
  };
});

export const saveGatewayConfig = createServerFn({ method: "POST" }).middleware([requireUser]).validator(z.object({
  provider_name: z.string().trim().min(2).max(60),
  base_url: z.string().trim().url().max(300),
  api_key: z.string().trim().max(300).optional().default(""),
  enabled: z.boolean(),
  instructions: z.string().trim().max(2000).optional().default(""),
})).handler(async ({ data, context }) => {
  assertAdmin(context);
  const base44 = context.getBase44();
  const { loadGateway } = await import("@/lib/gateway.server");
  const existing = await loadGateway(base44);
  const patch = {
    provider_name: data.provider_name,
    base_url: data.base_url.replace(/\/+$/, ""),
    enabled: data.enabled,
    instructions: data.instructions,
  };
  if (data.api_key) patch.api_key = data.api_key;
  if (!existing?.api_key && !data.api_key) throw new Error("API কি দিতে হবে।");
  if (existing) await base44.entities.PaymentGateway.update(existing.id, patch);
  else await base44.entities.PaymentGateway.create(patch);
  return { ok: true, callback_url: `${requestOrigin()}/api/payments/callback` };
});

export const startDonation = createServerFn({ method: "POST" }).validator(z.object({
  full_name: z.string().trim().min(2).max(90),
  email: z.string().trim().max(120).optional().default(""),
  phone: z.string().trim().min(6).max(24),
  message: z.string().trim().max(500).optional().default(""),
  amount: z.number().min(50).max(1000000),
  activity_id: z.string().max(60).optional().default(""),
  project_id: z.string().max(60).optional().default(""),
  is_monthly: z.boolean().optional().default(false),
  frequency: z.enum(["one_time", "daily", "weekly", "biweekly", "monthly", "custom"]).optional().default("one_time"),
  interval_days: z.number().int().min(1).max(365).optional().default(30),
})).handler(async ({ data, context }) => {
  const base44 = context.getBase44();
  const { loadGateway, isGatewayReady, createGatewayCheckout } = await import("@/lib/gateway.server");
  const config = await loadGateway(base44);
  if (!isGatewayReady(config)) throw new Error("পেমেন্ট গেটওয়ে এখনো চালু হয়নি।");

  const admin = base44.asServiceRole;
  let activityTitle = "";
  if (data.activity_id) {
    const rows = await admin.entities.Activity.filter({ id: data.activity_id }, { limit: 1 });
    activityTitle = rows.items?.[0]?.title || "";
  }

  let projectTitle = "";
  if (data.project_id) {
    const rows = await admin.entities.Project.filter({ id: data.project_id }, { limit: 1 });
    projectTitle = rows.items?.[0]?.title || "";
  }

  const recurring = Boolean(data.is_monthly) || data.frequency !== "one_time";
  const receipt_no = `AAF-${new Date().getUTCFullYear()}-${crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
  const donation = await admin.entities.Donation.create({
    donor_name: data.full_name,
    email: data.email,
    phone: data.phone,
    amount: data.amount,
    message: data.message,
    activity_id: data.activity_id || "",
    activity_title: activityTitle,
    project_id: data.project_id || "",
    project_title: projectTitle,
    is_monthly: recurring,
    recurring_frequency: recurring ? data.frequency : "one_time",
    recurring_interval_days: recurring ? data.interval_days : 0,
    payment_method: "bank",
    receipt_no,
    status: "pending",
  });

  const payment_url = await createGatewayCheckout(config, {
    amount: data.amount,
    donor: data,
    receiptNo: receipt_no,
    activityTitle: activityTitle || projectTitle,
    projectTitle,
    isMonthly: recurring,
    origin: requestOrigin(),
  });
  return { payment_url, receipt_no, donation_id: donation.id };
});