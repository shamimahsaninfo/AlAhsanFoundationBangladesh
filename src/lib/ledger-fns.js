import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";

const entryInput = z.object({
  entry_type: z.enum(["income", "expense"]), title: z.string().trim().min(1).max(200), category: z.string().max(100),
  amount: z.number().positive().max(100000000), entry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  method: z.string().max(60), reference: z.string().max(160), attachment_url: z.string().max(1500), description: z.string().max(4000),
});

export const deleteLedgerEntry = createServerFn({ method: "POST" }).middleware([requireUser]).validator(z.object({ id: z.string().min(3) })).handler(async ({ data, context }) => {
  if (context.user.role !== "admin") throw new Error("শুধু অ্যাডমিন হিসাব এন্ট্রি মুছতে পারেন।");
  await context.getBase44().asServiceRole.entities.LedgerEntry.delete(data.id);
  return { ok: true };
});

export const createLedgerEntry = createServerFn({ method: "POST" }).middleware([requireUser]).validator(entryInput).handler(async ({ data, context }) => {
  if (context.user.role !== "admin") throw new Error("শুধু অ্যাডমিন হিসাব এন্ট্রি করতে পারেন।");
  const base44 = context.getBase44().asServiceRole;
  const receipt_no = `AAF-L-${new Date().getUTCFullYear()}-${crypto.randomUUID().replaceAll("-", "").slice(0, 16).toUpperCase()}`;
  const record = await base44.entities.LedgerEntry.create({ ...data, receipt_no, recorded_by: context.user.id });
  const { notifyReceipt } = await import("@/lib/receipt-mail.server");
  const delivery = await notifyReceipt(base44, record, "ledger").catch(() => ({ foundation_emailed: false, emailed: false }));
  return { id: record.id, receipt_no, ...delivery };
});