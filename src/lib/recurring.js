export const FREQUENCIES = [
  { value: "daily", label: "দৈনিক", unit: "দিনে", days: 1 },
  { value: "weekly", label: "সাপ্তাহিক", unit: "সপ্তাহে", days: 7 },
  { value: "biweekly", label: "পাক্ষিক", unit: "১৫ দিনে", days: 15 },
  { value: "monthly", label: "মাসিক", unit: "মাসে", days: 30 },
  { value: "custom", label: "কাস্টম", unit: "দিনে", days: 15 },
];

export const RECURRING_OPTIONS = ["one_time", "daily", "weekly", "biweekly", "monthly", "custom"];

export function frequencyDays(frequency, interval_days) {
  if (frequency === "custom") return Math.min(365, Math.max(1, Number(interval_days) || 15));
  return FREQUENCIES.find((item) => item.value === frequency)?.days || 30;
}

export function frequencyLabel(frequency, interval_days) {
  if (frequency === "custom") return `প্রতি ${frequencyDays(frequency, interval_days)} দিনে`;
  if (frequency === "daily") return "প্রতিদিন";
  if (frequency === "weekly") return "প্রতি সপ্তাহে";
  if (frequency === "biweekly") return "প্রতি ১৫ দিনে";
  return "প্রতি মাসে";
}

export function nextChargeIso(frequency, interval_days, from = new Date()) {
  const next = new Date(from);
  next.setDate(next.getDate() + frequencyDays(frequency, interval_days));
  return next.toISOString().slice(0, 10);
}