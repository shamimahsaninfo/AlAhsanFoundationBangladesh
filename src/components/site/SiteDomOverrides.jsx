import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { applyVisualOverrides } from "@/lib/visual-overrides";
import { applyVisualMoves } from "@/lib/visual-moves";

/** ভিজ্যুয়াল এডিটরে বদলানো লেখা, ছবি ও ক্রম আসল সাইটেও প্রয়োগ করে। */
export default function SiteDomOverrides({ settings }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const texts = JSON.stringify(settings.visual_texts || []);
  const images = JSON.stringify(settings.visual_images || []);
  const moves = JSON.stringify(settings.visual_moves || []);

  useEffect(() => {
    let frame = 0;
    const run = () => {
      frame = 0;
      applyVisualOverrides(document, settings, pathname);
      applyVisualMoves(document, settings.visual_moves, pathname);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(run);
    };
    run();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src", "style"] });
    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname, texts, images, moves]);

  return null;
}