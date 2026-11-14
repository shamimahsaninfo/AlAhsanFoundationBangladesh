import { readSiteSettings } from "@/lib/site-settings.server";

const SITE_URL = "https://al-ahsan-foundation-bangladesh-b0808e7b.base44.app";
const OFFICIAL_EMAIL = "alahsanfoundationbangladesh@gmail.com";
const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

async function deliver(base44, to, subject, html, name, attachments) {
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return false;
  try {
    const payload = { to, subject, html, from_name: name };
    if (attachments?.length) payload.attachments = attachments;
    await base44.integrations.Core.SendEmail(payload);
    return true;
  } catch { return false; }
}

export async function notifyReceipt(base44, record, kind = "donation") {
  const settings = await readSiteSettings(base44);
  const ledger = kind === "ledger";
  const title = ledger ? (record.entry_type === "income" ? "আয়ের রসিদ" : "ব্যয়ের রসিদ") : record.status === "verified" ? "যাচাইকৃত অনুদানের রসিদ" : "অনুদান যাচাইয়ের ফলাফল";
  const subject = `${title} ${record.receipt_no} — ${settings.site_name}`;
  const url = `${SITE_URL}/receipt/${encodeURIComponent(record.receipt_no)}`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
  const amount = Number(record.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const primary = /^#[0-9a-f]{6}$/i.test(settings.theme_primary) ? settings.theme_primary : "#004D40";
  const html = `<div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;border:1px solid #ddd;border-radius:16px;overflow:hidden"><div style="padding:24px;background:${primary};color:#fff"><h2>${escape(settings.site_name)}</h2><p>${escape(title)}</p></div><div style="padding:24px"><p><strong>রসিদ:</strong> ${escape(record.receipt_no)}</p><p><strong>পরিমাণ:</strong> ৳ ${amount}</p><p><strong>${ledger ? "বিবরণ" : "দাতা"}:</strong> ${escape(ledger ? record.title : record.donor_name)}</p><p><strong>খাত:</strong> ${escape(ledger ? record.category || "সাধারণ" : record.project_title || record.activity_title || "সাধারণ তহবিল")}</p><p><strong>তারিখ:</strong> ${escape(record.entry_date || record.verified_at || record.created_date)}</p>${!ledger ? `<p><strong>স্ট্যাটাস:</strong> ${record.status === "verified" ? "যাচাইকৃত" : record.status === "rejected" ? "বাতিল" : "অপেক্ষমাণ"}</p>` : ""}<p><a href="${url}">সম্পূর্ণ রসিদ দেখুন / প্রিন্ট করুন</a></p><img src="${qr}" width="150" height="150" alt="রসিদ যাচাইয়ের QR কোড" /><p>${escape(settings.receipt_footer)}</p><p style="font-size:12px;color:#777">সংযুক্ত PDF রসিদটিও সংরক্ষণ করে রাখুন।</p></div></div>`;

  let attachments;
  try {
    const { buildReceiptPdf } = await import("@/lib/receipt-pdf.server");
    const pdf = await buildReceiptPdf(record, settings, { ledger });
    attachments = [{ filename: pdf.filename, content: pdf.base64 }];
  } catch {
    attachments = undefined;
  }

  const recipients = [...new Set([OFFICIAL_EMAIL, settings.email, !ledger && record.email].filter(Boolean))];
  const results = await Promise.all(recipients.map(async (email) => [email, await deliver(base44, email, subject, html, settings.site_name, attachments)]));
  const sent = Object.fromEntries(results);
  return {
    foundation_emailed: Boolean(sent[OFFICIAL_EMAIL] || sent[settings.email]),
    emailed: !ledger && Boolean(record.email && sent[record.email]),
  };
}