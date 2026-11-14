export async function lookupReceipt(base44, code) {
  const ledger = code.startsWith("AAF-L-");
  const page = await base44.entities[ledger ? "LedgerEntry" : "Donation"].filter({ receipt_no: code }, { limit: 1 });
  const record = page.items?.[0];
  if (!record) return null;
  if (ledger) return { kind: "ledger", receipt_no: record.receipt_no, donor_name: record.title, title: record.title, amount: record.amount, payment_method: record.method, status: "verified", activity_title: record.category || "সাধারণ", entry_type: record.entry_type, created_date: record.created_date, verified_at: record.entry_date };
  return Object.fromEntries(["receipt_no", "donor_name", "amount", "payment_method", "status", "activity_title", "project_title", "message", "is_monthly", "created_date", "verified_at"].map((key) => [key, record[key] ?? null]));
}