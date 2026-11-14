export function formatTaka(value) {
  const n = Number(value || 0);
  return `৳ ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatCompact(value) {
  const n = Number(value || 0);
  if (n >= 10000000) return `৳ ${(n / 10000000).toFixed(2)} কোটি`;
  if (n >= 100000) return `৳ ${(n / 100000).toFixed(2)} লক্ষ`;
  return formatTaka(n);
}

export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

export function percent(raised, target) {
  const r = Number(raised || 0);
  const t = Number(target || 0);
  if (!t) return 0;
  return Math.min(100, Math.round((r / t) * 100));
}