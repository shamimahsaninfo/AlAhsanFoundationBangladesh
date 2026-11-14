import { nextChargeIso } from "@/lib/recurring";

const isoDate = (value) => new Date(value).toISOString().slice(0, 10);

async function activateRecurring(admin, donation) {
  if (!donation.email) return;
  const frequency = donation.recurring_frequency || "monthly";
  const interval = Number(donation.recurring_interval_days || 30);
  const rows = await admin.entities.RecurringDonation.filter(
    { email: donation.email, amount: donation.amount, status: "active" },
    { limit: 1 }
  );
  const nextChargeDate = nextChargeIso(frequency, interval);
  if (rows.items?.length) {
    await admin.entities.RecurringDonation.update(rows.items[0].id, {
      frequency,
      interval_days: interval,
      last_charged_at: new Date().toISOString(),
      next_charge_date: nextChargeDate,
      gateway_ref: donation.transaction_id || rows.items[0].gateway_ref || "",
    });
    return;
  }
  await admin.entities.RecurringDonation.create({
    donor_name: donation.donor_name,
    email: donation.email,
    phone: donation.phone || "",
    amount: Number(donation.amount || 0),
    frequency,
    interval_days: interval,
    project_id: donation.project_id || "",
    project_title: donation.project_title || "",
    status: "active",
    start_date: isoDate(new Date()),
    next_charge_date: nextChargeDate,
    last_charged_at: new Date().toISOString(),
    receipt_no: donation.receipt_no || "",
    gateway_ref: donation.transaction_id || "",
    notes: "পেমেন্ট গেটওয়ে থেকে স্বয়ংক্রিয়ভাবে তৈরি",
  });
}

async function bumpProject(admin, donation, sign) {
  if (!donation.project_id) return;
  try {
    const project = await admin.entities.Project.get(donation.project_id);
    await admin.entities.Project.update(donation.project_id, {
      raised_amount: Math.max(0, Number(project.raised_amount || 0) + sign * Number(donation.amount || 0)),
      donor_count: Math.max(0, Number(project.donor_count || 0) + sign),
    });
  } catch {
    /* project removed */
  }
}

async function bumpActivity(admin, donation, sign) {
  if (!donation.activity_id) return;
  try {
    const activity = await admin.entities.Activity.get(donation.activity_id);
    await admin.entities.Activity.update(donation.activity_id, {
      raised_amount: Math.max(0, Number(activity.raised_amount || 0) + sign * Number(donation.amount || 0)),
      donor_count: Math.max(0, Number(activity.donor_count || 0) + sign),
    });
  } catch {
    /* activity removed */
  }
}

export async function applyDonationEffects(admin, donation) {
  await bumpProject(admin, donation, 1);
  await bumpActivity(admin, donation, 1);
  if (donation.is_monthly) await activateRecurring(admin, donation);
}

export async function reverseDonationEffects(admin, donation) {
  await bumpProject(admin, donation, -1);
  await bumpActivity(admin, donation, -1);
}