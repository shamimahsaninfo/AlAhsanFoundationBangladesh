import { useCallback, useEffect, useRef, useState } from "react";
import { connectVisualFrame } from "@/lib/visual-frame";

export default function useVisualColorFrame({ settings, mode, onSelect, onNavigate }) {
  const container = useRef(null), frame = useRef(null), bridge = useRef(null);
  const latest = useRef({ settings, mode, onSelect, onNavigate });
  const [size, setSize] = useState({ width: 0, height: 620 });
  const [loading, setLoading] = useState(true), [error, setError] = useState("");
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    if (container.current) observer.observe(container.current);
    return () => { observer.disconnect(); bridge.current?.destroy(); };
  }, []);
  useEffect(() => { bridge.current?.apply(); }, [settings, mode]);
  const load = useCallback(() => {
    bridge.current?.destroy(); bridge.current = null;
    try { bridge.current = connectVisualFrame(frame.current, () => latest.current); setError(""); }
    catch (err) { setError(err.message || "প্রিভিউ খোলা যায়নি। আবার লোড করুন।"); }
    finally { setLoading(false); }
  }, []);
  const navigate = (path) => { if (frame.current?.getAttribute("src") === path) return; setLoading(true); setError(""); onSelect(null); onNavigate(path); };
  latest.current = { settings, mode, onSelect, onNavigate: navigate };
  return { container, frame, size, loading, error, load, navigate, parent: () => bridge.current?.parent(), clear: () => bridge.current?.clear(), similar: (selector) => bridge.current?.similar(selector) || [] };
}