export async function loadGateway(base44) {
  const page = await base44.asServiceRole.entities.PaymentGateway.list({ sort: "-updated_date", limit: 1 });
  return page.items?.[0] || null;
}

export const isGatewayReady = (config) =>
  Boolean(config?.enabled && String(config?.base_url || "").trim() && String(config?.api_key || "").trim());

export function publicGatewayInfo(config) {
  return {
    enabled: isGatewayReady(config),
    provider_name: config?.provider_name || "",
    instructions: config?.instructions || "",
  };
}

async function callProvider(config, path, body) {
  const base = String(config.base_url).trim().replace(/\/+$/, "");
  const response = await fetch(`${base}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "RT-UDDOKTAPAY-API-KEY": String(config.api_key).trim(),
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let json = {};
  try { json = text ? JSON.parse(text) : {}; } catch { json = { message: text.slice(0, 300) }; }
  return { ok: response.ok, json };
}

export async function createGatewayCheckout(config, { amount, donor, receiptNo, activityTitle, projectTitle = "", isMonthly = false, origin }) {
  const callback = `${origin}/api/payments/callback`;
  const { ok, json } = await callProvider(config, "/api/checkout", {
    full_name: donor.full_name,
    email: donor.email || "",
    amount: String(amount),
    metadata: { receipt_no: receiptNo, activity: activityTitle || "", project: projectTitle || "", monthly: isMonthly ? "1" : "0" },
    redirect_url: `${callback}?receipt=${encodeURIComponent(receiptNo)}`,
    cancel_url: `${origin}/donate?payment=canceled`,
    webhook_url: callback,
  });
  const paymentUrl = json.payment_url || json?.data?.payment_url;
  if (!ok || json.status === false || !paymentUrl) {
    throw new Error(json.message || "গেটওয়ে থেকে চেকআউট লিংক পাওয়া যায়নি। বেস URL ও API কি যাচাই করুন।");
  }
  return String(paymentUrl);
}

export async function verifyGatewayPayment(config, invoiceId) {
  const { ok, json } = await callProvider(config, "/api/verify-payment", { invoice_id: invoiceId });
  const data = json?.data && typeof json.data === "object" ? json.data : json;
  const paid = ok && (json.status === true || json.status === "COMPLETED" || data.status === "COMPLETED");
  return {
    paid,
    amount: Number(data.amount || 0),
    transaction_id: String(data.transaction_id || invoiceId),
    method: String(data.payment_method || ""),
    message: String(json.message || ""),
  };
}