import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export function useProjects({ limit = 12 } = {}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    base44.entities.Project
      .filter({ is_published: true }, { sort: "sort_order", limit })
      .then((page) => alive && setProjects(page.items || []))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [limit]);

  return { projects, loading };
}