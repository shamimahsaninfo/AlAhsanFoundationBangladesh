import { createFileRoute } from "@tanstack/react-router";

const DAY = 24 * 60 * 60 * 1000;

async function claimDonation(admin, { receipt, amount }) {
  if (receipt) {
    const rows = await admin.entities.Donation.filter({ receipt_no: receipt }, { limit: 1 });
    if (rows.items?.[0]) return rows.items[0];
  }
  if (!amount) return null;
  const since = new Date(Date.now() - DAY).toISOString();
  const rows = await admin.entities.Donation.filter(
    { status: "pending", amount, created_date: { $gte: since } },
    { sort: "created_date", limit: 1 },
  );
  return rows.items?.[0] || null;
}

async function finalize(admin, donation, verified) {
  if (donation.status === "verified") return donation;
  const updated = await admin.entities.Donation.update(donation.id, {
    status: "verified",
    verified_at: new Date().toISOString(),
    transaction_id: verified.transaction_id,
    notes: [verified.method, verified.message].filter(Boolean).join(" · ").slice(0, 400),
  });
  const { applyDonationEffects } = await import("@/lib/donation-settle.server");
  await applyDonationEffects(admin, { ...donation, ...updated }).catch(() => null);
  const { notifyReceipt } = await import("@/lib/receipt-mail.server");
  await notifyReceipt(admin, { ...donation, ...updated }).catch(() => null);
  return { ...donation, ...updated };
}

async function handle(request, context, isRedirect) {
  const url = new URL(request.url);
  let invoiceId = url.searchParams.get("invoice_id") || "";
  let receipt = url.searchParams.get("receipt") || "";
  if (!isRedirect) {
    const form = await request.formData().catch(() => null);
    invoiceId = invoiceId || String(form?.get("invoice_id") || "");
    receipt = receipt || String(form?.get("receipt") || "");
  }
  const done = (reason) => (isRedirect
    ? Response.redirect(`${url.origin}/donate?payment=${reason}`, 302)
    : Response.json({ ok: reason === "paid", reason }));
  if (!invoiceId) return done("missing");

  const base44 = context.getBase44();
  const { loadGateway, isGatewayReady, verifyGatewayPayment } = await import("@/lib/gateway.server");
  const config = await loadGateway(base44);
  if (!isGatewayReady(config)) return done("disabled");

  const verified = await verifyGatewayPayment(config, invoiceId);
  if (!verified.paid) return done("unverified");

  const admin = base44.asServiceRole;
  const donation = await claimDonation(admin, { receipt, amount: verified.amount });
  if (!donation) return done("notfound");

  const settled = await finalize(admin, donation, verified);
  return isRedirect
    ? Response.redirect(`${url.origin}/receipt/${encodeURIComponent(settled.receipt_no)}`, 302)
    : Response.json({ ok: true, receipt_no: settled.receipt_no });
}

export const Route = createFileRoute("/api/payments/callback")({
  server: {
    handlers: {
      GET: ({ request, context }) => handle(request, context, true),
      POST: ({ request, context }) => handle(request, context, false),
    },
  },
});