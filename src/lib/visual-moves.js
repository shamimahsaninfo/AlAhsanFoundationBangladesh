import { VISUAL_SELECTOR } from "@/lib/visual-colors";

/** ভিজ্যুয়াল এডিটরে উপরে/নিচে সরানো এলিমেন্টের ক্রম প্রিভিউ ও আসল সাইটে প্রয়োগ করে। */
export function applyVisualMoves(doc, moves = [], pathname = "/") {
  if (!doc?.querySelectorAll) return;
  for (const rule of Array.isArray(moves) ? moves : []) {
    if (!rule || (rule.path !== "*" && rule.path !== pathname) || !VISUAL_SELECTOR.test(rule.selector || "")) continue;
    doc.querySelectorAll(rule.selector).forEach((element) => {
      if (element.dataset.visualMoved === rule.direction) return;
      const parent = element.parentElement;
      if (!parent) return;
      if (rule.direction === "up" && element.previousElementSibling) parent.insertBefore(element, element.previousElementSibling);
      else if (rule.direction === "down" && element.nextElementSibling) parent.insertBefore(element.nextElementSibling, element);
      element.dataset.visualMoved = rule.direction;
    });
  }
}