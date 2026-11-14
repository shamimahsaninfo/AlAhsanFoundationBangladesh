// ভিডিও লিংক থেকে এমবেড/প্লেব্যাক ঠিকানা বের করার সহায়ক ফাংশন।

export function youtubeId(url = "") {
  const value = String(url || "").trim();
  if (!value) return "";
  const match = value.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return match ? match[1] : "";
}

export function isDirectVideo(url = "") {
  return /\.(mp4|webm|ogg|m4v)(\?|#|$)/i.test(String(url || "").trim());
}

export function videoEmbedUrl(url = "", { muted = true } = {}) {
  const id = youtubeId(url);
  if (!id) return "";
  const params = new URLSearchParams({ autoplay: "1", playsinline: "1", rel: "0", modestbranding: "1" });
  if (muted) params.set("mute", "1");
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

export function isVideoLink(url = "") {
  return Boolean(youtubeId(url)) || isDirectVideo(url);
}