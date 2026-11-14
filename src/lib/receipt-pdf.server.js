// রসিদের PDF তৈরি করে (বাংলা ফন্ট সহ) — ইমেইলে সংযুক্ত করার জন্য।

const FONT_URL =
  "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSansBengali/NotoSansBengali-Regular.ttf";

let fontCache = "";

async function loadFontBase64() {
  if (fontCache) return fontCache;
  const response = await fetch(FONT_URL);
  if (!response.ok) throw new Error("ফন্ট লোড করা যায়নি");
  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = "";
  const chunk = 0x8000;
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(index, index + chunk));
  }
  fontCache = btoa(binary);
  return fontCache;
}

const taka = (value) => `৳ ${Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const readableDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
};

export async function buildReceiptPdf(record, settings, { ledger = false } = {}) {
  const { jsPDF } = await import("jspdf");
  const base64Font = await loadFontBase64();

  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  doc.addFileToVFS("NotoSansBengali.ttf", base64Font);
  doc.addFont("NotoSansBengali.ttf", "Bengali", "normal");
  doc.setFont("Bengali");

  const primary = /^#[0-9a-f]{6}$/i.test(settings?.theme_primary || "") ? settings.theme_primary : "#004D40";
  const accent = /^#[0-9a-f]{6}$/i.test(settings?.theme_accent || "") ? settings.theme_accent : "#D4AF37";

  doc.setFillColor(primary);
  doc.rect(0, 0, 595, 110, "F");
  doc.setTextColor("#FFFFFF");
  doc.setFontSize(17);
  doc.text(settings?.site_name || "আল আহসান ফাউন্ডেশন বাংলাদেশ", 40, 48);
  doc.setFontSize(11);
  doc.setTextColor(accent);
  doc.text(ledger ? (record.entry_type === "income" ? "আয়ের রসিদ" : "ব্যয়ের রসিদ") : settings?.receipt_title || "অফিসিয়াল অনুদান রসিদ", 40, 72);
  doc.setTextColor("#FFFFFF");
  doc.setFontSize(13);
  doc.text(`রসিদ নম্বর: ${record.receipt_no || ""}`, 40, 94);

  const rows = ledger
    ? [
        ["বিবরণ", record.title || record.category || "—"],
        ["পরিমাণ", taka(record.amount)],
        ["খাত", record.category || "সাধারণ"],
        ["ধরন", record.entry_type === "income" ? "আয়" : "ব্যয়"],
        ["তারিখ", readableDate(record.entry_date || record.created_date)],
      ]
    : [
        ["দাতার নাম", record.donor_name || "—"],
        ["অনুদানের পরিমাণ", taka(record.amount)],
        ["প্রকল্প / খাত", record.project_title || record.activity_title || "সাধারণ তহবিল"],
        ["মাধ্যম", record.payment_method || "গেটওয়ে"],
        ["ধরন", record.is_monthly ? "মাসিক অনুদান" : "এককালীন দান"],
        ["তারিখ", readableDate(record.verified_at || record.created_date)],
        ["স্ট্যাটাস", record.status === "verified" ? "যাচাইকৃত" : record.status === "rejected" ? "বাতিল" : "যাচাই অপেক্ষমাণ"],
      ];

  doc.setTextColor("#111111");
  let y = 160;
  rows.forEach(([label, value], index) => {
    if (index % 2 === 0) {
      doc.setFillColor("#F5F3EC");
      doc.rect(40, y - 16, 515, 34, "F");
    }
    doc.setFontSize(11.5);
    doc.setTextColor("#555555");
    doc.text(String(label), 52, y);
    doc.setTextColor("#111111");
    doc.text(String(value).slice(0, 90), 250, y);
    y += 34;
  });

  doc.setDrawColor("#DDDDDD");
  doc.line(40, y + 6, 555, y + 6);
  doc.setFontSize(10);
  doc.setTextColor("#555555");
  const footer = doc.splitTextToSize(settings?.receipt_footer || "এই রসিদটি QR কোড স্ক্যান করে যাচাই করা যায়।", 500);
  doc.text(footer, 40, y + 30);
  doc.text(`হটলাইন: ${settings?.hotline || ""} · ইমেইল: ${settings?.email || ""}`, 40, y + 30 + footer.length * 14 + 6);
  doc.text(`যাচাই করুন: /receipt/${record.receipt_no || ""}`, 40, y + 30 + footer.length * 14 + 24);

  const output = doc.output("arraybuffer");
  const bytes = new Uint8Array(output);
  let binary = "";
  const chunk = 0x8000;
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(index, index + chunk));
  }

  return { filename: `${record.receipt_no || "receipt"}.pdf`, base64: btoa(binary) };
}