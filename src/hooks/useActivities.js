import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export function useActivities({ featured = false, limit = 24 } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const query = { is_published: true };
    if (featured) query.is_featured = true;

    base44.entities.Activity
      .filter(query, { sort: "-event_date", limit })
      .then((page) => {
        if (alive) setItems(page.items || []);
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [featured, limit]);

  return { activities: items, loading };
}